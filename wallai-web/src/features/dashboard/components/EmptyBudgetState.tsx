/**
 * EmptyBudgetState Component
 * Displayed when user has no budget data for current month
 */
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  PlusCircleIcon,
  SparklesIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

export function EmptyBudgetState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-100 to-teal-100 rounded-full flex items-center justify-center mb-6">
          <ChartBarIcon className="w-12 h-12 text-primary-600" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your Financial Dashboard!
        </h2>

        <p className="text-lg text-gray-600 mb-8">
          You've completed onboarding! Now let's see your budget in action. Create your first monthly budget to start tracking your finances.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <BanknotesIcon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Track Spending</h3>
            <p className="text-sm text-gray-600">
              Monitor your expenses in real-time
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <SparklesIcon className="w-8 h-8 text-teal-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Save Smarter</h3>
            <p className="text-sm text-gray-600">
              Set goals and track your progress
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <ChartBarIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Get Insights</h3>
            <p className="text-sm text-gray-600">
              AI-powered financial recommendations
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/budgets/create"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Create Budget
          </Link>

          <Link
            to="/help"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-primary-300 hover:bg-gray-50 transition-all"
          >
            Learn More
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-sm text-gray-500">
          Not sure where to start?{' '}
          <Link to="/chat" className="text-primary-600 hover:text-primary-700 font-medium">
            Ask our AI assistant
          </Link>
          {' '}for help.
        </p>
      </div>
    </div>
  );
}
