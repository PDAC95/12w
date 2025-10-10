/**
 * ViewInviteCodeModal Component
 *
 * Modal for viewing and copying space invite codes
 * Only accessible by space owners
 */

import React, { useState } from 'react';
import {
  XMarkIcon,
  KeyIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { Space } from '../../types/Space.types';

interface ViewInviteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space | null;
}

const ViewInviteCodeModal: React.FC<ViewInviteCodeModalProps> = ({
  isOpen,
  onClose,
  space,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !space) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(space.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 animate-scale-in">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>

          {/* Header Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full">
              <KeyIcon className="h-12 w-12 text-primary-600" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Space Invite Code
            </h2>
            <p className="text-gray-600">
              Share this code to invite members to
            </p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {space.name}
            </p>
          </div>

          {/* Invite Code Display */}
          <div className="mb-6">
            <div className="relative p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-2xl">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 uppercase mb-2">
                  Invitation Code
                </p>
                <p className="text-4xl font-mono font-bold text-gray-900 tracking-[0.3em] mb-4">
                  {space.invite_code}
                </p>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-primary-400 text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-5 w-5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="h-5 w-5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50/70 backdrop-blur-sm border border-blue-200 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <UserGroupIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  How to share:
                </p>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Share this 6-character code with others</li>
                  <li>• They can enter it in the "Join Space" option</li>
                  <li>• Maximum 10 members per space</li>
                  <li>• The code never expires</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Space Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Current members:</span>
              <span className="font-semibold text-gray-900">
                {space.member_count || 1} / 10
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Type:</span>
              <span className="capitalize font-semibold text-gray-900">
                {space.space_type}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Close
          </button>
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

export default ViewInviteCodeModal;
