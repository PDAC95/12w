/**
 * BudgetList Component
 *
 * Displays list of budgets with progress bars and stats
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  ArrowTrendingUpIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { budgetService } from '@/services/budget.service';
import { useSpaceStore } from '@/stores/spaceStore';
import type { Budget } from '@/types/Budget.types';
import {
  formatMonthPeriodDisplay,
  calculateBudgetProgress,
  getBudgetStatus,
} from '@/types/Budget.types';
import CreateBudgetModal from './CreateBudgetModal';

const BudgetList: React.FC = () => {
  const { activeSpace } = useSpaceStore();
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchBudgets = async () => {
    if (!activeSpace) {
      setIsLoading(false);
      setError('No active space selected. Please select or create a space first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await budgetService.listBudgets({
        space_id: activeSpace.id,
      });
      setBudgets(response.budgets);
    } catch (err: any) {
      console.error('Error fetching budgets:', err);
      setError('Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [activeSpace]);

  const handleCreateSuccess = (budgetId: string) => {
    fetchBudgets();
  };

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case 'under':
        return 'text-blue-600 bg-blue-50';
      case 'on-track':
        return 'text-green-600 bg-green-50';
      case 'over':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getBudgetStatusIcon = (status: string) => {
    switch (status) {
      case 'under':
        return <ArrowTrendingUpIcon className="w-5 h-5" />;
      case 'on-track':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'over':
        return <ExclamationCircleIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={fetchBudgets}
          className="mt-2 text-sm text-red-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Budgets</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Budget</span>
        </button>
      </div>

      {/* Budget List */}
      {budgets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <PlusIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Budgets Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first budget to start tracking your finances
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Create Your First Budget
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const progress = calculateBudgetProgress(budget);
            const status = getBudgetStatus(budget);
            const totalIncome = Number(budget.total_income);
            const totalSpent = Number(budget.total_spent);
            const remaining = totalIncome - totalSpent;

            return (
              <div
                key={budget.id}
                onClick={() => navigate(`/budgets/${budget.id}`)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Budget Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {budget.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatMonthPeriodDisplay(budget.month_period)}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getBudgetStatusColor(status)}`}>
                    {getBudgetStatusIcon(status)}
                    <span className="text-sm font-medium capitalize">{status}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Spent</span>
                    <span className="font-semibold">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        status === 'over'
                          ? 'bg-red-500'
                          : status === 'on-track'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Budget Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Income</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {budget.currency} {totalIncome.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Spent</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {budget.currency} {totalSpent.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Remaining</div>
                    <div className={`text-sm font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {budget.currency} {remaining.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Budget Modal */}
      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default BudgetList;
