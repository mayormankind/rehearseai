export interface AnalysisResult {
  transcription: string;
  score: number;
  feedback: string[];
  metrics?: AnalysisMetrics;
}

export interface AnalysisMetrics {
  pace?: number;
  clarity?: number;
  confidence?: number;
  filler_words?: number;
  word_count?: number;
  speaking_time?: number;
  pauses?: number;
}

export interface TranscriptionSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  confidence?: number;
}

export interface DetailedAnalysis {
  overall_score: number;
  metrics: AnalysisMetrics;
  transcription: TranscriptionSegment[];
  feedback: AnalysisFeedback[];
  suggestions: string[];
}

export interface AnalysisFeedback {
  category: 'pace' | 'clarity' | 'engagement' | 'structure' | 'delivery';
  score: number;
  insights: string[];
  improvements: string[];
}

export interface AnalysisRequest {
  audio_url: string;
  session_id: string;
  options?: {
    detailed?: boolean;
    language?: string;
  };
}

export interface AnalysisResponse {
  success: boolean;
  data?: DetailedAnalysis;
  error?: string;
}
