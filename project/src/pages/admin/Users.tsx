import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  AlertCircle
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  subscriptionTier: 'basic' | 'premium' | 'vip' | 'none';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin: string;
  watchCount: number;
}

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const itemsPerPage = 10;

  const { data: users, loading, error, refetch } = useApi<User[]>(() => 
    adminService.getUsers({ 
      page: currentPage, 
      limit: itemsPerPage, 
      search: searchTerm, 
      status: selectedStatus,
      subscriptionTier: selectedSubscription
    })
  );

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [currentPage, searchTerm, selectedStatus, selectedSubscription, refetch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const handleSuspendUser = async (id: string) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        await adminService.updateUserStatus(id, 'suspended');
        refetch();
      } catch (err) {
        console.error('Failed to suspend user:', err);
      }
    }
  };

  const handleActivateUser = async (id: string) => {
    try {
      await adminService.updateUserStatus(id, 'active');
      refetch();
    } catch (err) {
      console.error('Failed to activate user:', err);
    }
  };

  const statuses = ['active', 'suspended', 'pending'];
  const subscriptionTiers = ['basic', 'premium', 'vip', 'none'];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => refetch()}
          className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 bg-black/40 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={selectedSubscription}
                onChange={(e) => setSelectedSubscription(e.target.value)}
                className="pl-10 pr-8 py-2 bg-black/40 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Subscriptions</option>
                {subscriptionTiers.map(tier => (
                  <option key={tier} value={tier}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading users. Please try again.</p>
          </div>
        ) : users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-black/60">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Watch Count
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-800">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-purple-600">
                              <UserIcon size={20} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.subscriptionTier === 'vip' ? 'bg-purple-100 text-purple-800' : 
                          user.subscriptionTier === 'premium' ? 'bg-blue-100 text-blue-800' : 
                          user.subscriptionTier === 'basic' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                          user.status === 'suspended' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.watchCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/admin/users/${user.id}`} 
                          className="text-indigo-400 hover:text-indigo-300"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          to={`/admin/users/edit/${user.id}`} 
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => window.open(`mailto:${user.email}`)} 
                          className="text-green-400 hover:text-green-300"
                          title="Email"
                        >
                          <Mail size={18} />
                        </button>
                        {user.status === 'active' ? (
                          <button 
                            onClick={() => handleSuspendUser(user.id)} 
                            className="text-yellow-400 hover:text-yellow-300"
                            title="Suspend"
                          >
                            <AlertCircle size={18} />
                          </button>
                        ) : user.status === 'suspended' ? (
                          <button 
                            onClick={() => handleActivateUser(user.id)} 
                            className="text-green-400 hover:text-green-300"
                            title="Activate"
                          >
                            <UserIcon size={18} />
                          </button>
                        ) : null}
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <UserIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>No users found. Adjust your search filters and try again.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {users && users.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, users.length)}</span> of{' '}
            <span className="font-medium">{users.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-black/40 text-white hover:bg-white/10'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={users.length < itemsPerPage}
              className={`p-2 rounded-md ${
                users.length < itemsPerPage
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-black/40 text-white hover:bg-white/10'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
