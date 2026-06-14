import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function transcribeAudio(audioFile: File): Promise<string> {
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  });
  return transcription.text;
}

export interface GptFeedbackItem {
  category:
    | 'pace'
    | 'clarity'
    | 'confidence'
    | 'filler_words'
    | 'general'
    | 'engagement'
    | 'structure'
    | 'delivery';
  severity: 'info' | 'warning' | 'error';
  message: string;
}

export interface GptFeedbackOutput {
  overall_score: number;
  pace_score: number;
  clarity_score: number;
  confidence_score: number;
  filler_words_count: number;
  word_count: number;
  feedback: GptFeedbackItem[];
  suggestions: string[];
}

const SYSTEM_PROMPT = `You are an expert presentation coach. Analyze the speech transcription and return a JSON object with these exact fields:
- overall_score: integer 0-100 (holistic presentation quality)
- pace_score: integer 0-100 (speaking pace and rhythm)
- clarity_score: integer 0-100 (clarity, articulation, vocabulary)
- confidence_score: integer 0-100 (confidence and authority)
- filler_words_count: integer (count of "um", "uh", "like", "you know", "so", "actually", etc.)
- word_count: integer (total word count)
- feedback: array of objects, each with {category, severity, message}
  - category: one of "pace" | "clarity" | "confidence" | "filler_words" | "general" | "engagement" | "structure" | "delivery"
  - severity: one of "info" | "warning" | "error"
  - message: a specific, actionable observation (1-2 sentences)
- suggestions: array of 3-5 concise improvement tips as strings`;

export async function generateFeedback(transcription: string): Promise<GptFeedbackOutput> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyze this presentation transcription:\n\n${transcription}`,
      },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('Empty response from GPT');

  return JSON.parse(content) as GptFeedbackOutput;
}

export { openai };
