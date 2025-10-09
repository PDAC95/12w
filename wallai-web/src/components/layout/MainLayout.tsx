import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar Navigation (Desktop) / Bottom Navigation (Mobile) */}
        <NavBar />

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
