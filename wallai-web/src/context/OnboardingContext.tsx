/**
 * OnboardingContext
 *
 * Global state management for the onboarding flow.
 * Maintains data between steps and handles navigation.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  OnboardingContextType,
  SpaceData,
  BudgetData,
} from '@/types/Onboarding.types';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorState] = useState<string | undefined>(undefined);

  const [spaceData, setSpaceDataState] = useState<SpaceData>({
    name: '',
    currency: 'USD',
  });

  const [budgetData, setBudgetDataState] = useState<BudgetData>({
    skipped: false,
  });

  // Update space data
  const setSpaceData = useCallback((data: Partial<SpaceData>) => {
    setSpaceDataState(prev => ({ ...prev, ...data }));
  }, []);

  // Update budget data
  const setBudgetData = useCallback((data: Partial<BudgetData>) => {
    setBudgetDataState(prev => ({ ...prev, ...data }));
  }, []);

  // Navigate to next step
  const nextStep = useCallback(() => {
    // Map: "From current step, go to..."
    const routesFromStep: Record<number, string> = {
      1: '/onboarding/space',   // From welcome → go to space setup
      2: '/onboarding/budget',  // From space → go to budget
      3: '/dashboard',          // From budget → go to dashboard
    };

    // Navigate first (using current step to determine destination)
    const destination = routesFromStep[currentStep];
    if (destination) {
      navigate(destination);
    }

    // Then update step number
    const nextStepNumber = Math.min(currentStep + 1, 3) as 1 | 2 | 3;
    setCurrentStep(nextStepNumber);
  }, [currentStep, navigate]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    // Map: "From current step, go back to..."
    const backRoutesFromStep: Record<number, string> = {
      1: '/onboarding/welcome',  // From welcome → stay (edge case)
      2: '/onboarding/welcome',  // From space → back to welcome
      3: '/onboarding/space',    // From budget → back to space
    };

    // Navigate first (using current step to determine destination)
    const destination = backRoutesFromStep[currentStep];
    if (destination) {
      navigate(destination);
    }

    // Then update step number
    const prevStepNumber = Math.max(currentStep - 1, 1) as 1 | 2 | 3;
    setCurrentStep(prevStepNumber);
  }, [currentStep, navigate]);

  // Set error message
  const setError = useCallback((errorMessage: string) => {
    setErrorState(errorMessage);
  }, []);

  // Clear error message
  const clearError = useCallback(() => {
    setErrorState(undefined);
  }, []);

  const value: OnboardingContextType = {
    currentStep,
    spaceData,
    budgetData,
    isLoading,
    error,
    setSpaceData,
    setBudgetData,
    nextStep,
    prevStep,
    setError,
    clearError,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook to use the onboarding context
export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);

  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }

  return context;
};
