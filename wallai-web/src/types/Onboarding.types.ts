/**
 * Onboarding Types
 *
 * TypeScript interfaces for the onboarding flow
 */

export type Currency = 'USD' | 'CAD' | 'MXN';

export type BudgetFramework = '50_30_20' | 'zero_based' | 'skip';

export interface OnboardingStatus {
  needs_onboarding: boolean;
  has_personal_space: boolean;
  has_budget: boolean;
  user_id: string;
}

export interface SpaceData {
  name: string;
  currency: Currency;
  space_id?: string;
  invite_code?: string;
}

export interface BudgetData {
  monthly_income?: number;
  framework?: BudgetFramework;
  skipped: boolean;
}

export interface OnboardingContextType {
  currentStep: 1 | 2 | 3;

  spaceData: SpaceData;
  budgetData: BudgetData;

  isLoading: boolean;
  error?: string;

  // Methods
  setSpaceData: (data: Partial<SpaceData>) => void;
  setBudgetData: (data: Partial<BudgetData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

// API Request/Response types
export interface CreateSpaceRequest {
  name: string;
  currency: Currency;
}

export interface CreateSpaceResponse {
  success: boolean;
  data: {
    space: {
      id: string;
      name: string;
      currency: Currency;
      is_personal: boolean;
      invite_code: string;
      created_at: string;
    };
  };
}

export interface CreateBudgetRequest {
  space_id: string;
  monthly_income: number;
  framework: BudgetFramework;
}

export interface BudgetItem {
  id: string;
  category: string;
  budgeted_amount: number;
  type: 'necesidad' | 'deseo' | 'ahorro';
}

export interface CreateBudgetResponse {
  success: boolean;
  data: {
    budget?: {
      id: string;
      name: string;
      type: string;
      total_income: number;
      framework: string;
      items: BudgetItem[];
    };
    skipped?: boolean;
  };
}

export interface CompleteOnboardingResponse {
  success: boolean;
  data: {
    onboarding_completed: boolean;
    redirect_to: string;
  };
}
