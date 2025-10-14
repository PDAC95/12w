/**
 * CreateBudgetModal Component
 *
 * Modal for creating new budgets with framework selection
 * Supports 50/30/20, 60/20/20, Zero-Based, and Custom frameworks
 */

import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { budgetService } from '@/services/budget.service';
import { useSpaceStore } from '@/stores/spaceStore';
import type {
  BudgetFramework,
  BudgetCreate,
  FrameworkOption,
  FRAMEWORK_OPTIONS as FRAMEWORK_OPTIONS_TYPE,
} from '@/types/Budget.types';
import { getCurrentMonthPeriod } from '@/types/Budget.types';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (budgetId: string) => void;
}

type Step = 'framework' | 'details';

const FRAMEWORK_OPTIONS: FrameworkOption[] = [
  {
    id: '50_30_20',
    name: '50/30/20 Rule',
    description: '50% needs, 30% wants, 20% savings',
    icon: 'pie-chart',
    color: '#10B981',
    popular: true,
  },
  {
    id: '60_20_20',
    name: '60/20/20 Rule',
    description: '60% needs, 20% wants, 20% savings',
    icon: 'bar-chart-2',
    color: '#3B82F6',
  },
  {
    id: 'zero_based',
    name: 'Zero-Based Budget',
    description: 'Every dollar has a job',
    icon: 'target',
    color: '#8B5CF6',
  },
  {
    id: 'custom',
    name: 'Custom Budget',
    description: 'Create your own categories',
    icon: 'edit-3',
    color: '#F59E0B',
  },
];

const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { activeSpace } = useSpaceStore();
  const [step, setStep] = useState<Step>('framework');
  const [framework, setFramework] = useState<BudgetFramework | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [monthPeriod, setMonthPeriod] = useState(getCurrentMonthPeriod());
  const [totalIncome, setTotalIncome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset form when opened
      setStep('framework');
      setFramework(null);
      setName('');
      setDescription('');
      setMonthPeriod(getCurrentMonthPeriod());
      setTotalIncome('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFrameworkSelect = (selectedFramework: BudgetFramework) => {
    setFramework(selectedFramework);
    setStep('details');

    // Set default name based on framework
    const frameworkName = FRAMEWORK_OPTIONS.find(f => f.id === selectedFramework)?.name || '';
    setName(`${frameworkName} - ${monthPeriod}`);
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('framework');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeSpace) {
      setError('No space selected');
      return;
    }

    if (!framework) {
      setError('Please select a framework');
      return;
    }

    if (!name.trim()) {
      setError('Please enter a budget name');
      return;
    }

    if (!totalIncome || parseFloat(totalIncome) <= 0) {
      setError('Please enter a valid income amount');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const budgetData: BudgetCreate = {
        space_id: activeSpace.id,
        name: name.trim(),
        description: description.trim() || undefined,
        type: 'master',
        month_period: monthPeriod,
        framework: framework,
        total_income: parseFloat(totalIncome),
        currency: activeSpace.currency || 'USD',
      };

      const createdBudget = await budgetService.createBudget(budgetData);
      onSuccess(createdBudget.id);
      onClose();
    } catch (err: any) {
      console.error('Error creating budget:', err);
      setError(err.response?.data?.detail || 'Failed to create budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFrameworkStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Choose Your Budget Framework
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {FRAMEWORK_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleFrameworkSelect(option.id)}
            className={`
              relative p-4 rounded-xl border-2 transition-all
              hover:scale-102 hover:shadow-lg
              ${framework === option.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 bg-white hover:border-primary-200'
              }
            `}
          >
            {option.popular && (
              <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full">
                Popular
              </span>
            )}

            <div className="flex items-start space-x-3">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${option.color}20` }}
              >
                <div style={{ color: option.color }} className="w-6 h-6">
                  ⚡
                </div>
              </div>

              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">
                  {option.name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {option.description}
                </div>
              </div>

              {framework === option.id && (
                <CheckIcon className="w-6 h-6 text-primary-600 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Budget Details
      </h3>

      {/* Budget Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Budget Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., Monthly Budget - January 2025"
          maxLength={200}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Add notes about this budget..."
          rows={3}
          maxLength={500}
        />
      </div>

      {/* Month Period */}
      <div>
        <label htmlFor="month_period" className="block text-sm font-medium text-gray-700 mb-2">
          Month *
        </label>
        <input
          type="month"
          id="month_period"
          value={monthPeriod}
          onChange={(e) => setMonthPeriod(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>

      {/* Total Income */}
      <div>
        <label htmlFor="total_income" className="block text-sm font-medium text-gray-700 mb-2">
          Expected Monthly Income *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {activeSpace?.currency || 'USD'}
          </span>
          <input
            type="number"
            id="total_income"
            value={totalIncome}
            onChange={(e) => setTotalIncome(e.target.value)}
            className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Budget categories will be calculated based on your income
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Budget'}
        </button>
      </div>
    </form>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Create Budget
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'framework' && renderFrameworkStep()}
            {step === 'details' && renderDetailsStep()}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBudgetModal;
