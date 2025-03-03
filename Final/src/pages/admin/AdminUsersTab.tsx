import React, { useEffect, useState } from 'react';
import { Check, X, Search } from 'lucide-react';
import { getAllUsers, approveUser, rejectUser } from '@/lib/api';
import { User as UserType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchQuery]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load users. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      setProcessingUser(userId);
      await approveUser(userId);

      setUsers(prevUsers =>
        prevUsers.map(user => (user._id === userId ? { ...user, isApproved: true } : user))
      );

      toast({
        title: 'User approved',
        description: 'User can now stream movies.',
      });
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve user. Please try again.',
      });
    } finally {
      setProcessingUser(null);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      setProcessingUser(userId);
      await rejectUser(userId);

      setUsers(prevUsers =>
        prevUsers.map(user => (user._id === userId ? { ...user, isApproved: false } : user))
      );

      toast({
        title: 'User rejected',
        description: "User's streaming access has been revoked.",
      });
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject user. Please try again.',
      });
    } finally {
      setProcessingUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12 w-full rounded-xl bg-black/20 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-black/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 bg-white/10 rounded w-1/2 ml-auto animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-black/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-600/20 text-purple-300'
                              : 'bg-gray-600/20 text-gray-300'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isApproved
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}
                        >
                          {user.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {user.role !== 'admin' && (
                          <div className="flex justify-end space-x-2">
                            {!user.isApproved ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-300 border-green-300 hover:text-green-200 hover:bg-green-500/10 rounded-xl transition-all duration-200"
                                onClick={() => handleApproveUser(user._id)}
                                disabled={processingUser === user._id}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-300 border-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                                onClick={() => handleRejectUser(user._id)}
                                disabled={processingUser === user._id}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Revoke
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersTab;