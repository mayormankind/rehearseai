'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { formatDate, formatDuration } from '@/lib/utils';
import { Trash2, Search } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  duration: number;
  status: string;
  created_at: string;
  analysis: { overall_score?: number } | null;
}

export default function HistoryPage() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'failed' | 'processing'>('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('sessions')
      .select('id, title, duration, status, created_at, analysis ( overall_score )')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const transformedData = (data || []).map((session: any) => ({
      ...session,
      analysis: Array.isArray(session.analysis) ? session.analysis[0] || null : session.analysis,
    }));

    setSessions(transformedData);
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    setDeletingId(sessionId);

    try {
      const { error } = await supabase.from('sessions').delete().eq('id', sessionId);

      if (error) throw error;

      toast.success('Session deleted successfully');
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete session');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-4 md:p-8 pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Session History</h1>
            <p className="text-muted-foreground mt-1">{sessions.length} recordings</p>
          </div>
          <Link
            href="/dashboard/record"
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:brightness-110 transition-all active:scale-[0.97]"
          >
            New Recording
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-12 md:p-16 rounded-2xl border border-dashed border-border bg-card text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {sessions.length === 0 ? 'No sessions yet' : 'No matching sessions'}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              {sessions.length === 0
                ? 'Your recording history will appear here once you start practicing.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {sessions.length === 0 && (
              <Link
                href="/dashboard/record"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:brightness-110 transition-all active:scale-[0.97] text-sm"
              >
                Record your first session
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((s) => {
              const analysis = Array.isArray(s.analysis) ? s.analysis[0] : s.analysis;
              return (
                <Link
                  key={s.id}
                  href={`/dashboard/session/${s.id}`}
                  className="group flex items-center justify-between p-4 md:p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <h2 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {s.title}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(s.created_at)}</span>
                      <span>·</span>
                      <span>{formatDuration(s.duration)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 ml-4">
                    {analysis?.overall_score !== undefined && (
                      <div
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          analysis.overall_score >= 75
                            ? 'border-accent text-accent'
                            : analysis.overall_score >= 50
                            ? 'border-primary text-primary'
                            : 'border-destructive text-destructive'
                        }`}
                      >
                        <span className="text-xs font-bold tabular-nums">{analysis.overall_score}</span>
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
                    <button
                      onClick={(e) => handleDelete(e, s.id)}
                      disabled={deletingId === s.id}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Delete session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
