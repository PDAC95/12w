/**
 * Budget TypeScript Types
 * =======================
 * Type definitions for budget and budget item management
 */

// =====================================================
// ENUMS AND LITERALS
// =====================================================

export type BudgetType = 'master' | 'secondary';
export type BudgetFramework = '50_30_20' | '60_20_20' | 'zero_based' | 'custom';
export type CategoryType = 'needs' | 'wants' | 'savings' | 'income';

// =====================================================
// BUDGET ITEM TYPES
// =====================================================

export interface BudgetItem {
  id: string;
  budget_id: string;
  category: string;
  description?: string;
  category_type: CategoryType;
  budgeted_amount: number;
  spent_amount: number;
  icon?: string;
  color: string;
  display_order: number;
  parent_id?: string | null;
  is_parent: boolean;
  created_at: string;
  updated_at: string;
  children?: BudgetItem[];  // For hierarchical display
}

export interface BudgetItemCreate {
  category: string;
  description?: string;
  category_type: CategoryType;
  budgeted_amount: number;
  spent_amount?: number;
  icon?: string;
  color?: string;
  display_order?: number;
  parent_id?: string | null;
  is_parent?: boolean;
}

export interface BudgetItemUpdate {
  category?: string;
  description?: string;
  category_type?: CategoryType;
  budgeted_amount?: number;
  spent_amount?: number;
  icon?: string;
  color?: string;
  display_order?: number;
  parent_id?: string | null;
  is_parent?: boolean;
}

// Parent-child specific types
export interface BudgetItemChildCreate {
  category: string;
  description?: string;
  budgeted_amount: number;
  spent_amount?: number;
  icon?: string;
  color?: string;
  display_order?: number;
}

export interface ParentCategoryCreate {
  category: string;
  description?: string;
  category_type: CategoryType;
  icon?: string;
  color?: string;
  display_order?: number;
  children: BudgetItemChildCreate[];
}

export interface BudgetItemHierarchyResponse {
  items: BudgetItem[];
}

// =====================================================
// BUDGET TYPES
// =====================================================

export interface Budget {
  id: string;
  space_id: string;
  name: string;
  description?: string;
  type: BudgetType;
  month_period: string; // Format: YYYY-MM
  framework: BudgetFramework;
  total_income: number;
  total_budgeted: number;
  total_spent: number;
  currency: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  budget_items?: BudgetItem[];
}

export interface BudgetCreate {
  space_id: string;
  name: string;
  description?: string;
  type: BudgetType;
  month_period: string; // Format: YYYY-MM
  framework: BudgetFramework;
  total_income: number;
  currency?: string;
  budget_items?: BudgetItemCreate[];
}

export interface BudgetUpdate {
  name?: string;
  description?: string;
  framework?: BudgetFramework;
  total_income?: number;
  currency?: string;
}

export interface BudgetListResponse {
  budgets: Budget[];
  total: number;
}

// =====================================================
// FRAMEWORK TEMPLATES
// =====================================================

export interface CategoryTemplate {
  category: string;
  category_type: CategoryType;
  percentage: number;
  icon?: string;
  color: string;
}

export interface FrameworkTemplate {
  name: string;
  description: string;
  categories: CategoryTemplate[];
}

export interface FrameworkTemplates {
  '50_30_20': FrameworkTemplate;
  '60_20_20': FrameworkTemplate;
  'zero_based': FrameworkTemplate;
  'custom': FrameworkTemplate;
}

// =====================================================
// STATISTICS
// =====================================================

export interface CategoryBreakdown {
  category: string;
  category_type: CategoryType;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage_used: number;
}

export interface BudgetStats {
  total_income: number;
  total_budgeted: number;
  total_spent: number;
  remaining: number;
  percentage_spent: number;
  category_breakdown: CategoryBreakdown[];
}

// =====================================================
// QUERY PARAMS
// =====================================================

export interface BudgetListParams {
  space_id: string;
  month_period?: string;
  budget_type?: BudgetType;
}

