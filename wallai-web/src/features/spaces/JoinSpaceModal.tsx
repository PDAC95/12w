/**
 * JoinSpaceModal Component
 *
 * Modal for joining spaces with invite code
 * Mobile-first design with glassmorphism effects
 */

import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { spaceService } from '@/services/space.service';
import { useSpaceStore } from '@/stores/spaceStore';
import type { Space } from '@/types/Space.types';

interface JoinSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (space: Space) => void;
}

const JoinSpaceModal: React.FC<JoinSpaceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const { setActiveSpace } = useSpaceStore();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setInviteCode('');
        setError('');
        setValidationError('');
      }, 300);
    }
  }, [isOpen]);

  // Validate code format in real-time
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setInviteCode(value.slice(0, 6));
    setValidationError('');
    setError('');

    if (value && value.length < 6) {
      setValidationError('Code must be 6 characters');
    } else if (value && !/^[A-Z0-9]{6}$/.test(value)) {
      setValidationError('Only letters and numbers allowed');
    } else {
      setValidationError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteCode || inviteCode.length !== 6) {
      setValidationError('Please enter a 6-character code');
      return;
    }

    if (!/^[A-Z0-9]{6}$/.test(inviteCode)) {
      setValidationError('Invalid code format');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await spaceService.joinSpace(inviteCode);
      const joinedSpace = response.data.space;

      // Add to store and set as active
      setActiveSpace(joinedSpace);

      // Call success callback
      onSuccess(joinedSpace);
      onClose();
    } catch (err: any) {
      console.error('Failed to join space:', err);

      // Handle specific error cases
      if (err.message === 'Invalid invite code') {
        setError('This invite code doesn\'t exist. Please check and try again.');
      } else if (err.message.includes('already a member')) {
        setError('You\'re already a member of this space!');
      } else if (err.message.includes('limit')) {
        setError('This space has reached its member limit.');
      } else {
        setError(err.message || 'Failed to join space. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with glassmorphism */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal - centered with slight offset upward */}
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ marginTop: '-15px' }}>
        <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl transform transition-all animate-scale-in">
          {/* Glass morphism border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 opacity-50" />

          <div className="relative">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl">
                    <KeyIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Join Space</h2>
                    <p className="text-sm text-gray-600">Enter your invitation code</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="px-6 pb-6">
              {/* Code Input */}
              <div className="mb-4">
                <label htmlFor="invite-code" className="block text-sm font-semibold text-gray-900 mb-2">
                  Invitation Code
                </label>
                <div className="relative">
                  <input
                    id="invite-code"
                    type="text"
                    value={inviteCode}
                    onChange={handleCodeChange}
                    placeholder="ABCD12"
                    maxLength={6}
                    className={`w-full px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] uppercase border-2 rounded-xl transition-all outline-none ${
                      validationError
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                        : 'border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-primary-400'
                    }`}
                    autoComplete="off"
                    autoFocus
                  />

                  {/* Character counter */}
                  <div className="absolute bottom-1 right-3 text-xs text-gray-500">
                    {inviteCode.length}/6
                  </div>
                </div>

                {/* Validation Error */}
                {validationError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-4 w-4" />
                    {validationError}
                  </p>
                )}
              </div>

              {/* Info box */}
              <div className="mb-6 p-4 bg-blue-50/70 backdrop-blur-sm border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>How to get an invite code:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li>• Ask the space owner for the 6-character code</li>
                  <li>• The code is case-insensitive</li>
                  <li>• Each space can have up to 10 members</li>
                </ul>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !inviteCode || inviteCode.length !== 6 || !!validationError}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold text-base hover:from-primary-600 hover:to-secondary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </span>
                ) : (
                  'Join Space'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
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

        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default JoinSpaceModal;
