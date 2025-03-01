import { FiUsers, FiFilm, FiEye, FiStar } from 'react-icons/fi';
import StatsCard from '../../components/admin/StatsCard';
import RecentActivities from '../../components/admin/RecentActivities';
import PopularMovies from '../../components/admin/PopularMovies';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: FiUsers, change: '+12%' },
    { title: 'Total Movies', value: '567', icon: FiFilm, change: '+7%' },
    { title: 'Total Views', value: '45.2K', icon: FiEye, change: '+22%' },
    { title: 'Avg Rating', value: '4.8', icon: FiStar, change: '+3%' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivities />
        <PopularMovies />
      </div>
    </div>
  );
};

export default AdminDashboard;
