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
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-6">You don't have permission to access the admin dashboard.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={() => navigate('/admin/movies/new')}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Movie</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="movies" className="flex items-center space-x-2">
            <Film className="h-4 w-4" />
            <span>Movies</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <AdminUsersTab />
        </TabsContent>
        
        <TabsContent value="movies" className="space-y-4">
          <AdminMoviesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;