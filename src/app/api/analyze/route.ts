import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { transcribeAudio, generateFeedback } from '@/lib/openai';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let sessionId: string | undefined;

  try {
    const body = await request.json();
    sessionId = body.sessionId as string;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const { data: session, error: sessionFetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionFetchError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const audioResp = await fetch(session.audio_url);
    if (!audioResp.ok) {
      throw new Error(`Failed to fetch audio: ${audioResp.statusText}`);
    }
    const audioBlob = await audioResp.blob();
    const audioFile = new File([audioBlob], 'audio.webm', {
      type: audioBlob.type || 'audio/webm',
    });

    const transcription = await transcribeAudio(audioFile);
    const gptResult = await generateFeedback(transcription);

    const { data: analysisRow, error: analysisError } = await supabase
      .from('analysis')
      .insert({
        session_id: sessionId,
        overall_score: gptResult.overall_score,
        pace_score: gptResult.pace_score,
        clarity_score: gptResult.clarity_score,
        confidence_score: gptResult.confidence_score,
        filler_words_count: gptResult.filler_words_count,
        word_count: gptResult.word_count,
      })
      .select()
      .single();

    if (analysisError || !analysisRow) {
      throw new Error(analysisError?.message ?? 'Analysis insert failed');
    }

    if (gptResult.feedback.length > 0) {
      await supabase.from('feedback').insert(
        gptResult.feedback.map((f) => ({
          analysis_id: analysisRow.id,
          category: f.category,
          severity: f.severity,
          message: f.message,
        }))
      );
    }

    await supabase
      .from('sessions')
      .update({ transcript: transcription, status: 'completed' })
      .eq('id', sessionId);

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        transcription,
        analysis: analysisRow,
        feedback: gptResult.feedback,
        suggestions: gptResult.suggestions,
      },
    });
  } catch (error) {
    if (sessionId) {
      await supabase.from('sessions').update({ status: 'failed' }).eq('id', sessionId);
    }
    console.error('Analyze error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
