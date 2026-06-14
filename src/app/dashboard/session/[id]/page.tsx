import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { FeedbackDisplay } from '@/components/feedback/FeedbackDisplay';
import { formatDate, formatDuration } from '@/lib/utils';

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const { data: session } = await supabase
    .from('sessions')
    .select(
      'id, title, duration, status, transcript, created_at, audio_url, analysis ( id, overall_score, pace_score, clarity_score, confidence_score, filler_words_count, word_count, created_at, feedback ( id, category, severity, message ) )'
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!session) return notFound();

  const analysis = Array.isArray(session.analysis) ? session.analysis[0] : (session.analysis as any);

  return (
    <div className="p-4 md:p-8 pt-16 lg:pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/dashboard/history" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to History
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{session.title}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>{formatDate(session.created_at)}</span>
              <span>·</span>
              <span>{formatDuration(session.duration)}</span>
              <span>·</span>
              <span className="capitalize">{session.status}</span>
            </div>
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
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-muted-foreground">Analysis in progress…</p>
          </div>
        )}

        {session.status === 'failed' && (
          <div className="p-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
            <p className="text-red-700 dark:text-red-300">Analysis failed. Please try recording again.</p>
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
