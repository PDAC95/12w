/**
 * Dashboard Page - Protected Route
 * Main application dashboard after login
 */
import { useAuthStore } from '../stores/authStore';
import {
  ChartBarIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';

export function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div>
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your financial overview for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <WalletIcon className="h-6 w-6 text-teal-600" />
              </div>
              <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                +12.5%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">$0.00</h3>
            <p className="text-sm text-gray-600">Total Balance</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                This month
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">$0.00</h3>
            <p className="text-sm text-gray-600">Income</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                This month
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">$0.00</h3>
            <p className="text-sm text-gray-600">Expenses</p>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-12 w-12 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Dashboard Coming Soon
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your financial dashboard is being built. Soon you'll be able to track
                expenses, view insights, and manage your budget all in one place.
              </p>
            </div>

            {/* Feature List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
              {[
                'Transaction tracking',
                'Budget management',
                'AI-powered insights',
                'Expense categorization',
                'Financial goals',
                'Reports & analytics',
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
