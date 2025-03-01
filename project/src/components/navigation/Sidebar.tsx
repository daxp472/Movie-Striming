import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, Clock, Settings, Film } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/watchlist', icon: <Bookmark size={20} />, label: 'Watchlist' },
    { path: '/history', icon: <Clock size={20} />, label: 'History' },
    { path: '/preferences', icon: <Settings size={20} />, label: 'Preferences' }
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-black/40 backdrop-blur-md border-r border-white/10">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex-1 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium rounded-r-full ${
                isActive(item.path)
                  ? 'text-white bg-gradient-to-r from-purple-600/50 to-transparent border-l-4 border-purple-500'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="p-6">
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-800/40 to-indigo-800/40 border border-white/10 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-white">Upgrade to Premium</h3>
            <p className="mt-1 text-xs text-gray-300">Get access to exclusive content and features</p>
            <button className="mt-3 w-full px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;