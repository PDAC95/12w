import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { budgetService } from '@/services/budget.service';
import { IconPicker } from '@/components/IconPicker';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
  parentName: string;
  currency: string;
  onSuccess: () => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose,
  parentId,
  parentName,
  currency,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    category: '',
    budgeted_amount: '',
    icon: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        category: '',
        budgeted_amount: '',
        icon: '',
        description: '',
      });
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.category || formData.category.trim().length === 0) {
      setError('Item name is required');
      return;
    }

    if (!formData.budgeted_amount || parseFloat(formData.budgeted_amount) < 0) {
      setError('Budgeted amount must be a positive number');
      return;
    }

    setIsSubmitting(true);

    try {
      await budgetService.addChildToParent(parentId, {
        category: formData.category.trim(),
        budgeted_amount: parseFloat(formData.budgeted_amount),
        icon: formData.icon || undefined,
        description: formData.description?.trim() || undefined,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add item');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <PlusCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Item</h2>
              <p className="text-sm text-emerald-100">to {parentName}</p>
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

          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., Hydro, Internet, Costco"
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
                step="0.01"
                min="0"
                value={formData.budgeted_amount}
                onChange={(e) => handleChange('budgeted_amount', e.target.value)}
                placeholder="0.00"
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
                disabled={isSubmitting}
              />
            </div>
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
              placeholder="Brief description..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              maxLength={500}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.description?.length || 0}/500 characters
            </p>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span>{isSubmitting ? 'Adding...' : 'Add Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
