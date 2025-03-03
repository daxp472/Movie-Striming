import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Menu, Bell, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AdminNavbarProps {
  toggleSidebar: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and logo */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white mr-4"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/admin" className="flex items-center">
              <span className="text-xl font-bold text-white">MovieFlix Admin</span>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for movies, users..."
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-full text-gray-300 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-300 hover:text-white"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-300 hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-black"></span>
            </button>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden md:block">{user?.name || 'Admin'}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/80 backdrop-blur-md border border-white/10 ring-1 ring-black ring-opacity-5 py-1">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Switch to User View
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile search field */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-white/10">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for movies, users..."
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;