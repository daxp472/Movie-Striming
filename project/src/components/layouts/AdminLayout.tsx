import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from '../navigation/AdminNavbar';
import AdminSidebar from '../navigation/AdminSidebar';

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-black to-gray-900">
          <div className="relative">
            {/* Gradient background with blur effect */}
            <div className="fixed inset-0 z-0">
              <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-[100px]"></div>
              <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-indigo-700/20 blur-[100px]"></div>
              <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-blue-700/10 blur-[100px]"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;