import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('sessions')
    .select(
      `*, analysis ( id, overall_score, pace_score, clarity_score, confidence_score, filler_words_count, word_count, created_at, feedback ( id, category, severity, message, timestamp ) )`
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, audio_url, duration } = body;

    if (!title || !audio_url || duration === undefined) {
      return NextResponse.json({ error: 'title, audio_url, and duration are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, title, audio_url, duration, status: 'processing' })
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? 'Insert failed' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
