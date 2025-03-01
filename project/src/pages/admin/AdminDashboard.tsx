import React, { useEffect, useState } from 'react';
import { Users, Film, Eye, Star, TrendingUp, BarChart3 } from 'lucide-react';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
          }
        });
        setStats(response.data.stats);
        setTopMovies(response.data.topMovies);
        setRecentUsers(response.data.recentUsers);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of your movie streaming platform</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-xl"
              style={{ background: `linear-gradient(${stat.color.split(' ')[0].replace('from-', '')}, ${stat.color.split(' ')[1].replace('to-', '')})` }}
            ></div>
            
            <div className="flex items-center">
              <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br ${stat.color} p-2`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-lg font-semibold text-white">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-green-400">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Movies */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Top Movies</h2>
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
          <ul>
            {topMovies.map((movie, index) => (
              <li key={index} className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-white">{movie.title}</span>
                <span className="text-gray-400">{movie.views} views</span>
                <span className="text-yellow-400">{movie.rating} rating</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Users</h2>
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
          <ul>
            {recentUsers.map((user, index) => (
              <li key={index} className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-white">{user.name}</span>
                <span className="text-gray-400">{user.email}</span>
                <span className={`text-${user.status === 'active' ? 'green' : 'red'}-400`}>{user.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;