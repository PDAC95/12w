import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { budgetService } from '@/services/budget.service';
import type { ParentCategoryCreate, BudgetItemChildCreate } from '@/types/Budget.types';

interface CreateParentCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId: string;
  currency: string;
  preSelectedCategoryType?: 'needs' | 'wants' | 'savings' | 'income';
  onSuccess: () => void;
}

export const CreateParentCategoryModal: React.FC<CreateParentCategoryModalProps> = ({
  isOpen,
  onClose,
  budgetId,
  currency,
  preSelectedCategoryType = 'needs',
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ParentCategoryCreate>({
    category: '',
    description: '',
    category_type: preSelectedCategoryType,
    icon: '',
    color: '#10b981',
    children: [
      { category: '', budgeted_amount: 0 },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        category: '',
        description: '',
        category_type: preSelectedCategoryType,
        icon: '',
        color: '#10b981',
        children: [
          { category: '', budgeted_amount: 0 },
        ],
      });
      setError(null);
    }
  }, [isOpen, preSelectedCategoryType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.category || formData.category.trim().length === 0) {
      setError('Parent category name is required');
      return;
    }

    if (formData.category.length > 100) {
      setError('Category name must be 100 characters or less');
      return;
    }

    if (formData.children.length === 0) {
      setError('At least one child item is required');
      return;
    }

    // Validate children
    for (let i = 0; i < formData.children.length; i++) {
      const child = formData.children[i];
      if (!child.category || child.category.trim().length === 0) {
        setError(`Child item #${i + 1}: Name is required`);
        return;
      }
      if (child.budgeted_amount <= 0) {
        setError(`Child item #${i + 1}: Amount must be greater than 0`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await budgetService.createParentCategory(budgetId, {
        category: formData.category.trim(),
        description: formData.description?.trim() || undefined,
        category_type: formData.category_type,
        icon: formData.icon || undefined,
        color: formData.color || '#10b981',
        children: formData.children.map(child => ({
          category: child.category.trim(),
          budgeted_amount: child.budgeted_amount,
          description: child.description?.trim() || undefined,
          icon: child.icon || undefined,
          color: child.color || undefined,
        })),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create parent category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParentChange = (field: keyof Omit<ParentCategoryCreate, 'children'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChildChange = (index: number, field: keyof BudgetItemChildCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      ),
    }));
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { category: '', budgeted_amount: 0 }],
    }));
  };

  const removeChild = (index: number) => {
    if (formData.children.length <= 1) {
      setError('At least one child item is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    return formData.children.reduce((sum, child) => sum + (Number(child.budgeted_amount) || 0), 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <PlusCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Category Group</h2>
              <p className="text-sm text-purple-100">Parent category with multiple items</p>
            </div>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Parent Category Section */}
          <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
            <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Parent Category
            </h3>

            <div className="space-y-4">
              {/* Parent Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleParentChange('category', e.target.value)}
                  placeholder="e.g., Utilities, Groceries, Deportes"
                  className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                  maxLength={100}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              {/* Parent Type and Icon Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category_type}
                    onChange={(e) => handleParentChange('category_type', e.target.value as any)}
                    className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="needs">Needs</option>
                    <option value="wants">Wants</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Icon (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => handleParentChange('icon', e.target.value)}
                    placeholder="e.g., ⚡, 🛒, ⚽"
                    className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    maxLength={10}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Parent Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleParentChange('description', e.target.value)}
                  placeholder="Brief description of this category group..."
                  rows={2}
                  className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  maxLength={500}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Children Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                Child Items ({formData.children.length})
              </h3>
              <button
                type="button"
                onClick={addChild}
                className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm font-medium"
                disabled={isSubmitting}
              >
                <PlusCircleIcon className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.children.map((child, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={child.category}
                          onChange={(e) => handleChildChange(index, 'category', e.target.value)}
                          placeholder="e.g., Hydro, Internet, Costco"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                          required
                          maxLength={100}
                          disabled={isSubmitting}
                        />

                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                            {currency}
                          </span>
                          <input
                            type="number"
                            value={child.budgeted_amount || ''}
                            onChange={(e) => handleChildChange(index, 'budgeted_amount', Number(e.target.value))}
                            placeholder="0.00"
                            className="w-full pl-16 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            required
                            min="0.01"
                            step="0.01"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        value={child.icon || ''}
                        onChange={(e) => handleChildChange(index, 'icon', e.target.value)}
                        placeholder="Icon (optional): 💡, 🌐, 🔥"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                        maxLength={10}
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeChild(index)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      disabled={isSubmitting || formData.children.length <= 1}
                      title="Remove item"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Summary */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-900">Calculated Total:</span>
              <span className="text-2xl font-bold text-blue-700">
                {currency} {calculateTotal().toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              This will be auto-calculated from child items
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-700 font-medium">
                  Category groups help organize related expenses
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Example: "Utilities" group with Hydro, Internet, Gas as child items
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span>{isSubmitting ? 'Creating...' : 'Create Group'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
