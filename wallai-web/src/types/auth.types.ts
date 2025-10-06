/**
 * Authentication Types for Wallai
 */

export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  preferred_language: string;
  currency: string;
  timezone: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_seen_at?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  full_name?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: any;
}
