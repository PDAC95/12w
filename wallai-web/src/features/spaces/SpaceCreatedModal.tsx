/**
 * SpaceCreatedModal Component
 *
 * Success modal shown after creating a space, displays invite code
 */

import React from 'react';
import {
  XMarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import InviteCodeDisplay from './InviteCodeDisplay';

interface SpaceCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceName: string;
  inviteCode: string;
}

const SpaceCreatedModal: React.FC<SpaceCreatedModalProps> = ({
  isOpen,
  onClose,
  spaceName,
  inviteCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircleIcon className="h-16 w-16 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Space Created Successfully!
            </h2>
            <p className="text-gray-600">
              <span className="font-semibold">{spaceName}</span> is ready to use
            </p>
          </div>

          {/* Invite Code Display */}
          <div className="mb-6">
            <InviteCodeDisplay code={inviteCode} />
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-700">
              <li>• Share the invite code with people you want to add</li>
              <li>• Set up your budget and categories</li>
              <li>• Start tracking expenses together</li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceCreatedModal;
