import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import SidebarMenu from './SidebarMenu';
import UserDropdown from './UserDropdown';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          {/* Left: Sidebar Menu (3 dots) */}
          <div className="flex items-center z-10">
            <SidebarMenu />
          </div>

          {/* Center: Logo (clickable to dashboard) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Link
              to="/dashboard"
              className="flex items-center hover:opacity-80 transition-opacity pointer-events-auto"
            >
              <Logo variant="horizontal" size={48} />
            </Link>
          </div>

          {/* Right: User Avatar Dropdown */}
          <div className="flex items-center z-10 ml-auto">
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
