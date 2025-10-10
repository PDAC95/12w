/**
 * Dashboard Data Types
 * Interfaces for dashboard summary and components
 */

export interface Space {
  id: string;
  name: string;
  currency: string;
}

export interface Budget {
  id: string;
  name: string;
  month_period: string;
}

export interface MonthlyBalance {
  income: number;
  expenses: number;
  balance: number;
  percent_spent: number;
  currency: string;
}

export interface SavingGoal {
  name: string;
  target: number;
  current: number;
  progress: number;
  currency: string;
}

export interface RecentExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string | null;
  currency: string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
  currency: string;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  currency: string;
}

export interface QuickStats {
  avg_daily_spending: number;
  projected_monthly: number;
  top_category: string;
  top_category_amount: number;
  days_remaining: number;
  currency: string;
}

export interface SpendingBreakdown {
  category: string;
  amount: number;
  count: number;
  percentage: number;
  currency: string;
}

export interface DashboardData {
  has_data: boolean;
  space: Space | null;
  budget?: Budget;
  monthly_balance: MonthlyBalance | null;
  saving_goals: SavingGoal[];
  recent_expenses: RecentExpense[];
  upcoming_bills: UpcomingBill[];
  weekly_challenges: WeeklyChallenge[];
  quick_stats: QuickStats | null;
  spending_breakdown: SpendingBreakdown[];
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardData;
}
