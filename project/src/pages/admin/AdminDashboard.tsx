import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Users, TrendingUp, Activity, Plus } from 'lucide-react';
import { adminService, DashboardStats } from '../../services/adminService';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // For now, we'll use mock data
        // const response = await adminService.getDashboardStats();
        // setStats(response);
        
        // Mock data for development
        setStats({
          totalMovies: 156,
          totalUsers: 2843,
          activeSubscriptions: 1975,
          recentUsers: [
            { id: '1', name: 'John Doe', email: 'john@example.com', subscriptionPlan: 'premium', subscriptionStatus: 'active' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', subscriptionPlan: 'vip', subscriptionStatus: 'active' },
            { id: '3', name: 'Mike Johnson', email: 'mike@example.com', subscriptionPlan: 'basic', subscriptionStatus: 'active' },
          ],
          popularMovies: [
            { id: '1', title: 'Inception', thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0', genres: ['Sci-Fi'], duration: 148, rating: 8.8 },
            { id: '2', title: 'The Dark Knight', thumbnail: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3', genres: ['Action'], duration: 152, rating: 9.0 },
            { id: '3', title: 'Interstellar', thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401', genres: ['Sci-Fi'], duration: 169, rating: 8.6 },
          ],
          watchStats: {
            today: 1245,
            week: 8976,
            month: 34521
          }
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
        console.error('Dashboard data error:', err);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <Link 
          to="/admin/movies/add" 
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add New Movie</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Movies</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats?.totalMovies}</h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Film className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/movies" className="text-sm text-purple-400 hover:text-purple-300">
              View all movies →
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Users</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats?.totalUsers}</h3>
            </div>
            <div className="p-3 bg-indigo-500/20 rounded-full">
              <Users className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/users" className="text-sm text-indigo-400 hover:text-indigo-300">
              Manage users →
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Active Subscriptions</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats?.activeSubscriptions}</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-400">
              {Math.round((stats?.activeSubscriptions || 0) / (stats?.totalUsers || 1) * 100)}% of users
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Views Today</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats?.watchStats.today}</h3>
            </div>
            <div className="p-3 bg-cyan-500/20 rounded-full">
              <Activity className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-cyan-400">
              {stats?.watchStats.week.toLocaleString()} this week
            </span>
          </div>
        </div>
      </div>

      {/* Recent Users and Popular Movies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Plan</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentUsers.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 text-white">{user.name}</td>
                    <td className="py-3 text-gray-300">{user.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.subscriptionPlan === 'vip' 
                          ? 'bg-purple-500/20 text-purple-300' 
                          : user.subscriptionPlan === 'premium' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {user.subscriptionPlan.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link to="/admin/users" className="text-sm text-indigo-400 hover:text-indigo-300">
              View all users →
            </Link>
          </div>
        </div>

        {/* Popular Movies */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Popular Movies</h2>
          <div className="space-y-4">
            {stats?.popularMovies.map(movie => (
              <div key={movie.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5">
                <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md">
                  <img 
                    src={movie.thumbnail} 
                    alt={movie.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{movie.title}</h4>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400 text-sm mr-2">★ {movie.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">{movie.genres.join(', ')}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link 
                    to={`/admin/movies/edit/${movie.id}`}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link to="/admin/movies" className="text-sm text-indigo-400 hover:text-indigo-300">
              View all movies →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;