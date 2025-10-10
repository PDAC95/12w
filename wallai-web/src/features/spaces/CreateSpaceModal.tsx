/**
 * CreateSpaceModal Component
 *
 * Modal for creating new spaces (personal, shared, or project)
 * Mobile-first design with modern UX/UI practices
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  XMarkIcon,
  CubeIcon,
  UserGroupIcon,
  FlagIcon,
  ChevronLeftIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { spaceService } from '@/services/space.service';
import { currencyService } from '@/services/currency.service';
import type { SpaceType, Currency as SpaceCurrency } from '@/types/Space.types';
import type { Currency } from '@/types/Currency.types';

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (spaceId: string, inviteCode: string, spaceName: string) => void;
}

type Step = 'type' | 'details';

const SPACE_TYPES = [
  {
    value: 'personal' as SpaceType,
    label: 'Personal',
    description: 'Just for me',
    icon: CubeIcon,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    value: 'shared' as SpaceType,
    label: 'Shared',
    description: 'Family or couple',
    icon: UserGroupIcon,
    color: 'from-primary-500 to-secondary-500',
    borderColor: 'border-primary-500',
    bgColor: 'bg-primary-50',
    iconColor: 'text-primary-600',
  },
  {
    value: 'project' as SpaceType,
    label: 'Project',
    description: 'Specific goal',
    icon: FlagIcon,
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<Step>('type');
  const [spaceType, setSpaceType] = useState<SpaceType | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<string>('USD');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  // Load currencies on mount
  React.useEffect(() => {
    const loadCurrencies = async () => {
      setIsLoadingCurrencies(true);
      try {
        const response = await currencyService.getCurrencies();
        setCurrencies(response.currencies);

        // Set default currency to first active currency
        if (response.currencies.length > 0) {
          setCurrency(response.currencies[0].code);
        }
      } catch (err) {
        console.error('Failed to load currencies:', err);
        // Fallback to default if API fails
        setCurrency('USD');
      } finally {
        setIsLoadingCurrencies(false);
      }
    };

    loadCurrencies();
  }, []);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('type');
        setSpaceType(null);
        setName('');
        setDescription('');
        // Reset to first currency or USD
        if (currencies.length > 0) {
          setCurrency(currencies[0].code);
        } else {
          setCurrency('USD');
        }
        setError('');
        setIsCurrencyDropdownOpen(false);
      }, 300);
    }
  }, [isOpen, currencies]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCurrencyDropdownOpen(false);
      }
    };

    if (isCurrencyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isCurrencyDropdownOpen]);

  const handleTypeSelect = (type: SpaceType) => {
    setSpaceType(type);
    setStep('details');

    // Set default name based on type
    if (type === 'personal') {
      setName('My Personal Budget');
    } else if (type === 'shared') {
      setName('Shared Budget');
    } else if (type === 'project') {
      setName('');
    }
  };

  const handleBack = () => {
    setStep('type');
    setError('');
  };

  const handleCurrencySelect = (currencyCode: string) => {
    setCurrency(currencyCode);
    setIsCurrencyDropdownOpen(false);
  };

  const selectedCurrency = currencies.find((c) => c.code === currency);

  // Get dropdown button position for fixed positioning
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, bottom: 0, left: 0, width: 0, openUpward: false });

  const updateDropdownPosition = () => {
    if (currencyDropdownRef.current) {
      const rect = currencyDropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Dropdown height estimate (3 items * 60px per item)
      const dropdownHeight = 180;

      // Add extra buffer for mobile navbar (typically 80-100px at bottom)
      const mobileNavbarHeight = 100;
      const effectiveSpaceBelow = spaceBelow - mobileNavbarHeight;

      // Open upward if not enough space below (considering navbar)
      const openUpward = effectiveSpaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        bottom: viewportHeight - rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        openUpward,
      });
    }
  };

  // Update position when dropdown opens
  React.useEffect(() => {
    if (isCurrencyDropdownOpen) {
      updateDropdownPosition();
    }
  }, [isCurrencyDropdownOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!spaceType) {
      setError('Please select a space type');
      return;
    }

    if (!name.trim()) {
      setError('Please enter a space name');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await spaceService.createSpace({
        name: name.trim(),
        description: description.trim() || undefined,
        space_type: spaceType,
        currency: currency as SpaceCurrency,
      });

      const { space, member } = response.data;
      onSuccess(space.id, space.invite_code, space.name);
      onClose();
    } catch (err: any) {
      console.error('Failed to create space:', err);
      setError(err.message || 'Failed to create space. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedTypeData = SPACE_TYPES.find((t) => t.value === spaceType);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Centered with offset upward to avoid navbar */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pb-24 md:pb-4" style={{ marginTop: '-30px' }}>
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl transform transition-all max-h-[85vh] flex flex-col overflow-hidden animate-scale-in">
          {/* Header - Sticky */}
          <div className="flex-shrink-0 relative px-6 pt-6 pb-4 border-b border-gray-100">
            {/* Progress Indicator */}
            <div className="absolute top-3 left-0 right-0 flex justify-center gap-2 md:hidden">
              <div
                className={`h-1 w-12 rounded-full transition-all ${
                  step === 'type' ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              />
              <div
                className={`h-1 w-12 rounded-full transition-all ${
                  step === 'details' ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              />
            </div>

            {/* Header Content */}
            <div className="flex items-center justify-between mt-4 md:mt-0">
              {/* Back Button (only on step 2) */}
              {step === 'details' && (
                <button
                  onClick={handleBack}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Back"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
              )}

              {/* Title */}
              <div className={step === 'type' ? 'flex-1' : ''}>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {step === 'type' ? 'Choose Space Type' : 'Space Details'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {step === 'type'
                    ? 'Select how you want to organize your finances'
                    : 'Fill in your space information'}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Step 1: Type Selection */}
            {step === 'type' && (
              <div className="space-y-3">
                {SPACE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeSelect(type.value)}
                    className="w-full group relative p-5 rounded-2xl border-2 border-gray-200 hover:border-primary-400 transition-all duration-200 hover:shadow-lg active:scale-98 text-left"
                  >
                    {/* Background Gradient on Hover */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                    />

                    <div className="relative flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-xl ${type.bgColor}`}>
                          <type.icon className={`h-6 w-6 ${type.iconColor}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {type.label}
                        </h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ChevronLeftIcon className="h-5 w-5 text-gray-400 transform rotate-180 group-hover:text-primary-500 transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Details Form */}
            {step === 'details' && selectedTypeData && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Selected Type Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 ${selectedTypeData.bgColor} ${selectedTypeData.borderColor} border-2 rounded-full`}
                >
                  <selectedTypeData.icon className={`h-5 w-5 ${selectedTypeData.iconColor}`} />
                  <span className="font-medium text-gray-700">
                    {selectedTypeData.label} Space
                  </span>
                </div>

                {/* Space Name */}
                <div>
                  <label
                    htmlFor="space-name"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Space Name
                  </label>
                  <input
                    id="space-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Family Budget, Vacation Fund"
                    maxLength={100}
                    className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all outline-none"
                    required
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    {name.length}/100 characters
                  </p>
                </div>

                {/* Description (Optional) */}
                <div>
                  <label
                    htmlFor="space-description"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Description{' '}
                    <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="space-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a brief description..."
                    maxLength={500}
                    rows={3}
                    className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all resize-none outline-none"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    {description.length}/500 characters
                  </p>
                </div>

                {/* Currency Selection Dropdown */}
                <div>
                  <label
                    htmlFor="space-currency"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Currency
                  </label>
                  <div className="relative" ref={currencyDropdownRef}>
                    {/* Dropdown Button */}
                    <button
                      type="button"
                      onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                      disabled={isLoadingCurrencies}
                      className="w-full px-4 py-3.5 text-left border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all outline-none hover:border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-between">
                        {isLoadingCurrencies ? (
                          <div className="text-sm text-gray-500">Loading currencies...</div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{selectedCurrency?.flag_emoji}</span>
                              <div>
                                <div className="text-base font-semibold text-gray-900">
                                  {selectedCurrency?.code}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {selectedCurrency?.name}
                                </div>
                              </div>
                            </div>
                            <ChevronDownIcon
                              className={`h-5 w-5 text-gray-400 transition-transform ${
                                isCurrencyDropdownOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Dropdown Menu - Fixed Position Portal */}
                {isCurrencyDropdownOpen && !isLoadingCurrencies && (
                  <div
                    className="fixed z-[60] bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fade-in max-h-60 overflow-y-auto"
                    style={{
                      ...(dropdownPosition.openUpward
                        ? { bottom: `${dropdownPosition.bottom + 8}px` }
                        : { top: `${dropdownPosition.top + 8}px` }),
                      left: `${dropdownPosition.left}px`,
                      width: `${dropdownPosition.width}px`,
                    }}
                  >
                    {currencies.length === 0 ? (
                      <div className="px-4 py-3.5 text-sm text-gray-500 text-center">
                        No currencies available
                      </div>
                    ) : (
                      currencies.map((curr) => (
                        <button
                          key={curr.code}
                          type="button"
                          onClick={() => handleCurrencySelect(curr.code)}
                          className={`w-full px-4 py-3.5 text-left transition-colors flex items-center justify-between hover:bg-gray-50 ${
                            currency === curr.code ? 'bg-primary-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{curr.flag_emoji}</span>
                            <div>
                              <div className={`text-base font-semibold ${
                                currency === curr.code
                                  ? 'text-primary-700'
                                  : 'text-gray-900'
                              }`}>
                                {curr.code}
                              </div>
                              <div className="text-sm text-gray-500">
                                {curr.name}
                              </div>
                            </div>
                          </div>
                          {currency === curr.code && (
                            <div className="bg-primary-500 rounded-full p-1">
                              <CheckIcon className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Footer - Sticky (only on details step) */}
          {step === 'details' && (
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !name.trim()}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold text-base hover:from-primary-600 hover:to-secondary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-98 disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Space'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default CreateSpaceModal;
