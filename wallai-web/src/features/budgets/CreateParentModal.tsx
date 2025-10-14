import React, { useState, useEffect } from 'react';
import { XMarkIcon, FolderPlusIcon } from '@heroicons/react/24/outline';
import { budgetService } from '@/services/budget.service';
import { IconPicker } from '@/components/IconPicker';

interface CreateParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId: string;
  preSelectedCategoryType: 'needs' | 'wants' | 'savings' | 'income';
  onSuccess: () => void;
}

export const CreateParentModal: React.FC<CreateParentModalProps> = ({
  isOpen,
  onClose,
  budgetId,
  preSelectedCategoryType,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    category_type: preSelectedCategoryType,
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

    setIsSubmitting(true);

    try {
      // Create parent with empty children array (will add items later)
      await budgetService.createParentCategory(budgetId, {
        category: formData.category.trim(),
        description: formData.description?.trim() || undefined,
        category_type: formData.category_type,
        icon: formData.icon || undefined,
        color: formData.color || '#10b981',
        children: [
          // Create a dummy child that will be deleted or replaced
          {
            category: 'Placeholder',
            budgeted_amount: 0,
            spent_amount: 0
          }
        ],
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  const getCategoryTypeLabel = () => {
    switch (preSelectedCategoryType) {
      case 'needs': return 'Needs (Essential Expenses)';
      case 'wants': return 'Wants (Discretionary)';
      case 'savings': return 'Savings & Debt';
      case 'income': return 'Income';
      default: return preSelectedCategoryType;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FolderPlusIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Category</h2>
              <p className="text-sm text-indigo-100">You can add items to it later</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Category Type Display */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-900">Type:</span>
              <span className="text-sm font-bold text-indigo-700">{getCategoryTypeLabel()}</span>
            </div>
          </div>

          {/* Category Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., Utilities, Groceries, Deportes"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
              maxLength={100}
              disabled={isSubmitting}
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.category.length}/100 characters
            </p>
          </div>

          {/* Icon Picker */}
          <IconPicker
            value={formData.icon}
            onChange={(icon) => handleChange('icon', icon)}
            label="Icon (Optional)"
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of this category..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              maxLength={500}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.description?.length || 0}/500 characters
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-700 font-medium">
                  Create an empty category first
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  After creating, you'll be able to add individual items (Hydro, Internet, etc.) using the <strong>[Add]</strong> button
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              <FolderPlusIcon className="w-5 h-5" />
              <span>{isSubmitting ? 'Creating...' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
