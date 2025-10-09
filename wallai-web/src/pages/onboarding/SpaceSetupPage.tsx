/**
 * SpaceSetupPage - Onboarding Step 2
 *
 * User creates their personal space and selects currency
 */

import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '@/context/OnboardingContext';
import { onboardingService } from '@/services/onboarding.service';
import type { Currency } from '@/types/Onboarding.types';

// Currency options with flags
const currencies = [
  { code: 'USD' as Currency, name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'CAD' as Currency, name: 'Canadian Dollar', flag: '🇨🇦', symbol: '$' },
  { code: 'MXN' as Currency, name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
];

export default function SpaceSetupPage() {
  const { spaceData, setSpaceData, nextStep, prevStep } = useOnboarding();

  const [name, setName] = useState(spaceData.name || '');
  const [currency, setCurrency] = useState<Currency>(spaceData.currency || 'USD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation
  const validateForm = (): string | null => {
    if (!name.trim()) {
      return 'Space name is required';
    }
    if (name.length < 3) {
      return 'Space name must be at least 3 characters';
    }
    if (name.length > 50) {
      return 'Space name cannot exceed 50 characters';
    }
    return null;
  };

  // Handle continue
  const handleContinue = async () => {
    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call API to create space
      const response = await onboardingService.createSpace({
        name: name.trim(),
        currency,
      });

      // Save space data to context
      setSpaceData({
        name: response.data.space.name,
        currency: response.data.space.currency,
        space_id: response.data.space.id,
        invite_code: response.data.space.invite_code,
      });

      // Navigate to next step
      nextStep();
    } catch (err: any) {
      setError(err.message || 'Could not create your space. Please try again.');
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
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 font-medium mb-2">Step 2 of 3</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-600 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '66%' }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Create your personal space
            </h1>
            <p className="text-gray-600">
              This is where you'll manage your finances privately
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Space Name */}
            <div>
              <label htmlFor="spaceName" className="block text-sm font-medium text-gray-700 mb-2">
                Space Name
              </label>
              <input
                id="spaceName"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="My Personal Space"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                maxLength={50}
              />
              <div className="mt-1 text-xs text-gray-500">
                {name.length}/50 characters
              </div>
            </div>

            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Currency</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setCurrency(curr.code)}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-left
                      ${
                        currency === curr.code
                          ? 'border-teal-600 bg-teal-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{curr.flag}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{curr.code}</div>
                        <div className="text-xs text-gray-500">{curr.name}</div>
                      </div>
                      {currency === curr.code && (
                        <svg
                          className="h-5 w-5 text-teal-600"
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

              <button
                onClick={handleContinue}
                disabled={isLoading || !name.trim()}
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
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Continue
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          You can create shared spaces later to manage finances with others
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
