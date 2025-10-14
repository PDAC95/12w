/**
 * Dashboard Page - Protected Route
 * Main application dashboard after login
 */
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { dashboardService } from '../services/dashboard.service';
import {
  EmptyBudgetState,
  MonthlyBalanceCard,
  SavingGoalsCard,
  RecentExpensesCard,
  WeeklyChallengesCard,
  QuickStatsCard,
  SpendingBreakdownCard,
} from '../features/dashboard/components';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useInitializeActiveSpace } from '../hooks/useInitializeActiveSpace';

export function Dashboard() {
  const { user, token } = useAuthStore();

  // Initialize active space on dashboard load
  useInitializeActiveSpace();

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardService.getSummary(token!),
    enabled: !!token,
    retry: 2,
  });

  const data = dashboardData?.data;

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            {error instanceof Error ? error.message : 'Failed to load dashboard data'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State - No Budget
  if (!data?.has_data) {
    return <EmptyBudgetState />;
  }

  // Main Dashboard with Data
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Here's your financial overview for {data.budget?.month_period || 'this month'}
        </p>
      </div>

      {/* Top Row: Monthly Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Balance - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          {data.monthly_balance && <MonthlyBalanceCard data={data.monthly_balance} />}
        </div>

        {/* Quick Stats - Takes 1 column */}
        <div>
          {data.quick_stats && <QuickStatsCard stats={data.quick_stats} />}
        </div>
      </div>

      {/* Second Row: Savings & Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SavingGoalsCard goals={data.saving_goals} />
        <WeeklyChallengesCard challenges={data.weekly_challenges} />
      </div>

      {/* Third Row: Recent Expenses & Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentExpensesCard expenses={data.recent_expenses} />
        <SpendingBreakdownCard breakdown={data.spending_breakdown} />
      </div>

      {/* Refresh Indicator */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()} •{' '}
          <button
            onClick={() => refetch()}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Refresh
          </button>
        </p>
      </div>
    </div>
  );
}
