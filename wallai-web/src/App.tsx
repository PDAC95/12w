import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RegisterPage, LoginPage, ForgotPasswordPage } from './features/auth';
import { Dashboard, AuthCallback, BudgetDetailPage } from './pages';
import { Chat } from './pages/Chat';
import Spaces from './pages/Spaces';
import BudgetsPage from './pages/Budgets';
import { WelcomePage, SpaceSetupPage, BudgetExpressPage } from './pages/onboarding';
import { Logo } from './components/common';
import { PrivateRoute } from './components/routes';
import { MainLayout } from './components/layout';
import { useAuthStore } from './stores/authStore';
import { OnboardingProvider } from './context/OnboardingContext';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Landing Page Component
 */
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center mb-6">
          <Logo variant="horizontal" size={80} />
        </div>
        <h1 className="text-6xl font-bold text-dark-800">
          Your intelligent financial assistant
        </h1>
        <p className="text-xl text-dark-600">
          Your AI-powered financial assistant is ready 🚀
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary-600">React 18</h2>
            <p className="text-sm text-dark-500">✅ Configured</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-secondary-600">TypeScript</h2>
            <p className="text-sm text-dark-500">✅ Configured</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary-600">Tailwind CSS</h2>
            <p className="text-sm text-dark-500">✅ Configured</p>
          </div>
        </div>
        <div className="mt-8 text-sm text-dark-400">
          <p>Running on <span className="font-mono text-primary-600">localhost:3000</span></p>
          <p className="mt-2">US-002: Scaffolding Frontend React - Complete</p>
        </div>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/register"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Main App Component with Routing
 */
function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth state on app mount
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <OnboardingProvider>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Onboarding Routes (no layout) */}
          <Route
            path="/onboarding/welcome"
            element={
              <PrivateRoute>
                <WelcomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/onboarding/space"
            element={
              <PrivateRoute>
                <SpaceSetupPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/onboarding/budget"
            element={
              <PrivateRoute>
                <BudgetExpressPage />
              </PrivateRoute>
            }
          />

          {/* Protected Routes with MainLayout */}
          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/spaces" element={<Spaces />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/budgets/:id" element={<BudgetDetailPage />} />
            <Route path="/expenses" element={<div className="text-center py-12 text-gray-500">Expenses page coming soon</div>} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/reports" element={<div className="text-center py-12 text-gray-500">Reports page coming soon</div>} />
            <Route path="/settings" element={<div className="text-center py-12 text-gray-500">Settings page coming soon</div>} />
          </Route>
          </Routes>
        </OnboardingProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
