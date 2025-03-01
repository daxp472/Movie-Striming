import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { adminService } from '@/services/adminService';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    activeComplaints: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await adminService.getStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <h3>Total Users</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3>Total Movies</h3>
          <p className="text-2xl font-bold">{stats.totalMovies}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3>Active Complaints</h3>
          <p className="text-2xl font-bold">{stats.activeComplaints}</p>
        </CardContent>
      </Card>
    </div>
  );
}