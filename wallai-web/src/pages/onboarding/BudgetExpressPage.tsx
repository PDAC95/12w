/**
 * BudgetExpressPage - Onboarding Step 3
 *
 * User sets up their first budget with auto-generated framework
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '@/context/OnboardingContext';
import { onboardingService } from '@/services/onboarding.service';
import type { BudgetFramework } from '@/types/Onboarding.types';

// Framework options
const frameworks = [
  {
    id: '50_30_20' as BudgetFramework,
    name: '50/30/20',
    label: 'Recommended',
    description: '50% needs, 30% wants, 20% savings',
    color: 'teal',
    details: 'Balanced approach: Prioritizes essentials while allowing flexibility for lifestyle and savings.',
  },
  {
    id: 'zero_based' as BudgetFramework,
    name: 'Zero-Based',
    label: 'Advanced',
    description: 'Assign every dollar manually',
    color: 'blue',
    details: 'Total control: You decide exactly where each peso goes. Best for detail-oriented users.',
  },
];

export default function BudgetExpressPage() {
  const navigate = useNavigate();
  const { spaceData, budgetData, setBudgetData, prevStep } = useOnboarding();

  const [monthlyIncome, setMonthlyIncome] = useState<string>(
    budgetData.monthly_income?.toString() || ''
  );
  const [selectedFramework, setSelectedFramework] = useState<BudgetFramework | null>(
    budgetData.framework || '50_30_20'
  );
  const [skipBudget, setSkipBudget] = useState(budgetData.skipped || false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Handle skip checkbox
  const handleSkipChange = (checked: boolean) => {
    setSkipBudget(checked);
    if (checked) {
      setSelectedFramework(null);
      setMonthlyIncome('');
    } else {
      setSelectedFramework('50_30_20');
    }
    setError(null);
  };

  // Validation
  const validateForm = (): string | null => {
    if (skipBudget) {
      return null; // Skip doesn't require validation
    }

    if (!monthlyIncome || parseFloat(monthlyIncome) <= 0) {
      return 'Please enter your monthly income';
    }

    if (!selectedFramework) {
      return 'Please select a budget framework';
    }

    return null;
  };

  // Handle create budget
  const handleCreateBudget = async () => {
    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create budget (or skip)
      if (!skipBudget && spaceData.space_id) {
        await onboardingService.createBudget({
          space_id: spaceData.space_id,
          monthly_income: parseFloat(monthlyIncome),
          framework: selectedFramework as BudgetFramework,
        });

        // Save to context
        setBudgetData({
          monthly_income: parseFloat(monthlyIncome),
          framework: selectedFramework as BudgetFramework,
          skipped: false,
        });
      } else {
        // Skip budget creation
        setBudgetData({
          skipped: true,
        });
      }

      // Complete onboarding
      await onboardingService.completeOnboarding();

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Could not create your budget. You can skip for now.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle skip button
  const handleSkip = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Just complete onboarding without budget
      await onboardingService.completeOnboarding();

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back
  const handleBack = () => {
    prevStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Progress */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 font-medium mb-2">Step 3 of 3</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-600 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Set up your budget
            </h1>
            <p className="text-gray-600">
              {skipBudget
                ? "You can configure this later in your dashboard"
                : "We'll create a budget template to get you started"}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Skip Checkbox */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipBudget}
                  onChange={(e) => handleSkipChange(e.target.checked)}
                  className="h-5 w-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  I prefer to set this up later
                </span>
              </label>
            </div>

            {/* Monthly Income (hidden if skip) */}
            {!skipBudget && (
              <div>
                <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-2">
                  What is your monthly income?
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 text-lg">
                    {spaceData.currency === 'USD' ? '$' : spaceData.currency === 'CAD' ? '$' : '$'}
                  </span>
                  <input
                    id="monthlyIncome"
                    type="number"
                    min="0"
                    step="0.01"
                    value={monthlyIncome}
                    onChange={(e) => {
                      setMonthlyIncome(e.target.value);
                      setError(null);
                    }}
                    placeholder="5000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                  />
                  <span className="absolute right-4 top-3 text-gray-400 text-sm">
                    {spaceData.currency}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Your total monthly income after taxes
                </p>
              </div>
            )}

            {/* Framework Selection (hidden if skip) */}
            {!skipBudget && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose a budget method
                </label>
                <div className="space-y-3">
                  {frameworks.map((framework) => (
                    <button
                      key={framework.id}
                      type="button"
                      onClick={() => setSelectedFramework(framework.id)}
                      className={`
                        w-full p-4 rounded-lg border-2 transition-all text-left relative
                        ${
                          selectedFramework === framework.id
                            ? `border-${framework.color}-600 bg-${framework.color}-50 shadow-md`
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-bold text-lg text-gray-900">
                              {framework.name}
                            </span>
                            {framework.label && (
                              <span
                                className={`
                                  px-2 py-0.5 rounded text-xs font-medium
                                  ${
                                    framework.label === 'Recommended'
                                      ? 'bg-teal-100 text-teal-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }
                                `}
                              >
                                {framework.label}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{framework.description}</p>
                          <p className="text-xs text-gray-500">{framework.details}</p>
                        </div>

                        {/* Info Icon */}
                        <div
                          className="relative ml-2 p-1 text-gray-400 hover:text-gray-600 cursor-help"
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            setShowTooltip(framework.id);
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            setShowTooltip(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <InformationCircleIcon className="h-5 w-5" />
                        </div>

                        {/* Checkmark */}
                        {selectedFramework === framework.id && (
                          <svg
                            className="h-6 w-6 text-teal-600 ml-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Preview for 50/30/20 */}
            {!skipBudget && selectedFramework === '50_30_20' && monthlyIncome && parseFloat(monthlyIncome) > 0 && (
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="font-semibold text-gray-900 mb-3">Budget Preview</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-teal-700">
                      ${(parseFloat(monthlyIncome) * 0.5).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Needs (50%)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">
                      ${(parseFloat(monthlyIncome) * 0.3).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Wants (30%)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-700">
                      ${(parseFloat(monthlyIncome) * 0.2).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Savings (20%)</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  We'll create 7 categories automatically
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back
              </button>

              {!skipBudget && (
                <button
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Skip
                </button>
              )}

              <button
                onClick={handleCreateBudget}
                disabled={isLoading}
                className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-teal-600 to-green-600 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {skipBudget ? 'Finishing...' : 'Creating...'}
                  </span>
                ) : (
                  <span>
                    {skipBudget ? 'Finish Setup' : 'Create Budget & Start'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          You can always adjust your budget categories later
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
