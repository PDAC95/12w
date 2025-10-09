/**
 * Auth Store - Zustand
 * Global authentication state management with persistence
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,

      // Set user
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false
        }),

      // Set session
      setSession: (session) =>
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
          isLoading: false
        }),

      // Login with email/password
      login: async (email: string, password: string, rememberMe?: boolean) => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
            options: {
              // Remember me: persist session for 30 days instead of default 1 hour
              ...(rememberMe && {
                persistSession: true,
              }),
            },
          });

          if (error) {
            throw error;
          }

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Login with Google OAuth
      loginWithGoogle: async () => {
        try {
          set({ isLoading: true });

          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });

          if (error) {
            throw error;
          }

          // Note: OAuth redirects to provider, state will be set by onAuthStateChange
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          set({ isLoading: true });

          await supabase.auth.signOut();

          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Initialize auth state from Supabase
      initialize: async () => {
        try {
          set({ isLoading: true });

          // Get current session
          const { data: { session } } = await supabase.auth.getSession();

          set({
            user: session?.user ?? null,
            session,
            isAuthenticated: !!session,
            isLoading: false,
          });

          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            set({
              user: session?.user ?? null,
              session,
              isAuthenticated: !!session,
              isLoading: false,
            });
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'wallai-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist user data, not session (session is handled by Supabase)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
