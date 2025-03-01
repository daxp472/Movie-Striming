import { useState, useEffect } from 'react';
import { User } from './interfaces/User';
import { userService } from './services/userService';
import { Button } from '@/components/Ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Ui/select';
import { useToast } from '@/components/Ui/use-toast';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, status: 'active' | 'suspended') => {
    try {
      await userService.updateUserStatus(userId, status);
      fetchUsers();
      toast({
        title: 'Success',
        description: 'User status updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const handleTierChange = async (userId: string, tier: 'free' | 'premium' | 'vip') => {
    try {
      await userService.updateUserTier(userId, tier);
      fetchUsers();
      toast({
        title: 'Success',
        description: 'User tier updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user tier',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.status}
                  onValueChange={(value: 'active' | 'suspended') => 
                    handleStatusChange(user._id, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue>{user.status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={user.tier}
                  onValueChange={(value: 'free' | 'premium' | 'vip') => 
                    handleTierChange(user._id, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue>{user.tier}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `/admin/users/${user._id}/activity`}
                >
                  View Activity
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}