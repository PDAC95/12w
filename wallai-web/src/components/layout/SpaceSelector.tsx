import React from 'react';
import { ChevronDownIcon, CubeIcon } from '@heroicons/react/24/outline';

const SpaceSelector: React.FC = () => {
  // TODO: In future sprints, fetch user's spaces and implement dropdown
  // For now, show placeholder for personal space

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-wallai-green"
        disabled
        title="Space selector (coming soon)"
      >
        <CubeIcon className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Personal Space</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </button>

      {/* Tooltip for placeholder */}
      <div className="absolute top-full mt-2 left-0 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        Space switching coming in Sprint 2
      </div>
    </div>
  );
};

export default SpaceSelector;
