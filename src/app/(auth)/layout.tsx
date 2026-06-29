import Link from 'next/link';
import { Mic } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Left brand panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[38%] flex-col justify-between p-12 bg-card border-r border-border relative overflow-hidden flex-shrink-0">
        {/* Subtle dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #F59E0B 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Brand mark */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
              <Mic className="w-4.5 h-4.5 text-primary-foreground" />
            </span>
            <span className="text-xl font-bold text-foreground">
              Rehearse<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        {/* Value copy */}
        <div className="relative z-10 space-y-7">
          <h2 className="text-[2rem] font-bold text-foreground leading-snug tracking-tight">
            Master your voice,<br />own every room.
          </h2>
          <ul className="space-y-3.5">
            {[
              'Instant AI feedback on pace, clarity & delivery',
              'Track improvement across every session',
              'Private & secure — recordings deleted after analysis',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 w-4 h-4 rounded-full border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Social proof */}
        <div className="relative z-10">
          <blockquote className="border-l-2 border-primary/25 pl-4 space-y-1.5">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              &ldquo;My presentation confidence went from 5/10 to 8/10 in three weeks.
              The feedback is scarily accurate.&rdquo;
            </p>
            <footer className="text-xs text-muted-foreground">
              Amara O. &mdash; Product Manager
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 min-h-screen">
        {/* Mobile brand mark */}
        <div className="lg:hidden mb-10 flex flex-col items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
              <Mic className="w-4.5 h-4.5 text-primary-foreground" />
            </span>
            <span className="text-xl font-bold text-foreground">
              Rehearse<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
