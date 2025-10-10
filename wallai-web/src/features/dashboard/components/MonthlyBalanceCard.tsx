/**
 * MonthlyBalanceCard Component
 * Displays income, expenses, and remaining balance for current month
 */
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import type { MonthlyBalance } from '@/types/Dashboard.types';

interface MonthlyBalanceCardProps {
  data: MonthlyBalance;
}

export function MonthlyBalanceCard({ data }: MonthlyBalanceCardProps) {
  const { income, expenses, balance, percent_spent, currency } = data;

  const isOverBudget = percent_spent > 100;
  const isWarning = percent_spent > 80 && percent_spent <= 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Balance</h3>
        {balance >= 0 ? (
          <ArrowTrendingUpIcon className="w-6 h-6 text-primary-500" />
        ) : (
          <ArrowTrendingDownIcon className="w-6 h-6 text-red-500" />
        )}
      </div>

      {/* Balance Display */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
        <p
          className={`text-4xl font-bold ${
            balance >= 0 ? 'text-primary-600' : 'text-red-600'
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Budget Used</span>
          <span
            className={`text-sm font-semibold ${
              isOverBudget
                ? 'text-red-600'
                : isWarning
                ? 'text-yellow-600'
                : 'text-gray-900'
            }`}
          >
            {percent_spent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : isWarning
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-primary-500 to-teal-500'
            }`}
            style={{ width: `${Math.min(percent_spent, 100)}%` }}
          />
        </div>
      </div>

      {/* Income & Expenses Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {/* Income */}
        <div className="bg-primary-50 rounded-lg p-4">
          <p className="text-xs text-primary-600 font-medium mb-1">Income</p>
          <p className="text-xl font-bold text-primary-700">
            {formatCurrency(income)}
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-xs text-red-600 font-medium mb-1">Expenses</p>
          <p className="text-xl font-bold text-red-700">
            {formatCurrency(expenses)}
          </p>
        </div>
      </div>

      {/* Warning Message */}
      {isOverBudget && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ You've exceeded your monthly budget!
          </p>
        </div>
      )}

      {isWarning && !isOverBudget && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700 font-medium">
            ⚡ You're close to your budget limit!
          </p>
        </div>
      )}
    </div>
  );
}
