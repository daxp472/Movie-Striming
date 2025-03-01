import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Menu, X } from 'lucide-react';

const AdminNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            <Link to="/admin" className="flex items-center">
              <span className="text-xl font-bold text-white ml-2 md:ml-0">MovieFlix Admin</span>
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden md:block">{user?.name}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/80 backdrop-blur-md border border-white/10 ring-1 ring-black ring-opacity-5 py-1">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    View Site
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
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/movies"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/admin/users"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Users
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;