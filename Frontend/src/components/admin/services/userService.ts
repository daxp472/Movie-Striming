import { User, UserActivity, UserComplaint } from '../interfaces/User';

const API_URL = 'http://localhost:3000/api/admin';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended'): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${userId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update user status');
    return response.json();
  },

  updateUserTier: async (userId: string, tier: 'free' | 'premium' | 'vip'): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${userId}/tier`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier })
    });
    if (!response.ok) throw new Error('Failed to update user tier');
    return response.json();
  },

  getUserActivity: async (userId: string): Promise<UserActivity[]> => {
    const response = await fetch(`${API_URL}/users/${userId}/activity`);
    if (!response.ok) throw new Error('Failed to fetch user activity');
    return response.json();
  },

  handleComplaint: async (userId: string, complaint: Omit<UserComplaint, 'userId' | 'createdAt'>): Promise<UserComplaint> => {
    const response = await fetch(`${API_URL}/users/${userId}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaint)
    });
    if (!response.ok) throw new Error('Failed to handle complaint');
    return response.json();
  }
};