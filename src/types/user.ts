export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  subscription_tier?: 'free' | 'pro' | 'enterprise';
  total_sessions?: number;
  total_minutes?: number;
}

export interface AuthUser {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  error: Error | null;
}
