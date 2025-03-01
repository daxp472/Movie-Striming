import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiFilm, FiUsers, FiBarChart2, FiSettings } from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/movies', icon: FiFilm, label: 'Movies' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-100 ${
                isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="mx-3">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
