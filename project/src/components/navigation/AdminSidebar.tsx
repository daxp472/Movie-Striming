import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  PlusCircle, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  CreditCard, 
  AlertTriangle 
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const mainNavItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/movies', icon: <Film size={20} />, label: 'Movies' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
  ];

  const managementNavItems = [
    { path: '/admin/movies/add', icon: <PlusCircle size={20} />, label: 'Add Movie' },
    { path: '/admin/subscriptions', icon: <CreditCard size={20} />, label: 'Subscriptions' },
    { path: '/admin/complaints', icon: <MessageSquare size={20} />, label: 'User Complaints' },
    { path: '/admin/reports', icon: <AlertTriangle size={20} />, label: 'Reports' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];

  return (
    <div 
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:static bg-black/40 backdrop-blur-md border-r border-white/10`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center">
            <span className="text-xl font-bold text-white">Bolt</span>
            <span className="ml-1 text-purple-500 font-bold">Admin</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 py-6 space-y-1 px-3">
          <div className="px-3 mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main
            </h3>
          </div>
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                isActive(item.path)
                  ? 'text-white bg-gradient-to-r from-purple-600/50 to-transparent border-l-2 border-purple-500'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="px-3 mt-6 mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Management
            </h3>
          </div>
          {managementNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                isActive(item.path)
                  ? 'text-white bg-gradient-to-r from-purple-600/50 to-transparent border-l-2 border-purple-500'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* System Status */}
        <div className="p-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-800/40 to-indigo-800/40 border border-white/10 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-white">System Status</h3>
            <div className="mt-2 flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="ml-2 text-xs text-gray-300">All systems operational</span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-gray-400">Server Load</div>
              <div className="mt-1 h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;