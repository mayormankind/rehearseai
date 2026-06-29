import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomInt } from 'crypto';
import { createServiceClient } from '@/lib/supabase/server';
import { transporter } from '@/lib/email/mailer';
import { buildVerificationEmail } from '@/lib/email/templates/verificationEmail';

const FROM_ADDRESS = `"RehearseAI" <${process.env.EMAIL_USER}>`;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function hashOtp(otp: string) {
  return createHash('sha256').update(otp).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    // Generate our own 6-digit numeric OTP
    const otp = String(randomInt(100000, 999999));
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

    // Upsert pending verification (replaces any previous attempt for this email)
    const { error: dbError } = await supabase
      .from('pending_verifications')
      .upsert({ email, name, otp_hash: otpHash, expires_at: expiresAt });

    if (dbError) {
      console.error('[send-verification] DB upsert failed:', dbError);
      return NextResponse.json({ error: 'Could not store verification. Try again.' }, { status: 500 });
    }

    const { subject, html } = buildVerificationEmail({ name, otp, confirmationLink: `${appUrl}/verify?email=${encodeURIComponent(email)}`, appUrl });

    try {
      await transporter.verify();
    } catch (smtpErr) {
      console.error('[send-verification] SMTP connection failed:', smtpErr);
      return NextResponse.json({ error: 'Email service unavailable. Check SMTP credentials.' }, { status: 500 });
    }

    const info = await transporter.sendMail({ from: FROM_ADDRESS, to: email, subject, html });

    console.log('[send-verification] OTP sent:', info.messageId, '→', email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[send-verification] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to send verification email.' }, { status: 500 });
  }
}
