import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../navigation/Navbar';
import Sidebar from '../navigation/Sidebar';

const UserLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="relative">
            {/* Gradient background with blur effect */}
            <div className="fixed inset-0 z-0">
              <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-purple-700/30 blur-[100px]"></div>
              <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-indigo-700/30 blur-[100px]"></div>
              <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-fuchsia-700/20 blur-[100px]"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-4 md:p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;