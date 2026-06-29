'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  Mic, Bot, TrendingUp, ChevronRight, Zap, ShieldCheck,
  BarChart2, Play, ArrowRight, CheckCircle, Star,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    let t = 0;
    const waves = [
      { f: 0.020, a: 0.28, s: 0.020, p: 0.0, c: 'rgba(245,158,11,' },
      { f: 0.025, a: 0.18, s: 0.028, p: 1.4, c: 'rgba(251,191,36,' },
      { f: 0.015, a: 0.35, s: 0.014, p: 2.8, c: 'rgba(249,115,22,' },
      { f: 0.030, a: 0.12, s: 0.036, p: 0.9, c: 'rgba(234,88,12,'  },
    ];
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cy = canvas.height / 2;
      waves.forEach((w, idx) => {
        [
          { alpha: 0.12, lw: 1,   blur: 0  },
          { alpha: 0.30, lw: 1.5, blur: 14 },
          { alpha: 0.55, lw: 2,   blur: 28 },
        ].forEach(({ alpha, lw, blur }) => {
          ctx.beginPath();
          for (let x = 0; x <= canvas.width; x += 2) {
            const envelope = Math.sin(Math.PI * x / canvas.width);
            const y = cy + Math.sin(w.p + x * w.f + t * w.s) * w.a * canvas.height * envelope;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `${w.c}${alpha})`;
          ctx.lineWidth = lw;
          ctx.shadowColor = `${w.c}0.8)`;
          ctx.shadowBlur = blur;
          ctx.stroke();
          ctx.shadowBlur = 0;
          void idx;
        });
      });
      t++;
      rafRef.current = requestAnimationFrame(render);
    };
    render();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />;
}

const features = [
  {
    icon: Mic,
    title: 'Smart Recording',
    desc: 'High-fidelity audio capture with real-time silence detection and automatic segmentation.',
  },
  {
    icon: Bot,
    title: 'AI Analysis',
    desc: 'GPT-powered scoring across pace, clarity, filler words, engagement, and confidence.',
  },
  {
    icon: BarChart2,
    title: 'Progress Tracking',
    desc: 'Session-over-session analytics and trend charts so you can see measurable improvement.',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    desc: 'Get a detailed report within seconds of finishing your recording — no waiting.',
  },
  {
    icon: ShieldCheck,
    title: 'Private & Secure',
    desc: 'All recordings are encrypted and deleted from servers after analysis.',
  },
  {
    icon: TrendingUp,
    title: 'Coaching Insights',
    desc: 'Personalised weekly tips generated from your unique speaking patterns.',
  },
];

const steps = [
  { num: '01', title: 'Record', desc: 'Hit record and deliver your presentation naturally — we handle the rest.' },
  { num: '02', title: 'Analyse', desc: 'Our AI dissects every element of your speech in real time.' },
  { num: '03', title: 'Improve', desc: 'Act on precise, actionable feedback and watch your scores climb.' },
];

