import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
                onClick={toggleSidebar}
                className="text-gray-300 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <Link to="/home" className="flex items-center">
              <span className="text-xl font-bold text-white ml-2 md:ml-0">Bolt</span>
              <span className="text-xl font-bold text-purple-500">Movies</span>
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
                placeholder="Search for movies..."
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Mobile search button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full text-gray-300 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-300 hover:text-white">
              <Bell className="h-6 w-6" />
            </button>
            
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
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
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
      </div>

      {/* Mobile search bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for movies..."
              className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/home"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/tv-shows"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              TV Shows
            </Link>
            <Link
              to="/watchlist"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Watchlist
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;