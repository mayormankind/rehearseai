'use client';

import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  stream: MediaStream | null;
  isActive: boolean;
}

export function Waveform({ stream, isActive }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!stream || !isActive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctxRef.current = null;
      analyserRef.current = null;
      drawIdle();
      return;
    }

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.8;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    ctxRef.current = audioCtx;
    analyserRef.current = analyser;

    const buffer = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(buffer);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#F59E0B';
      ctx.beginPath();

      const step = width / buffer.length;
      let x = 0;
      for (let i = 0; i < buffer.length; i++) {
        const y = (buffer[i] / 255) * height;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += step;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioCtx.state !== 'closed') {
        audioCtx.close();
      }
    };
  }, [stream, isActive]);

  function drawIdle() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#2D2620';
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }

  return (
    <div className="w-full rounded-xl bg-secondary overflow-hidden" style={{ height: 80 }}>
      <canvas ref={canvasRef} className="w-full h-full" width={800} height={80} />
    </div>
  );
}
