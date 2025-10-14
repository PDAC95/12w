/**
 * Budget Detail Page - ENHANCED UX/UI (Mobile-First Optimized)
 * =============================================================
 * Shows detailed view of a budget with all budget items grouped by category type
 *
 * Design Features:
 * - Glassmorphism cards with backdrop blur
 * - Micro-interactions with Tailwind transitions
 * - Gradient progress bars and visual indicators
 * - Enhanced visual hierarchy with iconography
 * - Mobile-first responsive layout with optimizations
 * - Collapsible sections on mobile
 * - Touch-friendly interactions (min 44x44px)
 * - Safe area insets for iOS
 * - Smooth animations on mount and hover
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { budgetService } from '@/services/budget.service';
import type { Budget, BudgetItem } from '@/types/Budget.types';
import { formatMonthPeriodDisplay } from '@/types/Budget.types';
import { EditBudgetItemModal } from '@/features/budgets/EditBudgetItemModal';
import { AddBudgetItemModal } from '@/features/budgets/AddBudgetItemModal';
import { CreateParentModal } from '@/features/budgets/CreateParentModal';
import { AddChildModal } from '@/features/budgets/AddChildModal';

const BudgetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['needs', 'wants', 'savings', 'income']);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  // Modal states for CRUD operations
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateParentModalOpen, setIsCreateParentModalOpen] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null);
  const [selectedParentForChild, setSelectedParentForChild] = useState<BudgetItem | null>(null);
  const [preSelectedCategoryType, setPreSelectedCategoryType] = useState<'needs' | 'wants' | 'savings' | 'income'>('needs');

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleParentExpansion = (parentId: string) => {
    setExpandedParents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
      }
      return newSet;
    });
  };

  // Handler to open edit modal
  const handleEditItem = (item: BudgetItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  // Handler to open create parent category modal (for section "Add Category" buttons)
  const handleAddCategory = (categoryType: 'needs' | 'wants' | 'savings' | 'income') => {
    setPreSelectedCategoryType(categoryType);
    setIsCreateParentModalOpen(true);
  };

  // Handler to open add child modal (for parent's "Add" button)
  const handleAddChild = (parent: BudgetItem) => {
    setSelectedParentForChild(parent);
    setIsAddChildModalOpen(true);
  };

  // Handler to open regular add modal (kept for backward compatibility)
  const handleAddItem = (categoryType?: 'needs' | 'wants' | 'savings' | 'income') => {
    if (categoryType) {
      setPreSelectedCategoryType(categoryType);
    }
    setIsAddModalOpen(true);
  };

  // Handler to delete item
  const handleDeleteItem = async (item: BudgetItem) => {
    if (!window.confirm(`Are you sure you want to delete "${item.category}"?`)) {
      return;
    }

    try {
      await budgetService.deleteBudgetItem(item.id);
      // Reload budget to show updated data
      if (id) {
        const budgetData = await budgetService.getBudget(id);
        setBudget(budgetData);
      }
    } catch (err: any) {
      console.error('Error deleting budget item:', err);
      alert('Failed to delete budget item');
    }
  };

  // Handler for successful item update/create
  const handleItemSuccess = async () => {
    // Reload budget to show updated data and recalculated totals
    if (id) {
      const budgetData = await budgetService.getBudget(id);
      setBudget(budgetData);
    }
  };

  useEffect(() => {
    if (!id) return;

    const loadBudget = async () => {
      setIsLoading(true);
      setError('');

      try {
        const budgetData = await budgetService.getBudget(id);
        setBudget(budgetData);
      } catch (err: any) {
        console.error('Error loading budget:', err);
        setError('Failed to load budget details');
      } finally {
        setIsLoading(false);
      }
    };

    loadBudget();
  }, [id]);

  // Group budget items by category_type with parent-child hierarchy
  const groupedItems = React.useMemo(() => {
    if (!budget?.budget_items) return { needs: [], wants: [], savings: [], income: [] };

    // First, separate parents and children
    const allItems = budget.budget_items;
    const itemsById = new Map(allItems.map(item => [item.id, item]));

    // Build hierarchy: attach children to their parents
    const topLevelItems: BudgetItem[] = [];

    allItems.forEach(item => {
      if (item.parent_id) {
        // This is a child item - attach it to its parent
        const parent = itemsById.get(item.parent_id);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(item);
        }
      } else {
        // This is a top-level item (either standalone or parent)
        topLevelItems.push(item);
      }
    });

    // Calculate parent spent_amount as sum of children's spent_amount
    topLevelItems.forEach(item => {
      if (item.is_parent && item.children && item.children.length > 0) {
        const totalSpent = item.children.reduce(
          (sum, child) => sum + Number(child.spent_amount || 0),
          0
        );
        item.spent_amount = totalSpent.toString();

        // Budgeted amount is already calculated by database trigger,
        // but we recalculate here for immediate UI updates
        const totalBudgeted = item.children.reduce(
          (sum, child) => sum + Number(child.budgeted_amount || 0),
          0
        );
        item.budgeted_amount = totalBudgeted.toString();
      }
    });

    // Group top-level items by category_type
    return topLevelItems.reduce((acc, item) => {
      const type = item.category_type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, { needs: [], wants: [], savings: [], income: [] } as Record<string, BudgetItem[]>);
  }, [budget]);

  // Calculate totals by category type
  const totals = React.useMemo(() => {
    if (!budget) return { needs: 0, wants: 0, savings: 0, income: 0 };

    return {
      needs: groupedItems.needs.reduce((sum, item) => sum + Number(item.budgeted_amount), 0),
      wants: groupedItems.wants.reduce((sum, item) => sum + Number(item.budgeted_amount), 0),
      savings: groupedItems.savings.reduce((sum, item) => sum + Number(item.budgeted_amount), 0),
      income: groupedItems.income.reduce((sum, item) => sum + Number(item.budgeted_amount), 0),
    };
  }, [groupedItems, budget]);

  // Calculate percentages
  const percentages = React.useMemo(() => {
    const totalIncome = Number(budget?.total_income || 0);
    if (totalIncome === 0) return { needs: 0, wants: 0, savings: 0 };

    return {
      needs: (totals.needs / totalIncome) * 100,
      wants: (totals.wants / totalIncome) * 100,
      savings: (totals.savings / totalIncome) * 100,
    };
  }, [totals, budget]);

  // Get framework targets
  const getFrameworkTargets = () => {
    switch (budget?.framework) {
      case '50_30_20':
        return { needs: 50, wants: 30, savings: 20 };
      case '60_20_20':
        return { needs: 60, wants: 20, savings: 20 };
      case 'zero_based':
      case 'custom':
      default:
        return null;
    }
  };

  const targets = getFrameworkTargets();

  // Enhanced loading skeleton with glassmorphism (Mobile-Optimized)
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 animate-fade-in safe-area-inset-top">
        {/* Skeleton Header */}
        <div className="h-8 sm:h-10 w-36 sm:w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 sm:mb-6 animate-pulse"></div>

        {/* Skeleton Budget Header */}
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="h-8 sm:h-10 w-48 sm:w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 animate-pulse"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 sm:h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl sm:rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Skeleton Framework */}
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="h-6 sm:h-8 w-40 sm:w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 animate-pulse"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 sm:h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-3 sm:mb-4 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Enhanced error state with glassmorphism (Mobile-Optimized)
  if (error || !budget) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 animate-fade-in safe-area-inset-top">
        <div className="backdrop-blur-xl bg-red-50/80 border border-red-200/50 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 text-center">
          <ExclamationCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-red-900 mb-2">Oops!</h2>
          <p className="text-red-600 mb-4 sm:mb-6 text-base sm:text-lg">{error || 'Budget not found'}</p>
          <button
            onClick={() => navigate('/budgets')}
            className="inline-flex items-center justify-center space-x-2 px-5 sm:px-6 py-3 min-h-[44px] bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Go back to budgets</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 animate-fade-in safe-area-inset-top">
      {/* Enhanced Back Button with hover effect (Touch-Friendly) */}
      <button
        onClick={() => navigate('/budgets')}
        className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-all duration-200 hover:translate-x-[-4px] min-h-[44px] p-2"
      >
        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="font-medium text-sm sm:text-base">Back to Budgets</span>
      </button>

      {/* Enhanced Budget Header with Glassmorphism (Mobile-Optimized) */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/70 border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 hover:shadow-3xl transition-all duration-300 animate-slide-up">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl sm:rounded-2xl shadow-lg">
                <ChartBarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">
                  {budget.name}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600 flex-shrink-0" />
                  <p className="text-gray-600 font-medium text-xs sm:text-sm truncate">
                    {formatMonthPeriodDisplay(budget.month_period)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Visible on all screens */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleAddItem}
              className="group flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-5 py-2.5 sm:py-3 min-h-[44px] bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
            >
              <PlusCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
              <span className="text-xs sm:text-base">Add</span>
            </button>
          </div>
        </div>

        {/* Enhanced Summary Stats - Mobile-Optimized (2x2 grid on mobile, 1x4 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
          {/* Total Income Card */}
          <div className="group relative overflow-hidden backdrop-blur-lg bg-gradient-to-br from-teal-50/80 to-teal-100/50 border border-teal-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-teal-500/10 rounded-lg">
                  <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-teal-600 bg-teal-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  INCOME
                </div>
              </div>
              <div className="text-xs sm:text-sm text-teal-700 font-medium mb-1">Total Income</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent truncate">
                {budget.currency} {Number(budget.total_income).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Total Budgeted Card */}
          <div className="group relative overflow-hidden backdrop-blur-lg bg-gradient-to-br from-blue-50/80 to-blue-100/50 border border-blue-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                  <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-blue-600 bg-blue-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  BUDGET
                </div>
              </div>
              <div className="text-xs sm:text-sm text-blue-700 font-medium mb-1">Total Budgeted</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent truncate">
                {budget.currency} {Number(budget.total_budgeted).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Total Spent Card */}
          <div className="group relative overflow-hidden backdrop-blur-lg bg-gradient-to-br from-orange-50/80 to-orange-100/50 border border-orange-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg">
                  <CreditCardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-orange-600 bg-orange-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  SPENT
                </div>
              </div>
              <div className="text-xs sm:text-sm text-orange-700 font-medium mb-1">Total Spent</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-700 to-orange-600 bg-clip-text text-transparent truncate">
                {budget.currency} {Number(budget.total_spent).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Remaining Card */}
          <div className="group relative overflow-hidden backdrop-blur-lg bg-gradient-to-br from-green-50/80 to-green-100/50 border border-green-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg">
                  <BanknotesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-green-600 bg-green-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  LEFT
                </div>
              </div>
              <div className="text-xs sm:text-sm text-green-700 font-medium mb-1">Remaining</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent truncate">
                {budget.currency} {(Number(budget.total_income) - Number(budget.total_spent)).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Framework Indicator - Mobile-Optimized */}
      {targets && (
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/70 border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 hover:shadow-3xl transition-all duration-300 animate-slide-up">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
              <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">
                Budget Framework
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {budget.framework === '50_30_20' ? '50/30/20 Rule' : '60/20/20 Rule'}
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 lg:space-y-5">
            {/* Needs Progress Bar - Mobile-Optimized */}
            <div className="group">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    Needs <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-500">(Target: {targets.needs}%)</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  {Math.abs(percentages.needs - targets.needs) < 5 ? (
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  ) : (
                    <ExclamationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  )}
                  <span className={`text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg ${
                    Math.abs(percentages.needs - targets.needs) < 5
                      ? 'bg-green-100 text-green-700'
                      : percentages.needs > targets.needs
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {percentages.needs.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="relative w-full h-2 sm:h-3 lg:h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                {/* Gradient Progress Fill */}
                <div
                  className="absolute h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${Math.min(percentages.needs, 100)}%` }}
                />
                {/* Target Indicator Line */}
                <div
                  className="absolute h-full border-r-3 border-gray-800 z-10"
                  style={{ left: `${targets.needs}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Target
                  </div>
                </div>
              </div>
              {/* Inline Feedback Message - Mobile-Optimized */}
              {Math.abs(percentages.needs - targets.needs) >= 5 && (
                <p className="text-[10px] sm:text-xs text-gray-600 mt-1.5 sm:mt-2 italic leading-tight">
                  {percentages.needs > targets.needs
                    ? `You're ${(percentages.needs - targets.needs).toFixed(1)}% over target. Consider adjusting categories.`
                    : `You're ${(targets.needs - percentages.needs).toFixed(1)}% under target. You have room to increase.`
                  }
                </p>
              )}
            </div>

            {/* Wants Progress Bar - Mobile-Optimized */}
            <div className="group">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    Wants <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-500">(Target: {targets.wants}%)</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  {Math.abs(percentages.wants - targets.wants) < 5 ? (
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  ) : (
                    <ExclamationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  )}
                  <span className={`text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg ${
                    Math.abs(percentages.wants - targets.wants) < 5
                      ? 'bg-green-100 text-green-700'
                      : percentages.wants > targets.wants
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {percentages.wants.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="relative w-full h-2 sm:h-3 lg:h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${Math.min(percentages.wants, 100)}%` }}
                />
                <div
                  className="absolute h-full border-r-3 border-gray-800 z-10"
                  style={{ left: `${targets.wants}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Target
                  </div>
                </div>
              </div>
              {Math.abs(percentages.wants - targets.wants) >= 5 && (
                <p className="text-[10px] sm:text-xs text-gray-600 mt-1.5 sm:mt-2 italic leading-tight">
                  {percentages.wants > targets.wants
                    ? `You're ${(percentages.wants - targets.wants).toFixed(1)}% over target. Try cutting back on non-essentials.`
                    : `You're ${(targets.wants - percentages.wants).toFixed(1)}% under target. You have flexibility to enjoy more.`
                  }
                </p>
              )}
            </div>

            {/* Savings Progress Bar - Mobile-Optimized */}
            <div className="group">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    Savings <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-500">(Target: {targets.savings}%)</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  {Math.abs(percentages.savings - targets.savings) < 5 ? (
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  ) : (
                    <ExclamationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  )}
                  <span className={`text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg ${
                    Math.abs(percentages.savings - targets.savings) < 5
                      ? 'bg-green-100 text-green-700'
                      : percentages.savings < targets.savings
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {percentages.savings.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="relative w-full h-2 sm:h-3 lg:h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${Math.min(percentages.savings, 100)}%` }}
                />
                <div
                  className="absolute h-full border-r-3 border-gray-800 z-10"
                  style={{ left: `${targets.savings}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Target
                  </div>
                </div>
              </div>
              {Math.abs(percentages.savings - targets.savings) >= 5 && (
                <p className="text-[10px] sm:text-xs text-gray-600 mt-1.5 sm:mt-2 italic leading-tight">
                  {percentages.savings < targets.savings
                    ? `You're ${(targets.savings - percentages.savings).toFixed(1)}% below target. Consider increasing savings.`
                    : `Great job! You're ${(percentages.savings - targets.savings).toFixed(1)}% ahead on savings.`
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Budget Items by Category - Mobile-Optimized */}
      <div className="space-y-4 sm:space-y-6">
        {/* Needs */}
        {groupedItems.needs.length > 0 && (
          <CategorySection
            title="Needs"
            items={groupedItems.needs}
            total={totals.needs}
            currency={budget.currency}
            color="green"
            categoryType="needs"
            isExpanded={expandedSections.includes('needs')}
            onToggle={() => toggleSection('needs')}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onAddCategory={handleAddCategory}
            onAddChild={handleAddChild}
            expandedParents={expandedParents}
            onToggleParent={toggleParentExpansion}
          />
        )}

        {/* Wants */}
        {groupedItems.wants.length > 0 && (
          <CategorySection
            title="Wants"
            items={groupedItems.wants}
            total={totals.wants}
            currency={budget.currency}
            color="yellow"
            categoryType="wants"
            isExpanded={expandedSections.includes('wants')}
            onToggle={() => toggleSection('wants')}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onAddCategory={handleAddCategory}
            onAddChild={handleAddChild}
            expandedParents={expandedParents}
            onToggleParent={toggleParentExpansion}
          />
        )}

        {/* Savings */}
        {groupedItems.savings.length > 0 && (
          <CategorySection
            title="Savings"
            items={groupedItems.savings}
            total={totals.savings}
            currency={budget.currency}
            color="blue"
            categoryType="savings"
            isExpanded={expandedSections.includes('savings')}
            onToggle={() => toggleSection('savings')}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onAddCategory={handleAddCategory}
            onAddChild={handleAddChild}
            expandedParents={expandedParents}
            onToggleParent={toggleParentExpansion}
          />
        )}

        {/* Income (if zero-based) */}
        {groupedItems.income.length > 0 && (
          <CategorySection
            title="Income"
            items={groupedItems.income}
            total={totals.income}
            currency={budget.currency}
            color="teal"
            categoryType="income"
            isExpanded={expandedSections.includes('income')}
            onToggle={() => toggleSection('income')}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onAddCategory={handleAddCategory}
            onAddChild={handleAddChild}
            expandedParents={expandedParents}
            onToggleParent={toggleParentExpansion}
          />
        )}
      </div>

      {/* Modals */}
      {selectedItem && (
        <EditBudgetItemModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          budgetItem={selectedItem}
          currency={budget?.currency || 'CAD'}
          onSuccess={handleItemSuccess}
        />
      )}

      <AddBudgetItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        budgetId={budget?.id || ''}
        currency={budget?.currency || 'CAD'}
        preSelectedCategoryType={preSelectedCategoryType}
        onSuccess={handleItemSuccess}
      />

      {/* Create Parent Category Modal */}
      <CreateParentModal
        isOpen={isCreateParentModalOpen}
        onClose={() => {
          setIsCreateParentModalOpen(false);
        }}
        budgetId={budget?.id || ''}
        preSelectedCategoryType={preSelectedCategoryType}
        onSuccess={handleItemSuccess}
      />

      {/* Add Child to Parent Modal */}
      {selectedParentForChild && (
        <AddChildModal
          isOpen={isAddChildModalOpen}
          onClose={() => {
            setIsAddChildModalOpen(false);
            setSelectedParentForChild(null);
          }}
          parentId={selectedParentForChild.id}
          parentName={selectedParentForChild.category}
          currency={budget?.currency || 'CAD'}
          onSuccess={handleItemSuccess}
        />
      )}
    </div>
  );
};

