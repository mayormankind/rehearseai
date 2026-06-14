import { transcribeAudio, generateFeedback } from './openai';
import type { AnalysisResult } from '@/types/analysis';

/**
 * Analyze audio file and generate comprehensive feedback
 * @param audioFile - The audio file to analyze
 * @returns Complete analysis result
 */
export async function analyzePresentation(audioFile: File): Promise<AnalysisResult> {
  try {
    // Step 1: Transcribe audio
    const transcription = await transcribeAudio(audioFile);
    
    // Step 2: Generate AI feedback
    const feedback = await generateFeedback(transcription);

    return {
      transcription,
      score: feedback.overall_score,
      feedback: feedback.feedback.map((f) => f.message),
      metrics: {
        pace: feedback.pace_score,
        clarity: feedback.clarity_score,
        confidence: feedback.confidence_score,
        filler_words: feedback.filler_words_count,
        word_count: feedback.word_count,
      },
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

/**
 * Calculate metrics from transcription
 * @param transcription - The transcription text
 * @returns Calculated metrics
 */
export function calculateMetrics(transcription: string) {
  // Placeholder metric calculation
  const wordCount = transcription.split(' ').length;
  const sentenceCount = transcription.split(/[.!?]+/).length;
  
  return {
    wordCount,
    sentenceCount,
    averageWordsPerSentence: wordCount / sentenceCount,
  };
}
