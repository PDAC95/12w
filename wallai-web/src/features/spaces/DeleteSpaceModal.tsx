/**
 * DeleteSpaceModal Component
 *
 * Modal for confirming space deletion
 * Only accessible by space owners
 */

import React, { useState } from 'react';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { spaceService } from '../../services/space.service';
import type { Space } from '../../types/Space.types';

interface DeleteSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space | null;
  onSuccess: () => void;
}

const DeleteSpaceModal: React.FC<DeleteSpaceModalProps> = ({
  isOpen,
  onClose,
  space,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen || !space) return null;

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== 'delete') {
      setError('Please type "delete" to confirm');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await spaceService.deleteSpace(space.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to delete space:', err);
      setError(err.message || 'Failed to delete space. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 animate-scale-in">
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>

          {/* Warning Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-red-100 rounded-full">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Delete Space?
            </h2>
            <p className="text-gray-600">
              This action cannot be undone
            </p>
          </div>

          {/* Space Info */}
          <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <TrashIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Space to delete:</p>
                <p className="text-base font-bold text-gray-900">{space.name}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• All budgets and expenses will be deleted</p>
              <p>• All members will lose access</p>
              <p>• This action is permanent</p>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-4">
            <label htmlFor="confirm-delete" className="block text-sm font-semibold text-gray-900 mb-2">
              Type <span className="font-mono text-red-600">delete</span> to confirm:
            </label>
            <input
              id="confirm-delete"
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError('');
              }}
              placeholder="delete"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all"
              disabled={isDeleting}
              autoComplete="off"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting || confirmText.toLowerCase() !== 'delete'}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isDeleting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Deleting...
                </span>
              ) : (
                'Delete Space'
              )}
            </button>
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

export default DeleteSpaceModal;
