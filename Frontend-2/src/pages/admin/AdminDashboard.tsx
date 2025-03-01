// src/pages/admin/AdminDashboard.tsx
import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Loader2, Film, Users } from 'lucide-react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('movies');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage movies and users</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeTab === 'movies' ? 'bg-purple-600' : 'bg-white/5'
            } text-white`}
          >
            <Film className="w-5 h-5" />
            <span>Movies</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeTab === 'users' ? 'bg-purple-600' : 'bg-white/5'
            } text-white`}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'movies' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Movie Management Form */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Add New Movie</h2>
              {/* Add movie form fields here */}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            {/* User Management */}
            <h2 className="text-xl font-semibold text-white mb-4">User Management</h2>
            {/* Add user management table here */}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminDashboard;