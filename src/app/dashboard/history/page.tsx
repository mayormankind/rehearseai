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
      <div className="p-4 md:p-8 pt-16 lg:pt-8">
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
    <div className="p-4 md:p-8 pt-16 lg:pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Session History</h1>
            <p className="text-muted-foreground mt-1">{sessions.length} recordings</p>
          </div>
          <Link
            href="/dashboard/record"
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-12 md:p-16 rounded-2xl border border-dashed border-border bg-card/50 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
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
                  className="group flex items-center justify-between p-4 md:p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all"
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
                      <div className="text-center">
                        <p className="text-xl md:text-2xl font-bold text-foreground">{analysis.overall_score}</p>
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
