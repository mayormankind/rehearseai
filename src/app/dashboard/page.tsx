import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AnalyticsChart } from '@/components/charts/AnalyticsChart';
import { formatDate, formatDuration } from '@/lib/utils';
import { BarChart3, TrendingUp, Trophy } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sessions } = user
    ? await supabase
        .from('sessions')
        .select('id, title, duration, status, created_at, analysis ( overall_score )')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
    : { data: [] };

  const completed = (sessions ?? []).filter((s: any) => s.status === 'completed');
  const totalSessions = sessions?.length ?? 0;
  const avgScore =
    completed.length > 0
      ? Math.round(
          completed.reduce((sum: number, s: any) => {
            const a = Array.isArray(s.analysis) ? s.analysis[0] : s.analysis;
            return sum + (a?.overall_score ?? 0);
          }, 0) / completed.length
        )
      : null;
  const bestScore =
    completed.length > 0
      ? Math.max(
          ...completed.map((s: any) => {
            const a = Array.isArray(s.analysis) ? s.analysis[0] : s.analysis;
            return a?.overall_score ?? 0;
          })
        )
      : null;

  const chartData = [...completed]
    .reverse()
    .slice(-8)
    .map((s: any) => {
      const a = Array.isArray(s.analysis) ? s.analysis[0] : s.analysis;
      return {
        label: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: a?.overall_score ?? 0,
      };
    });

  const recentSessions = (sessions ?? []).slice(0, 5);

  return (
    <div className="p-4 md:p-8 lg:pl-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}. Track your presentation progress.
            </p>
          </div>
          <Link
            href="/dashboard/record"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            New Recording
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Total Sessions', value: totalSessions, icon: <BarChart3 className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
            { label: 'Avg Score', value: avgScore ?? '—', icon: <TrendingUp className="w-6 h-6" />, color: 'from-emerald-500 to-emerald-600' },
            { label: 'Best Score', value: bestScore ?? '—', icon: <Trophy className="w-6 h-6" />, color: 'from-amber-500 to-amber-600' },
          ].map(({ label, value, icon, color }) => (
            <div
              key={label}
              className="group relative overflow-hidden p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="relative">
                <div className="text-primary mb-2 block">{icon}</div>
                <p className="text-3xl md:text-4xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <AnalyticsChart data={chartData} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Sessions</h2>
            <Link href="/dashboard/history" className="text-sm text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>

          {recentSessions.length === 0 ? (
            <div className="p-12 md:p-16 rounded-2xl border border-dashed border-border bg-card/50 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No sessions yet</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                Start your journey by recording your first presentation and getting AI-powered feedback.
              </p>
              <Link
                href="/dashboard/record"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Record your first session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((s: any) => {
                const a = Array.isArray(s.analysis) ? s.analysis[0] : s.analysis;
                return (
                  <Link
                    key={s.id}
                    href={`/dashboard/session/${s.id}`}
                    className="group flex items-center justify-between p-4 md:p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {s.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(s.created_at)} · {formatDuration(s.duration)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 ml-4">
                      {a?.overall_score !== undefined && (
                        <div className="text-center">
                          <p className="text-xl md:text-2xl font-bold text-foreground">{a.overall_score}</p>
                          <p className="text-xs text-muted-foreground hidden md:block">score</p>
                        </div>
                      )}
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          s.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : s.status === 'failed'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
