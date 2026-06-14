'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  label: string;
  score: number;
}

interface AnalyticsChartProps {
  data: DataPoint[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Score Progress</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          No data yet — complete your first session.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Score Progress</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip
              formatter={(v: number) => [`${v}`, 'Score']}
              contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
