export interface Session {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  audio_url: string;
  transcript?: string;
  duration: number;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface SessionWithAnalysis extends Session {
  analysis?: Analysis;
}

export interface Analysis {
  id: string;
  session_id: string;
  overall_score: number;
  pace_score?: number;
  clarity_score?: number;
  confidence_score?: number;
  filler_words_count?: number;
  feedback: FeedbackItem[];
  created_at: string;
}

export interface FeedbackItem {
  id: string;
  category: 'pace' | 'clarity' | 'confidence' | 'filler_words' | 'general';
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp?: number;
}

export interface CreateSessionInput {
  title: string;
  description?: string;
  audio_file: File;
}

export interface UpdateSessionInput {
  title?: string;
  description?: string;
  status?: Session['status'];
}
