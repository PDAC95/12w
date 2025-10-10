/**
 * SpendingBreakdownCard Component
 * Shows expense breakdown by category with percentages
 */
import { ChartPieIcon } from '@heroicons/react/24/outline';
import type { SpendingBreakdown } from '@/types/Dashboard.types';

interface SpendingBreakdownCardProps {
  breakdown: SpendingBreakdown[];
}

export function SpendingBreakdownCard({ breakdown }: SpendingBreakdownCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
    ];
    return colors[index % colors.length];
  };

  const getCategoryTextColor = (index: number) => {
    const colors = [
      'text-blue-700',
      'text-green-700',
      'text-yellow-700',
      'text-red-700',
      'text-purple-700',
      'text-pink-700',
      'text-indigo-700',
      'text-orange-700',
    ];
    return colors[index % colors.length];
  };

  if (breakdown.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
        <div className="text-center py-8">
          <ChartPieIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No spending data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>

      <div className="space-y-4">
        {breakdown.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(index)}`} />
                <span className="text-sm font-medium text-gray-900">{item.category}</span>
                <span className="text-xs text-gray-500">({item.count} transactions)</span>
              </div>
              <span className={`text-sm font-semibold ${getCategoryTextColor(index)}`}>
                {item.percentage}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getCategoryColor(index)}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 min-w-[80px] text-right">
                {formatCurrency(item.amount, item.currency)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-900">Total Spending</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(
              breakdown.reduce((sum, item) => sum + item.amount, 0),
              breakdown[0]?.currency || 'USD'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
