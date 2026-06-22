'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Mic, MailCheck } from 'lucide-react';

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

  const verifyCode = async (token: string) => {
    if (!email) {
      toast.error('Email missing. Please register again.');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (error) {
      toast.error(error.message);
      setDigits(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 mb-4 shadow-lg shadow-primary/25">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Rehearse<span className="text-primary">AI</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Check your inbox and enter the code below</p>
        </div>

        <div className="p-8 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/5 space-y-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
              <MailCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Verify your email</h2>
            {email && (
              <p className="text-sm text-muted-foreground">
                We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center gap-3">
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
                  className="w-12 h-14 text-center text-xl font-bold border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50"
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
              disabled={isLoading || digits.some((d) => !d)}
            >
              {isLoading ? 'Verifying…' : 'Verify Email'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            You can also click the link in the email to verify instantly.
          </p>
        </div>
      </div>
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
