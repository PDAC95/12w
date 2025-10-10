/**
 * JoinSpaceSuccessModal Component
 *
 * Success modal shown after joining a space
 */

import React from 'react';
import {
  XMarkIcon,
  CheckCircleIcon,
  UserGroupIcon,
  CubeIcon,
  FlagIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import type { Space, SpaceType } from '@/types/Space.types';

interface JoinSpaceSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space | null;
}

const JoinSpaceSuccessModal: React.FC<JoinSpaceSuccessModalProps> = ({
  isOpen,
  onClose,
  space,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !space) return null;

  const getSpaceIcon = (type: SpaceType) => {
    switch (type) {
      case 'personal':
        return CubeIcon;
      case 'shared':
        return UserGroupIcon;
      case 'project':
        return FlagIcon;
      default:
        return CubeIcon;
    }
  };

  const getSpaceColor = (type: SpaceType) => {
    switch (type) {
      case 'personal':
        return 'from-blue-500 to-indigo-600';
      case 'shared':
        return 'from-primary-500 to-secondary-500';
      case 'project':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleNavigateToSpace = () => {
    navigate('/dashboard');
    onClose();
  };

  const handleViewAllSpaces = () => {
    navigate('/spaces');
    onClose();
  };

  const SpaceIcon = getSpaceIcon(space.space_type);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 animate-scale-in">
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
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                <CheckCircleIcon className="h-16 w-16 text-green-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg">
                <SpaceIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to the Space!
            </h2>
            <p className="text-gray-600">
              You've successfully joined
            </p>
          </div>

          {/* Space Card */}
          <div className={`mb-6 p-5 rounded-2xl bg-gradient-to-br ${getSpaceColor(space.space_type)} bg-opacity-10 border-2 border-opacity-20`}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/80 rounded-xl">
                <SpaceIcon className="h-6 w-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {space.name}
                </h3>
                {space.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {space.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="capitalize">{space.space_type} Space</span>
                  <span>•</span>
                  <span>{space.member_count || 1} members</span>
                  <span>•</span>
                  <span className="font-medium text-gray-700">{space.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
            <p className="text-sm text-blue-800">
              <strong>What's next?</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-700">
              <li>• Explore the space dashboard</li>
              <li>• View shared budgets and expenses</li>
              <li>• Start collaborating with other members</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleNavigateToSpace}
              className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRightIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleViewAllSpaces}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              View All Spaces
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

export default JoinSpaceSuccessModal;