const testimonials = [
  { name: 'Amara O.', role: 'Product Manager', quote: 'My presentation confidence went from 5/10 to 8/10 in three weeks. The feedback is scarily accurate.' },
  { name: 'James K.', role: 'Sales Lead', quote: 'I used to say "um" every few seconds. RehearseAI caught it on day one. Game-changer.' },
  { name: 'Priya S.', role: 'PhD Candidate', quote: 'Prepping for my dissertation defence, this tool was invaluable. Detailed, instant, and free from bias.' },
];

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const isLoggedIn = !isLoading && !!user;

  const primaryHref = isLoggedIn ? '/dashboard' : '/register';
  const primaryLabel = isLoggedIn ? 'Go to Dashboard' : 'Start for Free';
  const secondaryHref = isLoggedIn ? '/dashboard' : '/login';
  const secondaryLabel = isLoggedIn ? 'Open Dashboard' : 'Sign In';

  return (
    <div className="min-h-screen bg-[#0D0B09] text-white overflow-x-hidden">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0D0B09]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F59E0B]">
              <Mic className="w-4 h-4 text-[#0D0B09]" />
            </span>
            Rehearse<span className="text-[#F59E0B]">AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F59E0B] text-[#0D0B09] text-sm font-semibold hover:brightness-110 transition-all"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-[#F59E0B] text-[#0D0B09] text-sm font-semibold hover:brightness-110 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroCanvas />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B09]/40 via-transparent to-[#0D0B09]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/8 text-[#F59E0B] text-sm font-medium mb-2">
            <Zap className="w-3.5 h-3.5" />
            Used by 12,000+ speakers
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]">
            Present with{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Confidence
            </span>
            ,<br />Powered by AI
          </h1>

          <p className="text-lg sm:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed">
            Record your presentations and get instant, in-depth AI feedback on pace,
            clarity, filler words, and overall delivery — so you improve every single time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#F59E0B] text-[#0D0B09] font-semibold text-base hover:brightness-110 transition-all active:scale-[0.98]"
            >
              {primaryLabel} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all"
            >
              <Play className="w-4 h-4 text-[#F59E0B]" />
              {secondaryLabel}
            </Link>
          </div>

          <p className="text-xs text-white/30 pt-1">No credit card required · Free to get started</p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '12 k+', label: 'Presentations Analysed' },
            { val: '4.9 ★', label: 'Average Rating' },
            { val: '3 min', label: 'Avg. Time to Insight' },
            { val: '94 %', label: 'Users Report Improvement' },
          ].map(({ val, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-[#F59E0B]">{val}</p>
              <p className="mt-1 text-sm text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16 space-y-3">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#F59E0B]">Features</p>
          <h2 className="text-4xl sm:text-5xl font-bold">Everything you need to level up</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            From recording to reporting, RehearseAI covers every step of your presentation journey.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative p-6 rounded-2xl border border-white/8 bg-white/[0.025] hover:border-[#F59E0B]/30 hover:bg-[#F59E0B]/[0.04] transition-all duration-300"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#F59E0B]/12 mb-4 group-hover:bg-[#F59E0B]/20 transition-colors">
                <Icon className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-white/[0.02] border-y border-white/5 py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#F59E0B]">Process</p>
            <h2 className="text-4xl sm:text-5xl font-bold">Three steps to mastery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className="relative flex flex-col items-center text-center gap-4">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+48px)] w-[calc(100%-96px)] h-px bg-gradient-to-r from-[#F59E0B]/30 to-transparent" />
                )}
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/8 text-[#F59E0B] text-xl font-bold">
                  {num}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg mb-1">{title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16 space-y-3">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#F59E0B]">Testimonials</p>
          <h2 className="text-4xl sm:text-5xl font-bold">Trusted by presenters worldwide</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, quote }) => (
            <div key={name} className="p-6 rounded-2xl border border-white/8 bg-white/[0.03] flex flex-col gap-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/65 text-sm leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
              <div>
                <p className="font-semibold text-white text-sm">{name}</p>
                <p className="text-white/40 text-xs">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 pb-28">
        <div className="max-w-3xl mx-auto text-center rounded-3xl border border-[#F59E0B]/15 bg-[#151210] p-12 sm:p-16 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#F59E0B]/8 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#F59E0B]/5 blur-3xl" />
          <div className="relative z-10 space-y-5">
            <h2 className="text-4xl sm:text-5xl font-bold">Ready to sound like a pro?</h2>
            <p className="text-white/55 text-lg">
              Join thousands of speakers who use RehearseAI to practise smarter, not harder.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#F59E0B] text-[#0D0B09] font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
              >
                {primaryLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs text-white/40 pt-1">
              {['Free forever plan', 'No credit card', 'Cancel anytime'].map((t) => (
                <li key={t} className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[#F59E0B]" />{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[#F59E0B]">
              <Mic className="w-3.5 h-3.5 text-[#0D0B09]" />
            </span>
            Rehearse<span className="text-[#F59E0B]">AI</span>
          </div>
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} RehearseAI. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
