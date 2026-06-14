'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AudioRecorder } from '@/components/audio/AudioRecorder';

type Stage = 'setup' | 'record' | 'uploading' | 'analyzing';

export default function RecordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('setup');
  const [title, setTitle] = useState('');

  const handleStart = () => {
    if (!title.trim()) {
      toast.error('Please enter a session title before recording.');
      return;
    }
    setStage('record');
  };

  const handleRecordingComplete = async (blob: Blob, duration: number) => {
    setStage('uploading');
    toast.info('Uploading recording…');

    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      formData.append('title', title.trim());
      formData.append('duration', String(duration));

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Upload failed');

      const { sessionId } = uploadData;
      toast.success('Upload complete. Analyzing…');
      setStage('analyzing');

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) throw new Error(analyzeData.error ?? 'Analysis failed');

      toast.success('Analysis complete!');
      router.push(`/dashboard/session/${sessionId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
      setStage('record');
    }
  };

  return (
    <div className="p-4 md:p-8 pt-16 lg:pt-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">New Recording</h1>
          <p className="text-muted-foreground mt-1">Record your presentation and get AI-powered feedback.</p>
        </div>

        {(stage === 'setup' || stage === 'record') && (
          <div className="p-4 md:p-6 rounded-xl border border-border bg-card space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Session Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q3 Investor Pitch"
                disabled={stage === 'record'}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>

            {stage === 'setup' ? (
              <button
                onClick={handleStart}
                className="w-full py-3 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Set Up Recorder
              </button>
            ) : (
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            )}
          </div>
        )}

        {(stage === 'uploading' || stage === 'analyzing') && (
          <div className="p-8 md:p-12 rounded-xl border border-border bg-card flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-lg font-semibold text-foreground">
              {stage === 'uploading' ? 'Uploading recording…' : 'Analyzing with AI…'}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              {stage === 'analyzing'
                ? 'Transcribing audio and generating personalised feedback. This may take a minute.'
                : 'Securely uploading your audio file.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
