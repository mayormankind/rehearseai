import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AnalyticsChart } from '@/components/charts/AnalyticsChart';
import { formatDate, formatDuration } from '@/lib/utils';
import { BarChart3, Mic, TrendingUp, Trophy } from 'lucide-react';

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
    <div className="overflow-y-auto p-4 md:p-8 lg:pl-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm md:text-base">
              Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name.split(' ')[0]}` : user?.email ? `, ${user.email.split('@')[0]}` : ''}. Track your presentation progress.
            </p>
          </div>
          <Link
            href="/dashboard/record"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:brightness-110 transition-all active:scale-[0.97] text-sm"
          >
            <Mic className="w-4 h-4" />
            New Recording
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Total Sessions', value: totalSessions, icon: <BarChart3 className="w-5 h-5" /> },
            { label: 'Avg Score',      value: avgScore ?? '—', icon: <TrendingUp className="w-5 h-5" /> },
            { label: 'Best Score',     value: bestScore ?? '—', icon: <Trophy className="w-5 h-5" /> },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="text-muted-foreground mb-3">{icon}</div>
              <p className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
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
            <div className="p-12 md:p-16 rounded-2xl border border-dashed border-border bg-card text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No sessions yet</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                Start your journey by recording your first presentation and getting AI-powered feedback.
              </p>
              <Link
                href="/dashboard/record"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:brightness-110 transition-all active:scale-[0.97] text-sm"
              >
                <Mic className="w-4 h-4" />
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
                    className="group flex items-center justify-between p-4 md:p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
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
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            a.overall_score >= 75
                              ? 'border-accent text-accent'
                              : a.overall_score >= 50
                              ? 'border-primary text-primary'
                              : 'border-destructive text-destructive'
                          }`}
                        >
                          <span className="text-xs font-bold tabular-nums">{a.overall_score}</span>
                        </div>
                      )}
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          s.status === 'completed'
                            ? 'bg-accent/10 text-accent'
                            : s.status === 'failed'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-primary/10 text-primary'
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
