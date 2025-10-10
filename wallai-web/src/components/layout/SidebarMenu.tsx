import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EllipsisVerticalIcon,
  CubeIcon,
  PlusCircleIcon,
  UserGroupIcon,
  QueueListIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  KeyIcon,
  FlagIcon,
  CheckIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import CreateSpaceModal from '@/features/spaces/CreateSpaceModal';
import SpaceCreatedModal from '@/features/spaces/SpaceCreatedModal';
import JoinSpaceModal from '@/features/spaces/JoinSpaceModal';
import JoinSpaceSuccessModal from '@/features/spaces/JoinSpaceSuccessModal';
import { spaceService } from '@/services/space.service';
import { useSpaceStore } from '@/stores/spaceStore';
import type { Space } from '@/types/Space.types';

const SidebarMenu: React.FC = () => {
  const navigate = useNavigate();
  const { activeSpace, recentSpaces, setActiveSpace } = useSpaceStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdSpaceName, setCreatedSpaceName] = useState('');
  const [createdInviteCode, setCreatedInviteCode] = useState('');
  const [allSpaces, setAllSpaces] = useState<Space[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isJoinSuccessModalOpen, setIsJoinSuccessModalOpen] = useState(false);
  const [joinedSpace, setJoinedSpace] = useState<Space | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load spaces on mount
  useEffect(() => {
    loadSpaces();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadSpaces = async () => {
    setIsLoadingSpaces(true);
    try {
      const spaces = await spaceService.listSpaces();
      setAllSpaces(spaces);

      // Set first space as active if none is set
      if (!activeSpace && spaces.length > 0) {
        setActiveSpace(spaces[0]);
      }
    } catch (error) {
      console.error('Failed to load spaces:', error);
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleCreateSpace = () => {
    setIsCreateModalOpen(true);
    closeDropdown();
  };

  const handleCreateSuccess = (spaceId: string, inviteCode: string, spaceName: string) => {
    setCreatedSpaceName(spaceName);
    setCreatedInviteCode(inviteCode);
    setIsSuccessModalOpen(true);
    loadSpaces(); // Reload spaces list
  };

  const handleJoinSuccess = (space: Space) => {
    setJoinedSpace(space);
    setIsJoinSuccessModalOpen(true);
    loadSpaces(); // Reload spaces list
  };

  const handleSpaceSwitch = (space: Space) => {
    setActiveSpace(space);
    closeDropdown();
    // Optional: refresh page or trigger data reload for new space
    // window.location.reload(); // or navigate to dashboard
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

  // Get top 3 spaces for quick switch (excluding active)
  // Prioritize recent spaces, then fill with all available spaces
  const quickSwitchSpaces = React.useMemo(() => {
    const otherSpaces = allSpaces.filter((space) => space.id !== activeSpace?.id);

    // Start with recent spaces (excluding active)
    const recentOthers = recentSpaces.filter((space) => space.id !== activeSpace?.id);

    // Add remaining spaces that aren't in recent
    const remaining = otherSpaces.filter(
      (space) => !recentOthers.find((r) => r.id === space.id)
    );

    // Combine and limit to 3
    return [...recentOthers, ...remaining].slice(0, 3);
  }, [allSpaces, recentSpaces, activeSpace]);

  const handleJoinSpace = () => {
    setIsJoinModalOpen(true);
    closeDropdown();
  };

  const handleViewAllSpaces = () => {
    navigate('/spaces');
    closeDropdown();
  };

  const handleSpaceAnalytics = () => {
    // TODO: Navigate to space analytics
    console.log('Space analytics');
    closeDropdown();
  };

  const handleSpaceSettings = () => {
    // TODO: Navigate to space settings
    console.log('Space settings');
    closeDropdown();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - 3 vertical dots */}
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-wallai-green"
        aria-label="Open menu"
      >
        <EllipsisVerticalIcon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
          {/* Current Active Space */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="px-1 text-xs font-medium text-gray-500 uppercase mb-2">
              Current Space
            </p>
            {isLoadingSpaces ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
              </div>
            ) : activeSpace ? (
              <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border border-primary-100">
                <div className="flex items-center space-x-3">
                  {React.createElement(getSpaceIcon(activeSpace.space_type), {
                    className: 'h-5 w-5 text-primary-500',
                  })}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{activeSpace.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{activeSpace.space_type}</p>
                  </div>
                </div>
                <CheckIcon className="h-4 w-4 text-primary-500" />
              </div>
            ) : (
              <div className="text-center py-3 text-sm text-gray-500">
                No space selected
              </div>
            )}

            {/* Quick Switch - Recent Spaces */}
            {quickSwitchSpaces.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="px-1 text-xs font-medium text-gray-500 mb-2">
                  Switch to
                </p>
                {quickSwitchSpaces.map((space) => (
                  <button
                    key={space.id}
                    onClick={() => handleSpaceSwitch(space)}
                    className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      {React.createElement(getSpaceIcon(space.space_type), {
                        className: 'h-4 w-4 text-gray-500 group-hover:text-primary-500',
                      })}
                      <div className="text-left">
                        <p className="text-sm font-medium">{space.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{space.space_type}</p>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-500" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Space Management Actions */}
          <div className="py-2">
            <p className="px-4 text-xs font-medium text-gray-500 uppercase mb-2">
              Space Management
            </p>

            {/* Create New Space */}
            <button
              onClick={handleCreateSpace}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all mx-2"
            >
              <PlusCircleIcon className="h-5 w-5 text-primary-500" />
              <div className="text-left">
                <p className="text-sm font-medium">Create Space</p>
                <p className="text-xs text-gray-500">Start a new workspace</p>
              </div>
            </button>

            {/* Join Space with Code */}
            <button
              onClick={handleJoinSpace}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all mx-2"
            >
              <KeyIcon className="h-5 w-5 text-secondary-500" />
              <div className="text-left">
                <p className="text-sm font-medium">Join Space</p>
                <p className="text-xs text-gray-500">Enter invitation code</p>
              </div>
            </button>

            {/* View All Spaces */}
            <button
              onClick={handleViewAllSpaces}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all mx-2"
            >
              <QueueListIcon className="h-5 w-5 text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium">View All Spaces</p>
                <p className="text-xs text-gray-500">Manage your workspaces</p>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2" />

          {/* Analytics & Settings */}
          <div className="py-2">
            <p className="px-4 text-xs font-medium text-gray-500 uppercase mb-2">
              Tools
            </p>

            {/* Space Analytics */}
            <button
              onClick={handleSpaceAnalytics}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mx-2"
            >
              <ChartBarSquareIcon className="h-5 w-5 text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium">Space Analytics</p>
                <p className="text-xs text-gray-500">View insights & reports</p>
              </div>
            </button>

            {/* Space Settings */}
            <button
              onClick={handleSpaceSettings}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mx-2"
            >
              <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium">Space Settings</p>
                <p className="text-xs text-gray-500">Configure workspace</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Create Space Modal */}
      <CreateSpaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Success Modal */}
      <SpaceCreatedModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        spaceName={createdSpaceName}
        inviteCode={createdInviteCode}
      />

      {/* Join Space Modal */}
      <JoinSpaceModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinSuccess}
      />

      {/* Join Success Modal */}
      <JoinSpaceSuccessModal
        isOpen={isJoinSuccessModalOpen}
        onClose={() => {
          setIsJoinSuccessModalOpen(false);
          setJoinedSpace(null);
        }}
        space={joinedSpace}
      />
    </div>
  );
};

export default SidebarMenu;
