import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { transporter } from '@/lib/email/mailer';
import { buildVerificationEmail } from '@/lib/email/templates/verificationEmail';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        data: { name },
        redirectTo: `${appUrl}/dashboard`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const otp = data.properties.email_otp;
    const confirmationLink = data.properties.action_link;

    const { subject, html } = buildVerificationEmail({
      name,
      otp,
      confirmationLink,
      appUrl,
    });

    await transporter.sendMail({
      from: `"RehearseAI" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[send-verification] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to send verification email.' }, { status: 500 });
  }
}
