import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const serviceSupabase = createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const title = (formData.get('title') as string) || 'Untitled Recording';
    const duration = parseInt((formData.get('duration') as string) || '0', 10);

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const ext = audioFile.name.split('.').pop() || 'webm';
    const fileName = `${user.id}/${Date.now()}.${ext}`;

    console.log('Uploading to Supabase Storage:', { bucket: 'recordings', fileName, fileSize: audioFile.size });

    const { error: storageError, data: storageData } = await serviceSupabase.storage
      .from('recordings')
      .upload(fileName, audioFile, { contentType: audioFile.type || 'audio/webm', upsert: false });

    if (storageError) {
      console.error('Supabase Storage error:', storageError);
      return NextResponse.json(
        { error: `Storage upload failed: ${storageError.message}. Make sure the "recordings" bucket exists in Supabase Storage.` },
        { status: 500 }
      );
    }

    console.log('Storage upload successful:', storageData);

    const {
      data: { publicUrl },
    } = serviceSupabase.storage.from('recordings').getPublicUrl(fileName);

    console.log('Creating session record:', { userId: user.id, title, audioUrl: publicUrl, duration });

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, title, audio_url: publicUrl, duration, status: 'processing' })
      .select()
      .single();

    if (sessionError || !session) {
      console.error('Session insert error:', sessionError);
      return NextResponse.json(
        { error: `Session insert failed: ${sessionError?.message ?? 'Unknown error'}` },
        { status: 500 }
      );
    }

    console.log('Session created successfully:', session.id);

    return NextResponse.json({ sessionId: session.id, audioUrl: publicUrl });
  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
