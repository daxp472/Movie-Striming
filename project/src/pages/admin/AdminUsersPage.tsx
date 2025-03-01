import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Users</h1>
      <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <ul>
          {users.map((user, index) => (
            <li key={index} className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-white">{user.name}</span>
              <span className="text-gray-400">{user.email}</span>
              <span className={`text-${user.status === 'active' ? 'green' : 'red'}-400`}>{user.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminUsersPage;