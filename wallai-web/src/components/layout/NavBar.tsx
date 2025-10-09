import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  ReceiptPercentIcon as ReceiptPercentIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
} from '@heroicons/react/24/solid';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  isMain?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: 'Budgets', path: '/budgets', icon: BanknotesIcon, iconSolid: BanknotesIconSolid },
  { name: 'Chat', path: '/chat', icon: ChatBubbleLeftRightIcon, iconSolid: ChatBubbleLeftRightIconSolid, isMain: true },
  { name: 'Expenses', path: '/expenses', icon: ReceiptPercentIcon, iconSolid: ReceiptPercentIconSolid },
  { name: 'Reports', path: '/reports', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
];

const NavBar: React.FC = () => {
  return (
    <>
      {/* Desktop Sidebar - Left Side - Floating Glassmorphism */}
      <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 z-40">
        <div className="w-full p-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 space-y-1 shadow-2xl border border-primary-200/50">
            {/* Regular navigation items */}
            {navItems.filter(item => !item.isMain).map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <item.iconSolid className="h-5 w-5 text-primary-500" />
                    ) : (
                      <item.icon className="h-5 w-5 text-gray-500" />
                    )}
                    <span className="text-sm font-medium">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}

            {/* Chat button at the end */}
            {navItems.filter(item => item.isMain).map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-center px-16 py-3 rounded-xl bg-gradient-to-r from-primary-400 to-primary-600 text-white font-semibold shadow-lg transition-all ${
                    isActive ? 'scale-105' : 'hover:scale-105'
                  }`
                }
              >
                {({ isActive }) => (
                  <item.iconSolid className="h-6 w-6" />
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Floating Glassmorphism */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 z-50 pointer-events-none">
        <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl rounded-full p-1.5 flex items-center justify-between shadow-2xl border border-primary-200/50 pointer-events-auto">
          {navItems.map((item) => {
            if (item.isMain) {
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="flex items-center justify-center px-16 py-3 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 text-white font-semibold shadow-lg transform scale-110 transition-all hover:scale-115"
                >
                  {({ isActive }) => (
                    <item.iconSolid className="h-6 w-6" />
                  )}
                </NavLink>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center p-2 rounded-full transition-all ${
                    isActive ? 'bg-primary-50' : 'hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <item.iconSolid className="h-6 w-6 text-primary-500" />
                    ) : (
                      <item.icon className="h-6 w-6 text-gray-500" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
