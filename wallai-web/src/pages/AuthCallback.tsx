/**
 * OAuth Callback Page
 * Handles redirect from OAuth providers (Google, Apple, etc.)
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback: Processing OAuth callback');
        console.log('Current URL:', window.location.href);

        // Check if there's a hash or query params with auth data
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);

        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');

        console.log('Access token present:', !!accessToken);
        console.log('Refresh token present:', !!refreshToken);

        if (accessToken) {
          // Set the session with the tokens from URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Error setting session:', error);
            setError(error.message);
            setTimeout(() => navigate('/login', { replace: true }), 2000);
            return;
          }

          if (data.session) {
            console.log('OAuth callback: Session established successfully');
            console.log('User:', data.session.user.email);

            // Navigate to dashboard
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 500);
            return;
          }
        }

        // If no tokens in URL, try to get existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setTimeout(() => navigate('/login', { replace: true }), 2000);
          return;
        }

        if (sessionData.session) {
          console.log('OAuth callback: Existing session found');
          navigate('/dashboard', { replace: true });
        } else {
          console.log('OAuth callback: No session found, redirecting to login');
          setTimeout(() => navigate('/login', { replace: true }), 1500);
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="inline-block w-16 h-16 mb-4">
              <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Signing you in...</h2>
            <p className="text-gray-600">Please wait while we complete your sign-in</p>
          </>
        )}
      </div>
    </div>
  );
}
