import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CreditCardIcon,
  UserCircleIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Get user initial (first letter of username)
  const getUserInitial = () => {
    if (!user) {
      console.log('UserDropdown: No user data available');
      return 'U';
    }

    console.log('UserDropdown user:', user);
    // Extract username from metadata or email
    const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'U';
    // Return only the first letter in uppercase
    return username[0].toUpperCase();
  };

  // Always render the component, even if user is not loaded yet
  console.log('UserDropdown rendering, user:', user?.email);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-primary-400 text-white font-bold text-lg hover:bg-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-md"
        aria-label="User menu"
        title={user?.email || 'User menu'}
      >
        {getUserInitial()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary-400 text-white font-bold flex items-center justify-center text-xl">
                {getUserInitial()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items - Account Section */}
          <div className="py-1">
            <button
              onClick={() => {
                navigate('/account');
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <UserCircleIcon className="h-5 w-5 text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">My Account</p>
                <p className="text-xs text-gray-500">Profile and preferences</p>
              </div>
            </button>

            <button
              onClick={() => {
                navigate('/settings');
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Settings</p>
                <p className="text-xs text-gray-500">App configuration</p>
              </div>
            </button>

            <button
              onClick={() => {
                navigate('/billing');
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CreditCardIcon className="h-5 w-5 text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Billing</p>
                <p className="text-xs text-gray-500">Plans and payments</p>
              </div>
            </button>

            {/* My Activity */}
            <button
              onClick={() => {
                navigate('/activity');
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ClockIcon className="h-5 w-5 text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">My Activity</p>
                <p className="text-xs text-gray-500">Recent actions</p>
              </div>
            </button>
          </div>

          <div className="border-t border-gray-200 my-1" />

          {/* Help & Support Section */}
          <div className="py-1">
            <button
              onClick={() => {
                navigate('/help');
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Help & Support</p>
                <p className="text-xs text-gray-500">Get assistance</p>
              </div>
            </button>
          </div>

          <div className="border-t border-gray-200 my-1" />

          {/* Preferences Section */}
          <div className="py-1">
            {/* Language Selector */}
            <button
              onClick={() => {
                // TODO: Implement language selector
                console.log('Language selector clicked');
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LanguageIcon className="h-5 w-5 text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Language</p>
                <p className="text-xs text-gray-500">English (US)</p>
              </div>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                // TODO: Implement dark mode functionality
                console.log('Dark mode toggled:', !isDarkMode);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-500" />
                )}
                <div className="text-left">
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-gray-500">{isDarkMode ? 'On' : 'Off'}</p>
                </div>
              </div>
              {/* Toggle Switch */}
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-primary-500' : 'bg-gray-300'}`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </div>
            </button>
          </div>

          <div className="border-t border-gray-200 my-1" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
