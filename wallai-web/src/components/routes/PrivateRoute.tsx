/**
 * PrivateRoute Component
 * Protects routes that require authentication and handles onboarding flow
 */
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { onboardingService } from '@/services/onboarding.service';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Check onboarding status when authenticated
  useEffect(() => {
    const checkOnboarding = async () => {
      // Skip onboarding check if already on onboarding pages
      if (location.pathname.startsWith('/onboarding')) {
        setCheckingOnboarding(false);
        return;
      }

      if (isAuthenticated && !authLoading) {
        try {
          const status = await onboardingService.getStatus();
          setNeedsOnboarding(status.needs_onboarding);
        } catch (error) {
          console.error('Failed to check onboarding status:', error);
          // On error, allow access (fail open)
          setNeedsOnboarding(false);
        } finally {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboarding();
  }, [isAuthenticated, authLoading, location.pathname]);

  // Show loading spinner while checking authentication or onboarding
  if (authLoading || (isAuthenticated && checkingOnboarding)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Verifying your session</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Save the intended URL to redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect to onboarding if user needs to complete it
  // (unless already on onboarding pages)
  if (needsOnboarding && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding/welcome" replace />;
  }

  // User is authenticated and onboarded, render the protected content
  return <>{children}</>;
}
