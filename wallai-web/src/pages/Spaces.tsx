/**
 * Spaces Page
 *
 * Page to display and manage all user spaces
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CubeIcon,
  UserGroupIcon,
  FlagIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { spaceService } from '@/services/space.service';
import { useSpaceStore } from '@/stores/spaceStore';
import type { Space } from '@/types/Space.types';
import CreateSpaceModal from '@/features/spaces/CreateSpaceModal';
import SpaceCreatedModal from '@/features/spaces/SpaceCreatedModal';

const Spaces: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveSpace } = useSpaceStore();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdSpaceName, setCreatedSpaceName] = useState('');
  const [createdInviteCode, setCreatedInviteCode] = useState('');

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await spaceService.getUserSpaces();
      setSpaces(response.data.spaces);
    } catch (err: any) {
      console.error('Failed to load spaces:', err);
      setError('Failed to load spaces');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = (spaceId: string, inviteCode: string, spaceName: string) => {
    setCreatedSpaceName(spaceName);
    setCreatedInviteCode(inviteCode);
    setIsSuccessModalOpen(true);
    loadSpaces(); // Reload spaces
  };

  const handleSpaceClick = (space: Space) => {
    // Set as active space and navigate to dashboard
    setActiveSpace(space);
    navigate('/dashboard');
  };

  const getSpaceIcon = (spaceType: string) => {
    switch (spaceType) {
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

  const getSpaceColor = (spaceType: string) => {
    switch (spaceType) {
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

  const getSpaceTypeLabel = (spaceType: string) => {
    switch (spaceType) {
      case 'personal':
        return 'Personal';
      case 'shared':
        return 'Shared';
      case 'project':
        return 'Project';
      default:
        return spaceType;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading spaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Spaces</h1>
              <p className="text-gray-600 mt-1">Manage your financial spaces</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span className="hidden md:inline">Create Space</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {spaces.length === 0 ? (
          <div className="text-center py-12">
            <CubeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No spaces yet</h3>
            <p className="text-gray-600 mb-6">Create your first space to start managing your finances</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Create Your First Space
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {spaces.map((space) => {
              const SpaceIcon = getSpaceIcon(space.space_type);
              return (
                <div
                  key={space.id}
                  onClick={() => handleSpaceClick(space)}
                  className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-br ${getSpaceColor(space.space_type)} bg-opacity-10`}>
                      <SpaceIcon className="h-5 w-5 text-gray-700" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-gray-900 truncate">{space.name}</h3>
                        <span className="flex-shrink-0 px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600 capitalize">
                          {getSpaceTypeLabel(space.space_type)}
                        </span>
                      </div>

                      {/* Info row */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3.5 w-3.5" />
                          <span>{space.member_count || 1} member{(space.member_count || 1) !== 1 ? 's' : ''}</span>
                        </div>
                        <span className="font-semibold">{space.currency}</span>
                        {space.description && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="truncate">{space.description}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <ArrowRightIcon className="h-5 w-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateSpaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <SpaceCreatedModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        spaceName={createdSpaceName}
        inviteCode={createdInviteCode}
      />
    </div>
  );
};

export default Spaces;
