'use client';

import { useState, useCallback } from 'react';
import type { AnalysisResult } from '@/types/analysis';

interface UseSpeechAnalysisReturn {
  isAnalyzing: boolean;
  analysis: AnalysisResult | null;
  error: string | null;
  fetchAnalysis: (sessionId: string) => Promise<void>;
  analyzeAudio: (audioBlob: Blob, title?: string, duration?: number) => Promise<string | null>;
}

export function useSpeechAnalysis(): UseSpeechAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async (sessionId: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (!res.ok) throw new Error('Failed to fetch session');
      const { data } = await res.json();
      const a = Array.isArray(data.analysis) ? data.analysis[0] : data.analysis;
      if (a) {
        setAnalysis({
          transcription: data.transcript ?? '',
          score: a.overall_score,
          feedback: (a.feedback ?? []).map((f: any) => f.message as string),
          metrics: {
            pace: a.pace_score,
            clarity: a.clarity_score,
            confidence: a.confidence_score,
            filler_words: a.filler_words_count,
            word_count: a.word_count,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeAudio = useCallback(
    async (audioBlob: Blob, title = 'Untitled Recording', duration = 0): Promise<string | null> => {
      setIsAnalyzing(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('title', title);
        formData.append('duration', String(duration));

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Upload failed');

        const { sessionId } = uploadData as { sessionId: string };

        const analyzeRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const analyzeData = await analyzeRes.json();
        if (!analyzeRes.ok) throw new Error(analyzeData.error ?? 'Analysis failed');

        const a = analyzeData.data?.analysis;
        if (a) {
          setAnalysis({
            transcription: analyzeData.data.transcription ?? '',
            score: a.overall_score,
            feedback: (analyzeData.data.feedback ?? []).map((f: any) => f.message as string),
            metrics: {
              pace: a.pace_score,
              clarity: a.clarity_score,
              confidence: a.confidence_score,
              filler_words: a.filler_words_count,
              word_count: a.word_count,
            },
          });
        }
        return sessionId;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  return { isAnalyzing, analysis, error, fetchAnalysis, analyzeAudio };
}