// Enhanced Category Section Component with Glassmorphism (Mobile-Optimized)
interface CategorySectionProps {
  title: string;
  items: BudgetItem[];
  total: number;
  currency: string;
  color: 'green' | 'yellow' | 'blue' | 'teal';
  categoryType: 'needs' | 'wants' | 'savings' | 'income';
  isExpanded: boolean;
  onToggle: () => void;
  onEditItem: (item: BudgetItem) => void;
  onDeleteItem: (item: BudgetItem) => void;
  onAddCategory: (categoryType: 'needs' | 'wants' | 'savings' | 'income') => void;
  onAddChild: (parent: BudgetItem) => void;
  expandedParents: Set<string>;
  onToggleParent: (parentId: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  items,
  total,
  currency,
  color,
  categoryType,
  isExpanded,
  onToggle,
  onEditItem,
  onDeleteItem,
  onAddCategory,
  onAddChild,
  expandedParents,
  onToggleParent,
}) => {
  // Enhanced color configurations with gradients
  const colorConfig = {
    green: {
      badge: 'bg-gradient-to-r from-green-100 to-green-200 border-green-300 text-green-800',
      icon: 'bg-gradient-to-br from-green-400 to-green-600',
      dot: 'bg-gradient-to-br from-green-400 to-green-600',
      progressGradient: 'from-green-400 via-green-500 to-green-600',
    },
    yellow: {
      badge: 'bg-gradient-to-r from-yellow-100 to-orange-200 border-orange-300 text-orange-800',
      icon: 'bg-gradient-to-br from-yellow-400 to-orange-600',
      dot: 'bg-gradient-to-br from-yellow-400 to-orange-600',
      progressGradient: 'from-yellow-400 via-orange-500 to-orange-600',
    },
    blue: {
      badge: 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 text-blue-800',
      icon: 'bg-gradient-to-br from-blue-400 to-blue-600',
      dot: 'bg-gradient-to-br from-blue-400 to-blue-600',
      progressGradient: 'from-blue-400 via-blue-500 to-blue-600',
    },
    teal: {
      badge: 'bg-gradient-to-r from-teal-100 to-teal-200 border-teal-300 text-teal-800',
      icon: 'bg-gradient-to-br from-teal-400 to-teal-600',
      dot: 'bg-gradient-to-br from-teal-400 to-teal-600',
      progressGradient: 'from-teal-400 via-teal-500 to-teal-600',
    },
  };

  const config = colorConfig[color];

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/70 border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 animate-slide-up">
      {/* Section Header - Collapsible on Mobile */}
      <div className="w-full p-4 sm:p-6 lg:p-8 sm:pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Title and Count */}
          <button
            onClick={onToggle}
            className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0 hover:opacity-80 transition-opacity sm:cursor-default sm:pointer-events-none"
          >
            <ChevronDownIcon
              className={`w-5 h-5 sm:hidden text-gray-600 transition-transform duration-300 flex-shrink-0 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
            <div className={`w-2 h-2 sm:w-3 sm:h-3 ${config.dot} rounded-full shadow-lg flex-shrink-0`}></div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{title}</h3>
            <span className="text-xs sm:text-sm text-gray-500 font-medium flex-shrink-0">
              ({items.length})
            </span>
          </button>

          {/* Right: Action Buttons + Total Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Add Category Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddCategory(categoryType);
              }}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/80 hover:bg-emerald-50 border border-gray-300 hover:border-emerald-400 rounded-lg transition-all min-h-[36px] active:scale-95"
              title={`Add category to ${title}`}
            >
              <PlusCircleIcon className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline text-xs font-medium text-emerald-600">Add Category</span>
            </button>

            {/* Stats Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Show stats for this category type
                alert(`Stats for ${title} category - Coming soon!`);
              }}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/80 hover:bg-teal-50 border border-gray-300 hover:border-teal-400 rounded-lg transition-all min-h-[36px] active:scale-95"
              title={`View ${title} stats`}
            >
              <ChartBarIcon className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline text-xs font-medium text-teal-600">Stats</span>
            </button>

            {/* Total Badge */}
            <div className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg shadow-lg border ${config.badge}`}>
              {currency} {total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Items List - Collapsible on Mobile */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0 sm:max-h-[10000px] sm:opacity-100'
        } overflow-hidden`}
      >
        <div className="space-y-2 sm:space-y-3 p-4 sm:p-6 lg:p-8 sm:pt-4">
        {items.map((item, index) => {
          const budgeted = Number(item.budgeted_amount);
          const spent = Number(item.spent_amount);
          const remaining = budgeted - spent;
          const progress = budgeted > 0 ? (spent / budgeted) * 100 : 0;
          const isOverBudget = spent > budgeted;

          return (
            <div
              key={item.id}
              className="group relative overflow-hidden backdrop-blur-lg bg-gradient-to-br from-gray-50/80 to-white/80 border border-gray-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Background Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full transform"></div>

              {/* Desktop Layout: Horizontal */}
              <div className="relative hidden lg:block">
                <div className="flex items-center justify-between gap-4">
                  {/* Left Section: Icon + Category Info */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Category Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.category.charAt(0).toUpperCase()}
                    </div>

                    {/* Category Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <div className="font-bold text-lg text-gray-900 truncate">
                          {item.category}
                        </div>
                        {/* Collapse/Expand Chevron for Parents */}
                        {item.is_parent && item.children && item.children.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleParent(item.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            title={expandedParents.has(item.id) ? "Collapse" : "Expand"}
                          >
                            <ChevronDownIcon
                              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                                expandedParents.has(item.id) ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>
                      {item.description && (
                        <div className="text-sm text-gray-600 truncate mt-0.5">
                          {item.description}
                        </div>
                      )}
                      {/* Quick Stats Badges */}
                      <div className="flex items-center space-x-2 mt-2">
                        {isOverBudget ? (
                          <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            Over Budget
                          </span>
                        ) : remaining > 0 ? (
                          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {currency} {remaining.toFixed(2)} left
                          </span>
                        ) : (
                          <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            Fully Used
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Financial Stats + Progress */}
                  <div className="flex items-center space-x-6">
                    {/* Budgeted Amount */}
                    <div className="text-center">
                      <div className="text-xs text-gray-500 font-medium mb-1">Budgeted</div>
                      <div className="font-bold text-lg text-gray-900">
                        {currency} {budgeted.toFixed(2)}
                      </div>
                    </div>

                    {/* Spent Amount */}
                    <div className="text-center">
                      <div className="text-xs text-gray-500 font-medium mb-1">Spent</div>
                      <div className={`font-bold text-lg ${
                        isOverBudget ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {currency} {spent.toFixed(2)}
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="w-32">
                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-1.5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out shadow-lg ${
                            isOverBudget
                              ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                              : `bg-gradient-to-r ${config.progressGradient}`
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      {/* Progress Percentage */}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${
                          isOverBudget ? 'text-red-600' : 'text-gray-700'
                        }`}>
                          {progress.toFixed(0)}%
                        </span>
                        {isOverBudget && (
                          <ExclamationCircleIcon className="w-4 h-4 text-red-600" />
                        )}
                        {!isOverBudget && progress >= 90 && (
                          <ExclamationCircleIcon className="w-4 h-4 text-yellow-600" />
                        )}
                        {progress < 90 && !isOverBudget && (
                          <CheckCircleIcon className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Below all content (Desktop) */}
                <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-200">
                  {item.is_parent ? (
                    // Parent category: Show [Add] [Delete] buttons
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddChild(item);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-300 hover:border-emerald-400"
                        title="Add item to this category"
                      >
                        <PlusCircleIcon className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-600">Add</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-red-50 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-300 hover:border-red-400"
                        title="Delete category"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-600">Delete</span>
                      </button>
                    </>
                  ) : (
                    // Regular item or child: Show [Edit] [Delete] buttons
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditItem(item);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-teal-50 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-300 hover:border-teal-400"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4 text-teal-600" />
                        <span className="text-xs font-medium text-teal-600">Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-red-50 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-300 hover:border-red-400"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-600">Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile/Tablet Layout: Vertical Stack */}
              <div className="relative lg:hidden">
                {/* Top Row: Icon + Category Name + Progress % */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {/* Category Icon - Smaller on mobile */}
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.category.charAt(0).toUpperCase()}
                    </div>

                    {/* Category Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <div className="font-bold text-sm sm:text-base text-gray-900 truncate">
                          {item.category}
                        </div>
                        {/* Collapse/Expand Chevron for Parents (Mobile) */}
                        {item.is_parent && item.children && item.children.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleParent(item.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                            title={expandedParents.has(item.id) ? "Collapse" : "Expand"}
                          >
                            <ChevronDownIcon
                              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                                expandedParents.has(item.id) ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>
                      {item.description && (
                        <div className="text-xs text-gray-600 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress % Badge */}
                  <div className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                    isOverBudget
                      ? 'bg-red-100 text-red-700'
                      : progress >= 90
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    {progress.toFixed(0)}%
                  </div>
                </div>

                {/* Middle Row: Budget vs Spent */}
                <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                  <span className="text-gray-600">
                    Budget: <strong className="text-gray-900">{currency} {budgeted.toFixed(2)}</strong>
                  </span>
                  <span className={`${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                    Spent: <strong className={isOverBudget ? 'text-red-700' : 'text-gray-900'}>{currency} {spent.toFixed(2)}</strong>
                  </span>
                </div>

                {/* Bottom Row: Progress Bar */}
                <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isOverBudget
                        ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                        : `bg-gradient-to-r ${config.progressGradient}`
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  {isOverBudget ? (
                    <span className="text-[10px] sm:text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      Over Budget
                    </span>
                  ) : remaining > 0 ? (
                    <span className="text-[10px] sm:text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {currency} {remaining.toFixed(2)} left
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      Fully Used
                    </span>
                  )}

                  {/* Warning Icon */}
                  {isOverBudget && (
                    <ExclamationCircleIcon className="w-4 h-4 text-red-600" />
                  )}
                  {!isOverBudget && progress >= 90 && (
                    <ExclamationCircleIcon className="w-4 h-4 text-yellow-600" />
                  )}
                </div>

                {/* Action Buttons - Below progress bar */}
                <div className="flex items-center justify-end space-x-2 mt-2 pt-2 border-t border-gray-200">
                  {item.is_parent ? (
                    // Parent category: Show [Add] [Delete] buttons
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddChild(item);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-300 hover:border-emerald-400 min-h-[36px]"
                        title="Add item to this category"
                      >
                        <PlusCircleIcon className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-600">Add</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-red-50 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-300 hover:border-red-400 min-h-[36px]"
                        title="Delete category"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-600">Delete</span>
                      </button>
                    </>
                  ) : (
                    // Regular item or child: Show [Edit] [Delete] buttons
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditItem(item);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-teal-50 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-300 hover:border-teal-400 min-h-[36px]"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4 text-teal-600" />
                        <span className="text-xs font-medium text-teal-600">Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-red-50 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-300 hover:border-red-400 min-h-[36px]"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-600">Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Children Items - Modern Nested Card Design */}
              {item.is_parent && item.children && item.children.length > 0 && expandedParents.has(item.id) && (
                <div className="mt-6 px-4 sm:px-6 pb-4 space-y-3 animate-fade-in">
                  {/* Clean section divider */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px bg-gradient-to-r from-gray-300/50 via-gray-200/80 to-transparent flex-1"></div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Sub-Categories</span>
                    <div className="h-px bg-gradient-to-l from-gray-300/50 via-gray-200/80 to-transparent flex-1"></div>
                  </div>

                  {item.children.map((child, childIndex) => {
                    const childBudgeted = Number(child.budgeted_amount);
                    const childSpent = Number(child.spent_amount);
                    const childProgress = childBudgeted > 0 ? (childSpent / childBudgeted) * 100 : 0;
                    const childIsOverBudget = childSpent > childBudgeted;

                    return (
                      <div
                        key={child.id}
                        className="animate-fadeInSlideUp"
                        style={{ animationDelay: `${childIndex * 50}ms` }}
                      >
                        {/* Child Card - Nested, smaller, lighter than parent */}
                        <div
                          className="group bg-white/60 backdrop-blur-sm border border-gray-200/30 rounded-xl p-4 hover:bg-white/80 hover:shadow-md hover:border-gray-300/50 transition-all duration-200"
                        >
                          {/* Desktop Layout */}
                          <div className="hidden lg:flex items-center justify-between gap-4">
                            {/* Left: Icon + Info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Category Icon */}
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0"
                                style={{ backgroundColor: child.color }}
                              >
                                {child.icon || child.category.charAt(0).toUpperCase()}
                              </div>

                              {/* Category Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-800 truncate">
                                  {child.category}
                                </h4>
                                {child.description && (
                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {child.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Right: Financial Data */}
                            <div className="flex items-center gap-6">
                              {/* Budget Column */}
                              <div className="text-right min-w-[80px]">
                                <p className="text-xs text-gray-400 font-medium mb-0.5">Budget</p>
                                <p className="font-semibold text-sm text-gray-800">
                                  {currency} {childBudgeted.toFixed(2)}
                                </p>
                              </div>

                              {/* Spent Column */}
                              <div className="text-right min-w-[80px]">
                                <p className="text-xs text-gray-400 font-medium mb-0.5">Spent</p>
                                <p className={`font-semibold text-sm ${
                                  childIsOverBudget ? 'text-red-600' : 'text-gray-800'
                                }`}>
                                  {currency} {childSpent.toFixed(2)}
                                </p>
                              </div>

                              {/* Progress Indicator */}
                              <div className="min-w-[100px]">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-400 font-medium">Progress</span>
                                  <span className={`text-xs font-bold ${
                                    childIsOverBudget
                                      ? 'text-red-600'
                                      : childProgress >= 90
                                        ? 'text-yellow-600'
                                        : 'text-gray-600'
                                  }`}>
                                    {childProgress.toFixed(0)}%
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-gray-200/60 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                                      childIsOverBudget
                                        ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                                        : `bg-gradient-to-r ${config.progressGradient}`
                                    }`}
                                    style={{ width: `${Math.min(childProgress, 100)}%` }}
                                  />
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditItem(child);
                                  }}
                                  className="p-2 bg-white/80 hover:bg-teal-50 rounded-lg shadow-sm hover:shadow border border-gray-300/50 hover:border-teal-400 transition-all"
                                  title="Edit"
                                  aria-label="Edit child item"
                                >
                                  <PencilIcon className="w-4 h-4 text-teal-600" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteItem(child);
                                  }}
                                  className="p-2 bg-white/80 hover:bg-red-50 rounded-lg shadow-sm hover:shadow border border-gray-300/50 hover:border-red-400 transition-all"
                                  title="Delete"
                                  aria-label="Delete child item"
                                >
                                  <TrashIcon className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Tablet Layout (md-lg) */}
                          <div className="hidden md:flex lg:hidden flex-col gap-3">
                            {/* Header Row */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0"
                                  style={{ backgroundColor: child.color }}
                                >
                                  {child.icon || child.category.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-800 truncate">
                                    {child.category}
                                  </h4>
                                  {child.description && (
                                    <p className="text-xs text-gray-500 truncate">
                                      {child.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Progress Badge */}
                              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                childIsOverBudget
                                  ? 'bg-red-100 text-red-700'
                                  : childProgress >= 90
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}>
                                {childProgress.toFixed(0)}%
                              </div>
                            </div>

                            {/* Financial Info Row */}
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex gap-4">
                                <div>
                                  <span className="text-gray-500">Budget:</span>
                                  <span className="font-semibold text-gray-800 ml-1">
                                    {currency} {childBudgeted.toFixed(2)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Spent:</span>
                                  <span className={`font-semibold ml-1 ${
                                    childIsOverBudget ? 'text-red-600' : 'text-gray-800'
                                  }`}>
                                    {currency} {childSpent.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditItem(child);
                                  }}
                                  className="p-2 bg-white/80 hover:bg-teal-50 rounded-lg shadow-sm border border-gray-300/50 hover:border-teal-400 transition-all"
                                  aria-label="Edit"
                                >
                                  <PencilIcon className="w-4 h-4 text-teal-600" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteItem(child);
                                  }}
                                  className="p-2 bg-white/80 hover:bg-red-50 rounded-lg shadow-sm border border-gray-300/50 hover:border-red-400 transition-all"
                                  aria-label="Delete"
                                >
                                  <TrashIcon className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-gray-200/60 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  childIsOverBudget
                                    ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                                    : `bg-gradient-to-r ${config.progressGradient}`
                                }`}
                                style={{ width: `${Math.min(childProgress, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Mobile Layout */}
                          <div className="md:hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                <div
                                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-semibold text-xs shadow-sm flex-shrink-0"
                                  style={{ backgroundColor: child.color }}
                                >
                                  {child.icon || child.category.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-800 truncate">
                                    {child.category}
                                  </h4>
                                  {child.description && (
                                    <p className="text-xs text-gray-500 truncate">
                                      {child.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Progress Badge */}
                              <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                                childIsOverBudget
                                  ? 'bg-red-100 text-red-700'
                                  : childProgress >= 90
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}>
                                {childProgress.toFixed(0)}%
                              </div>
                            </div>

                            {/* Financial Info */}
                            <div className="flex justify-between text-xs mb-3">
                              <div>
                                <p className="text-gray-500 mb-0.5">Budget</p>
                                <p className="font-semibold text-gray-800">
                                  {currency} {childBudgeted.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-500 mb-0.5">Spent</p>
                                <p className={`font-semibold ${
                                  childIsOverBudget ? 'text-red-600' : 'text-gray-800'
                                }`}>
                                  {currency} {childSpent.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-gray-200/60 rounded-full overflow-hidden mb-3">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  childIsOverBudget
                                    ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                                    : `bg-gradient-to-r ${config.progressGradient}`
                                }`}
                                style={{ width: `${Math.min(childProgress, 100)}%` }}
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-3 border-t border-gray-200/50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditItem(child);
                                }}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/80 hover:bg-teal-50 rounded-lg shadow-sm border border-gray-300/50 hover:border-teal-400 transition-all"
                              >
                                <PencilIcon className="w-4 h-4 text-teal-600" />
                                <span className="text-xs font-medium text-teal-600">Edit</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteItem(child);
                                }}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/80 hover:bg-red-50 rounded-lg shadow-sm border border-gray-300/50 hover:border-red-400 transition-all"
                              >
                                <TrashIcon className="w-4 h-4 text-red-600" />
                                <span className="text-xs font-medium text-red-600">Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default BudgetDetailPage;
