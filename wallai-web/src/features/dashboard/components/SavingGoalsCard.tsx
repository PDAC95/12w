/**
 * SavingGoalsCard Component
 * Displays saving goals with progress
 */
import { PiggyBankIcon } from 'lucide-react';
import type { SavingGoal } from '@/types/Dashboard.types';

interface SavingGoalsCardProps {
  goals: SavingGoal[];
}

export function SavingGoalsCard({ goals }: SavingGoalsCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saving Goals</h3>
        <div className="text-center py-8">
          <PiggyBankIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No saving goals yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Saving Goals</h3>

      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">{goal.name}</span>
              <span className="text-sm font-semibold text-primary-600">
                {goal.progress.toFixed(0)}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-teal-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(goal.progress, 100)}%` }}
              />
            </div>

            <p className="text-xs text-gray-600">
              {formatCurrency(goal.current, goal.currency)} of{' '}
              {formatCurrency(goal.target, goal.currency)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
