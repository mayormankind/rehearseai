'use client';

import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Info, AlertTriangle, XCircle } from 'lucide-react';

interface FeedbackItem {
  id?: string;
  category: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
}

interface AnalysisData {
  overall_score: number;
  pace_score?: number;
  clarity_score?: number;
  confidence_score?: number;
  filler_words_count?: number;
  word_count?: number;
  feedback?: FeedbackItem[];
}

interface FeedbackDisplayProps {
  analysis: AnalysisData;
  suggestions?: string[];
  transcript?: string;
}

const severityColors: Record<string, string> = {
  info:    'bg-secondary border-border text-foreground',
  warning: 'bg-primary/8 border-primary/25 text-primary',
  error:   'bg-destructive/8 border-destructive/25 text-destructive',
};

const severityIcons: Record<string, React.ReactNode> = {
  info: <Info className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  error: <XCircle className="w-4 h-4" />,
};

function ScoreGauge({ score }: { score: number }) {
  const color =
    score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center border-8 font-bold text-3xl text-foreground"
        style={{ borderColor: color }}
      >
        {score}
      </div>
      <span className="text-xs text-muted-foreground uppercase tracking-wide">Overall Score</span>
    </div>
  );
}

export function FeedbackDisplay({ analysis, suggestions = [], transcript }: FeedbackDisplayProps) {
  const radarData = [
    { metric: 'Pace', score: analysis.pace_score ?? 0 },
    { metric: 'Clarity', score: analysis.clarity_score ?? 0 },
    { metric: 'Confidence', score: analysis.confidence_score ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-6">Performance Overview</h3>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <ScoreGauge score={analysis.overall_score} />

          <div className="flex-1 w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2D2620" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#8A7060', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="score"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Tooltip
                  formatter={(v: number) => [`${v}/100`, 'Score']}
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.75rem' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-3 min-w-32 w-full lg:w-auto">
            {[
              { label: 'Pace', value: analysis.pace_score },
              { label: 'Clarity', value: analysis.clarity_score },
              { label: 'Confidence', value: analysis.confidence_score },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{value ?? '—'}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${value ?? 0}%` }}
                  />
                </div>
              </div>
            ))}
            {analysis.filler_words_count !== undefined && (
              <p className="text-xs text-muted-foreground pt-1">
                Filler words: <span className="font-semibold text-foreground">{analysis.filler_words_count}</span>
              </p>
            )}
            {analysis.word_count !== undefined && (
              <p className="text-xs text-muted-foreground">
                Word count: <span className="font-semibold text-foreground">{analysis.word_count}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {analysis.feedback && analysis.feedback.length > 0 && (
        <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Detailed Feedback</h3>
          {analysis.feedback.map((item, i) => (
            <div
              key={item.id ?? i}
              className={`flex gap-3 p-3 rounded-lg border text-sm ${severityColors[item.severity]}`}
            >
              <span className="font-bold shrink-0">{severityIcons[item.severity]}</span>
              <div>
                <span className="font-semibold capitalize mr-2">{item.category.replace('_', ' ')}</span>
                {item.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Suggestions</h3>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground">
                <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {transcript && (
        <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Transcript</h3>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{transcript}</p>
        </div>
      )}
    </div>
  );
}
