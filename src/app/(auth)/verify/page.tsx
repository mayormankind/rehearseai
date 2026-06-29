'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { MailCheck } from 'lucide-react';

const CODE_LENGTH = 6;

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const supabase = createClient();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every(Boolean)) {
      verifyCode(next.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
    if (pasted.length === CODE_LENGTH) {
      verifyCode(pasted);
    }
  };

  const verifyCode = async (otp: string) => {
    if (!email) {
      toast.error('Email missing. Please register again.');
      return;
    }
    setIsLoading(true);

    const password = sessionStorage.getItem('rehearse_pending_pw') ?? '';

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password }),
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(json.error ?? 'Invalid code. Please try again.');
      setDigits(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      setIsLoading(false);
      return;
    }

    // User is now created & confirmed — sign them in
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    sessionStorage.removeItem('rehearse_pending_pw');

    if (signInError) {
      toast.error('Verified! But auto sign-in failed — please sign in manually.');
      router.push('/login');
      return;
    }

    toast.success('Email verified! Welcome to RehearseAI.');
    router.push('/dashboard');
    router.refresh();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = digits.join('');
    if (token.length < CODE_LENGTH) {
      toast.error('Please enter all 6 digits.');
      return;
    }
    verifyCode(token);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
        <MailCheck className="w-6 h-6" />
      </div>

      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-foreground">Check your inbox</h1>
        <p className="text-sm text-muted-foreground">
          {email ? (
            <>We sent a 6-digit code to{' '}<span className="text-foreground font-medium">{email}</span></>
          ) : (
            'Enter the 6-digit code from your email'
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              className="flex-1 h-14 text-center text-xl font-bold rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50 max-w-[52px]"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || digits.some((d) => !d)}
        >
          {isLoading ? 'Verifying…' : 'Verify Email'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        You can also click the link in the email to verify instantly.
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
