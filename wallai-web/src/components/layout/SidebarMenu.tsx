import React, { useState, useRef, useEffect } from 'react';
import {
  EllipsisVerticalIcon,
  CubeIcon,
  PlusCircleIcon,
  UserGroupIcon,
  QueueListIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

const SidebarMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleCreateSpace = () => {
    // TODO: Implement create space modal
    console.log('Create new space');
    closeDropdown();
  };

  const handleJoinSpace = () => {
    // TODO: Implement join space modal
    console.log('Join space with code');
    closeDropdown();
  };

  const handleViewAllSpaces = () => {
    // TODO: Navigate to spaces list
    console.log('View all spaces');
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
          {/* Current Space Selector */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3 px-3 py-2.5 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border border-primary-100">
              <CubeIcon className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-semibold text-gray-900">Personal Space</span>
            </div>
            {/* TODO: When multiple spaces are implemented, clicking will show a list of spaces here */}
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
    </div>
  );
};

export default SidebarMenu;
