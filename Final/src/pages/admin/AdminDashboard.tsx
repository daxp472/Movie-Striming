import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Film, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AdminUsersTab from './AdminUsersTab';
import AdminMoviesTab from './AdminMoviesTab';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center bg-black/30 p-8 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg max-w-md">
          <h2 className="text-3xl font-bold text-white drop-shadow-md mb-4">
            Access Denied
          </h2>
          <p className="text-gray-300 font-light mb-6">
            You don’t have permission to access the admin dashboard.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="rounded-xl bg-purple-600 text-white font-medium py-3 px-6 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md mb-6 md:mb-0">
            Admin Dashboard
          </h1>

          <Button
            onClick={() => navigate('/admin/movies/new')}
            className="flex items-center space-x-2 rounded-xl bg-purple-600 text-white font-medium py-3 px-6 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Movie</span>
          </Button>
        </div>

        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-black/50 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-6 bg-black/40 rounded-xl p-1">
              <TabsTrigger
                value="users"
                className="flex items-center space-x-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-purple-600/20 data-[state=active]:shadow-[0_0_8px_rgba(168,85,247,0.4)] rounded-lg px-4 py-2 transition-all duration-300"
              >
                <Users className="h-5 w-5" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="movies"
                className="flex items-center space-x-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-purple-600/20 data-[state=active]:shadow-[0_0_8px_rgba(168,85,247,0.4)] rounded-lg px-4 py-2 transition-all duration-300"
              >
                <Film className="h-5 w-5" />
                <span>Movies</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <AdminUsersTab />
            </TabsContent>

            <TabsContent value="movies" className="space-y-6">
              <AdminMoviesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;