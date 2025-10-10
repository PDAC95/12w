/**
 * RecentExpensesCard Component
 * Shows the 5 most recent expenses
 */
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import type { RecentExpense } from '@/types/Dashboard.types';

interface RecentExpensesCardProps {
  expenses: RecentExpense[];
}

export function RecentExpensesCard({ expenses }: RecentExpensesCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Today';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: 'bg-orange-100 text-orange-700',
      Transport: 'bg-blue-100 text-blue-700',
      Entertainment: 'bg-purple-100 text-purple-700',
      Shopping: 'bg-pink-100 text-pink-700',
      Bills: 'bg-red-100 text-red-700',
      Health: 'bg-green-100 text-green-700',
      Other: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || colors.Other;
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
        <div className="text-center py-8">
          <ReceiptPercentIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No expenses recorded yet</p>
          <Link
            to="/expenses/add"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Add your first expense →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        <Link
          to="/expenses"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {expense.description || 'Unnamed expense'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                    expense.category
                  )}`}
                >
                  {expense.category}
                </span>
                <span className="text-xs text-gray-500">{formatDate(expense.date)}</span>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <p className="text-sm font-semibold text-red-600">
                -{formatCurrency(expense.amount, expense.currency)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
