import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Film, 
  Heart, 
  Bookmark, 
  Clock, 
  Settings, 
  LogOut,
  TrendingUp,
  Tv,
  Star
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/home' },
    { name: 'Movies', icon: <Film size={20} />, path: '/movies' },
    { name: 'TV Shows', icon: <Tv size={20} />, path: '/tv-shows' },
    { name: 'Trending', icon: <TrendingUp size={20} />, path: '/trending' },
    { name: 'Favorites', icon: <Heart size={20} />, path: '/favorites' },
    { name: 'Watchlist', icon: <Bookmark size={20} />, path: '/watchlist' },
    { name: 'History', icon: <Clock size={20} />, path: '/history' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <Link to="/home" className="flex items-center">
            <span className="text-xl font-bold">Bolt</span>
            <span className="ml-1 text-purple-500 font-bold">Movies</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.name === 'Trending' && (
                    <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 px-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Star className="text-yellow-500 mr-2" size={18} />
                <h3 className="font-medium">Premium Plan</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Upgrade to Premium for ad-free viewing and exclusive content.
              </p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800">
          <ul className="space-y-1">
            <li>
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
              >
                <Settings size={20} className="mr-3" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <button
                className="w-full flex items-center px-4 py-2 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                onClick={() => {
                  // Handle logout
                  console.log('Logout clicked');
                }}
              >
                <LogOut size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;