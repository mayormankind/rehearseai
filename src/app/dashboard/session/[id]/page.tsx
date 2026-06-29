'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { FeedbackDisplay } from '@/components/feedback/FeedbackDisplay';
import { formatDate, formatDuration } from '@/lib/utils';
import { Trash2, Download, Edit2, Check, X, RefreshCw } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  duration: number;
  status: string;
  transcript: string | null;
  created_at: string;
  audio_url: string | null;
  analysis: any;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const id = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('sessions')
      .select(
        'id, title, duration, status, transcript, created_at, audio_url, analysis ( id, overall_score, pace_score, clarity_score, confidence_score, filler_words_count, word_count, created_at, feedback ( id, category, severity, message ) )'
      )
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (data) {
      setSession(data);
      setEditTitle(data.title);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const { error } = await supabase.from('sessions').delete().eq('id', id);

      if (error) throw error;

      toast.success('Session deleted successfully');
      router.push('/dashboard/history');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete session');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    if (!session?.audio_url) return;

    try {
      const response = await fetch(session.audio_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${session.title}.webm`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download audio');
    }
  };

  const handleSaveTitle = async () => {
    if (!session) return;

    try {
      const { error } = await supabase.from('sessions').update({ title: editTitle }).eq('id', id);

      if (error) throw error;

      setSession({ ...session, title: editTitle });
      setEditing(false);
      toast.success('Title updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update title');
    }
  };

  const handleReAnalyze = async () => {
    setReanalyzing(true);

    try {
      const { error: updateError } = await supabase.from('sessions').update({ status: 'processing' }).eq('id', id);

      if (updateError) throw updateError;

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id }),
      });

      if (!analyzeRes.ok) {
        const errorData = await analyzeRes.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      toast.success('Analysis completed successfully');
      fetchSession();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to re-analyze session');
      await supabase.from('sessions').update({ status: 'failed' }).eq('id', id);
    } finally {
      setReanalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-32 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-4 md:p-8 pt-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Session not found</p>
        </div>
      </div>
    );
  }

  const analysis = Array.isArray(session.analysis) ? session.analysis[0] : session.analysis;

  return (
    <div className="p-4 md:p-8 pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href="/dashboard/history" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to History
            </Link>
            {editing ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-3xl font-bold text-foreground bg-transparent border-b-2 border-primary focus:outline-none w-full"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                  aria-label="Save title"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditTitle(session.title);
                  }}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  aria-label="Cancel edit"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <h1 className="text-3xl font-bold text-foreground truncate">{session.title}</h1>
                <button
                  onClick={() => setEditing(true)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Edit title"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>{formatDate(session.created_at)}</span>
              <span>·</span>
              <span>{formatDuration(session.duration)}</span>
              <span>·</span>
              <span className="capitalize">{session.status}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {session.audio_url && (
              <button
                onClick={handleDownload}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                aria-label="Download audio"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Delete session"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {session.audio_url && (
          <div className="p-5 rounded-xl border border-border bg-card">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Recording</h2>
            <audio src={session.audio_url} controls className="w-full" />
          </div>
        )}

        {session.status === 'processing' && (
          <div className="p-8 rounded-xl border border-border bg-card flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin" />
            <p className="text-muted-foreground">Analysis in progress…</p>
          </div>
        )}

        {session.status === 'failed' && (
          <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/5">
            <p className="text-destructive mb-4">Analysis failed. You can try re-analyzing this session.</p>
            <button
              onClick={handleReAnalyze}
              disabled={reanalyzing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground font-medium rounded-xl hover:brightness-110 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reanalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Re-analyzing…
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Re-analyze
                </>
              )}
            </button>
          </div>
        )}

        {session.status === 'completed' && analysis && (
          <FeedbackDisplay
            analysis={{ ...analysis, feedback: analysis.feedback ?? [] }}
            transcript={session.transcript ?? undefined}
          />
        )}
      </div>
    </div>
  );
}
