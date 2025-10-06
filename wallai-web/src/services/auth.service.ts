/**
 * Authentication Service
 * Handles all authentication operations with Supabase
 */
import { supabase } from '../lib/supabase';
import type { RegisterFormData, LoginFormData, User, AuthError } from '../types/auth.types';

export class AuthService {
  /**
   * Register a new user
   *
   * @param data - Registration form data
   * @returns User object if successful
   * @throws AuthError if registration fails
   */
  static async register(data: RegisterFormData): Promise<User> {
    try {
      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.full_name || null,
          },
        },
      });

      if (signUpError) {
        throw this.handleAuthError(signUpError);
      }

      if (!authData.user) {
        throw {
          message: 'No se pudo crear el usuario',
          code: 'USER_CREATION_FAILED',
        } as AuthError;
      }

      // Step 2: User profile will be created automatically by database trigger
      // The trigger listens to auth.users inserts and creates a row in public.users

      // Step 3: Return user data
      // Note: Email confirmation may be required before user can sign in
      return {
        id: authData.user.id,
        email: authData.user.email!,
        username: data.username,
        full_name: data.full_name,
        preferred_language: 'es',
        currency: 'USD',
        timezone: 'America/New_York',
        settings: {},
        created_at: authData.user.created_at,
        updated_at: authData.user.created_at,
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   *
   * @param data - Login form data
   * @returns User object if successful
   * @throws AuthError if login fails
   */
  static async login(data: LoginFormData): Promise<User> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw this.handleAuthError(error);
      }

      if (!authData.user) {
        throw {
          message: 'Error al iniciar sesión',
          code: 'LOGIN_FAILED',
        } as AuthError;
      }

      // Fetch full user profile from public.users
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        // If profile doesn't exist yet, return basic user data
        return {
          id: authData.user.id,
          email: authData.user.email!,
          username: authData.user.user_metadata.username || '',
          full_name: authData.user.user_metadata.full_name,
          preferred_language: 'es',
          currency: 'USD',
          timezone: 'America/New_York',
          settings: {},
          created_at: authData.user.created_at,
          updated_at: authData.user.created_at,
        };
      }

      return profile;
    } catch (error: any) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current session
   */
  static async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw this.handleAuthError(error);
    }
    return data.session;
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Fetch full profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return {
        id: user.id,
        email: user.email!,
        username: user.user_metadata.username || '',
        full_name: user.user_metadata.full_name,
        preferred_language: 'es',
        currency: 'USD',
        timezone: 'America/New_York',
        settings: {},
        created_at: user.created_at,
        updated_at: user.created_at,
      };
    }

    return profile;
  }

  /**
   * Check if username is available
   *
   * @param username - Username to check
   * @returns true if available, false if taken
   */
  static async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('Username check error:', error);
        return false;
      }

      return data === null; // null means username is available
    } catch (error) {
      console.error('Username check error:', error);
      return false;
    }
  }

  /**
   * Handle and format auth errors
   */
  private static handleAuthError(error: any): AuthError {
    // Supabase error
    if (error.message) {
      // Map common errors to Spanish
      const errorMessages: Record<string, string> = {
        'Invalid login credentials': 'Email o contraseña incorrectos',
        'Email not confirmed': 'Por favor confirma tu email antes de iniciar sesión',
        'User already registered': 'Este email ya está registrado',
        'Password should be at least 8 characters': 'La contraseña debe tener al menos 8 caracteres',
        'Unable to validate email address': 'Email inválido',
        'Email rate limit exceeded': 'Demasiados intentos. Por favor espera unos minutos',
      };

      const spanishMessage = errorMessages[error.message] || error.message;

      return {
        message: spanishMessage,
        code: error.code || error.status,
        details: error,
      };
    }

    // Custom error
    if (error.message && error.code) {
      return error as AuthError;
    }

    // Unknown error
    return {
      message: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }
}