export interface BudgetReplicateRequest {
  target_month_period: string;
  copy_amounts?: boolean;
  copy_items?: boolean;
}

// =====================================================
// UI HELPER TYPES
// =====================================================

export interface BudgetFormData {
  name: string;
  description: string;
  month_period: string;
  framework: BudgetFramework;
  total_income: string;
  currency: string;
}

export interface BudgetItemFormData {
  category: string;
  description: string;
  category_type: CategoryType;
  budgeted_amount: string;
  icon: string;
  color: string;
}

// =====================================================
// FRAMEWORK DISPLAY
// =====================================================

export interface FrameworkOption {
  id: BudgetFramework;
  name: string;
  description: string;
  icon: string;
  color: string;
  popular?: boolean;
}

export const FRAMEWORK_OPTIONS: FrameworkOption[] = [
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

// =====================================================
// CATEGORY TYPE DISPLAY
// =====================================================

export interface CategoryTypeOption {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORY_TYPE_OPTIONS: CategoryTypeOption[] = [
  {
    id: 'needs',
    name: 'Needs',
    icon: 'home',
    color: '#10B981',
  },
  {
    id: 'wants',
    name: 'Wants',
    icon: 'shopping-bag',
    color: '#F59E0B',
  },
  {
    id: 'savings',
    name: 'Savings',
    icon: 'piggy-bank',
    color: '#3B82F6',
  },
  {
    id: 'income',
    name: 'Income',
    icon: 'dollar-sign',
    color: '#14B8A6',
  },
];

// =====================================================
// VALIDATION HELPERS
// =====================================================

export function isValidMonthPeriod(value: string): boolean {
  const regex = /^\d{4}-\d{2}$/;
  if (!regex.test(value)) return false;

  const [year, month] = value.split('-').map(Number);
  return year >= 2000 && year <= 2100 && month >= 1 && month <= 12;
}

export function formatMonthPeriod(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function parseMonthPeriod(monthPeriod: string): Date {
  const [year, month] = monthPeriod.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

export function formatMonthPeriodDisplay(monthPeriod: string): string {
  const date = parseMonthPeriod(monthPeriod);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getCurrentMonthPeriod(): string {
  return formatMonthPeriod(new Date());
}

export function getNextMonthPeriod(currentMonth: string): string {
  const date = parseMonthPeriod(currentMonth);
  date.setMonth(date.getMonth() + 1);
  return formatMonthPeriod(date);
}

export function getPreviousMonthPeriod(currentMonth: string): string {
  const date = parseMonthPeriod(currentMonth);
  date.setMonth(date.getMonth() - 1);
  return formatMonthPeriod(date);
}

// =====================================================
// CALCULATION HELPERS
// =====================================================

export function calculateBudgetProgress(budget: Budget): number {
  const totalIncome = Number(budget.total_income);
  const totalSpent = Number(budget.total_spent);
  if (totalIncome === 0) return 0;
  return (totalSpent / totalIncome) * 100;
}

export function calculateCategoryProgress(item: BudgetItem): number {
  const budgetedAmount = Number(item.budgeted_amount);
  const spentAmount = Number(item.spent_amount);
  if (budgetedAmount === 0) return 0;
  return (spentAmount / budgetedAmount) * 100;
}

export function getBudgetStatus(budget: Budget): 'under' | 'on-track' | 'over' {
  const progress = calculateBudgetProgress(budget);
  if (progress < 80) return 'under';
  if (progress <= 100) return 'on-track';
  return 'over';
}

export function getCategoryTypeColor(categoryType: CategoryType): string {
  const option = CATEGORY_TYPE_OPTIONS.find(opt => opt.id === categoryType);
  return option?.color || '#4ADE80';
}

export function getFrameworkColor(framework: BudgetFramework): string {
  const option = FRAMEWORK_OPTIONS.find(opt => opt.id === framework);
  return option?.color || '#4ADE80';
}
