import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { budgetService } from '@/services/budget.service';
import type { BudgetItemCreate } from '@/types/Budget.types';
import { IconPicker } from '@/components/IconPicker';

interface AddBudgetItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId: string;
  currency: string;
  preSelectedCategoryType?: 'needs' | 'wants' | 'savings' | 'income';
  onSuccess: () => void;
}

export const AddBudgetItemModal: React.FC<AddBudgetItemModalProps> = ({
  isOpen,
  onClose,
  budgetId,
  currency,
  preSelectedCategoryType = 'needs',
  onSuccess,
}) => {
  const [formData, setFormData] = useState<BudgetItemCreate>({
    category: '',
    budgeted_amount: 0,
    description: '',
    category_type: 'needs',
    icon: '',
    color: '#10b981',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        category: '',
        budgeted_amount: 0,
        description: '',
        category_type: preSelectedCategoryType,
        icon: '',
        color: '#10b981',
      });
      setError(null);
    }
  }, [isOpen, preSelectedCategoryType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.category || formData.category.trim().length === 0) {
      setError('Category name is required');
      return;
    }

    if (formData.category.length > 100) {
      setError('Category name must be 100 characters or less');
      return;
    }

    if (formData.budgeted_amount <= 0) {
      setError('Budgeted amount must be greater than 0');
      return;
    }

    if (formData.description && formData.description.length > 500) {
      setError('Description must be 500 characters or less');
      return;
    }

    setIsSubmitting(true);

    try {
      await budgetService.createBudgetItem(budgetId, {
        category: formData.category.trim(),
        budgeted_amount: formData.budgeted_amount,
        description: formData.description?.trim() || undefined,
        category_type: formData.category_type,
        icon: formData.icon || undefined,
        color: formData.color || '#10b981',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create budget item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budgeted_amount' ? Number(value) : value,
    }));
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <PlusCircleIcon className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Add Budget Category</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all"
            disabled={isSubmitting}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Entertainment, Gym Membership"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
              maxLength={100}
              disabled={isSubmitting}
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.category.length}/100 characters
            </p>
          </div>

          {/* Budgeted Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Budgeted Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {currency}
              </span>
              <input
                type="number"
                name="budgeted_amount"
                value={formData.budgeted_amount || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
                min="0.01"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Category Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Type <span className="text-red-500">*</span>
            </label>
            <select
              name="category_type"
              value={formData.category_type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
              disabled={isSubmitting}
            >
              <option value="needs">Needs (Essential Expenses)</option>
              <option value="wants">Wants (Discretionary)</option>
              <option value="savings">Savings & Debt</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              This determines which framework category this item belongs to
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add notes about this budget category..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              maxLength={500}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.description?.length || 0}/500 characters
            </p>
          </div>

          {/* Icon Picker */}
          <IconPicker
            value={formData.icon || ''}
            onChange={(icon) => handleFieldChange('icon', icon)}
            label="Icon (Optional)"
          />

          {/* Color Picker (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color (Optional)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-16 h-12 border border-gray-300 rounded-xl cursor-pointer"
                disabled={isSubmitting}
              />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="#10b981"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                maxLength={7}
                disabled={isSubmitting}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Choose a color to help distinguish this category
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-700 font-medium">
                  This will be added as a custom category to your budget.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  The system will recalculate your framework percentages to show how your
                  custom categories affect your budget goals.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span>{isSubmitting ? 'Adding...' : 'Add Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
