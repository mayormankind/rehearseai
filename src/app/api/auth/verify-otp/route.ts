import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createServiceClient } from '@/lib/supabase/server';

function hashOtp(otp: string) {
  return createHash('sha256').update(otp).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { email, otp, password } = await request.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Look up pending verification
    const { data: pending, error: fetchError } = await supabase
      .from('pending_verifications')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !pending) {
      return NextResponse.json({ error: 'No pending verification found. Please register again.' }, { status: 400 });
    }

    // Check expiry
    if (new Date(pending.expires_at) < new Date()) {
      await supabase.from('pending_verifications').delete().eq('email', email);
      return NextResponse.json({ error: 'Code has expired. Please register again to get a new code.' }, { status: 400 });
    }

    // Verify OTP hash
    if (hashOtp(otp) !== pending.otp_hash) {
      return NextResponse.json({ error: 'Invalid code. Please check and try again.' }, { status: 400 });
    }

    // OTP is valid — create the Supabase auth user (email already confirmed)
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: pending.name },
    });

    if (createError) {
      // User might already exist (previous partial attempt) — confirm their email instead
      if (createError.message.toLowerCase().includes('already') || createError.code === 'email_exists') {
        const { data: list } = await supabase.auth.admin.listUsers();
        const existing = list?.users.find((u) => u.email === email);
        if (existing) {
          await supabase.auth.admin.updateUserById(existing.id, {
            email_confirm: true,
            password,
            user_metadata: { name: pending.name },
          });
        }
      } else {
        console.error('[verify-otp] createUser error:', createError);
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }
    }

    // Clean up pending verification
    await supabase.from('pending_verifications').delete().eq('email', email);

    console.log('[verify-otp] User verified and created:', userData?.user?.id ?? 'existing', email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[verify-otp] Unexpected error:', err);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
