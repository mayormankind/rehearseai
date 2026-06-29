'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;

    const waves = [
      { freq: 0.018, amp: 80,  speed: 0.022, phase: 0,    color: 'rgba(245,158,11,'  },
      { freq: 0.022, amp: 60,  speed: 0.028, phase: 1.2,  color: 'rgba(251,191,36,'  },
      { freq: 0.014, amp: 100, speed: 0.016, phase: 2.4,  color: 'rgba(249,115,22,'  },
      { freq: 0.026, amp: 45,  speed: 0.034, phase: 0.8,  color: 'rgba(234,88,12,'   },
      { freq: 0.012, amp: 120, speed: 0.012, phase: 3.6,  color: 'rgba(245,158,11,'  },
    ];

    const drawWave = (
      wave: typeof waves[0],
      alpha: number,
      lineWidth: number,
      blurSize: number,
    ) => {
      const { freq, amp, speed, phase, color } = wave;
      const cy = canvas.height / 2;
      ctx.beginPath();
      ctx.moveTo(0, cy + Math.sin(phase + t * speed) * amp);
      for (let x = 1; x <= canvas.width; x += 2) {
        const y = cy + Math.sin(phase + x * freq + t * speed) * amp * Math.sin(Math.PI * x / canvas.width);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `${color}${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.shadowColor = `${color}0.9)`;
      ctx.shadowBlur = blurSize;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawOrb = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const pulse = 1 + 0.08 * Math.sin(t * 0.03);
      const r = Math.min(canvas.width, canvas.height) * 0.18 * pulse;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(245,158,11,0.12)');
      grad.addColorStop(0.5, 'rgba(249,115,22,0.06)');
      grad.addColorStop(1, 'rgba(249,115,22,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      const ring1 = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r);
      ring1.addColorStop(0, 'rgba(245,158,11,0)');
      ring1.addColorStop(0.5, 'rgba(245,158,11,0.35)');
      ring1.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
      ctx.strokeStyle = ring1;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(245,158,11,0.7)';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0D0B09';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawOrb();

      waves.forEach((w, i) => {
        drawWave(w, 0.15 + i * 0.05, 1, 4);
        drawWave(w, 0.35 + i * 0.06, 1.5, 18);
        drawWave(w, 0.6,             2.5, 35);
      });

      t += 1;
      rafRef.current = requestAnimationFrame(render);
    };

    render();

    const fadeTimer = setTimeout(() => setFading(true), 2200);
    const doneTimer = setTimeout(onDone, 2900);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        transition: 'opacity 0.7s ease-out',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      <div
        className="relative z-10 flex flex-col items-center gap-5 select-none"
        style={{ animation: 'splashFadeUp 0.8s ease-out forwards' }}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl scale-110" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-primary">
            <Mic className="w-10 h-10 text-[#0D0B09]" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Rehearse<span className="text-primary">AI</span>
          </h1>
          <p className="mt-2 text-sm tracking-[0.25em] uppercase text-white/40 font-medium">
            AI‑Powered Presentation Coach
          </p>
        </div>

        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              style={{
                animation: `splashDot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes splashDot {
          0%, 80%, 100% { transform: scale(1);   opacity: 0.5; }
          40%            { transform: scale(1.6); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
