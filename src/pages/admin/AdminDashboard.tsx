import { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    totalUsers: 0,
    totalComplaints: 0,
  });

  useEffect(() => {
    document.title = 'Admin Dashboard';
    const load = async () => {
      try {
        const response = await adminService.getStats();
        setStats({
          pendingVerifications: response.pendingVerifications,
          totalUsers: response.totalUsers,
          totalComplaints: response.totalComplaints,
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Pending Reviews</h2>
            <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Active Users</h2>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Open Complaints</h2>
            <p className="text-2xl font-bold">{stats.totalComplaints}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}