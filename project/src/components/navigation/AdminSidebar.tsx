import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Film, Users, PlusCircle, Settings } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/movies', icon: <Film size={20} />, label: 'Movies' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/movies/add', icon: <PlusCircle size={20} />, label: 'Add Movie' }
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
            <h3 className="text-sm font-medium text-white">System Status</h3>
            <div className="mt-2 flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="ml-2 text-xs text-gray-300">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;