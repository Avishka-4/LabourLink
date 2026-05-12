import { useEffect, useState } from 'react';
import { Card, Button, LoadingSpinner } from '@/components';
import { workerService } from '@/services/workerService';

interface DashboardData {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
}

export default function WorkerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Worker Dashboard';
    const load = async () => {
      try {
        const complaints = await workerService.getComplaints();
        const resolved = complaints.filter((c) => c.status.toLowerCase() === 'resolved').length;
        const pending = complaints.filter((c) => c.status.toLowerCase() !== 'resolved').length;
        setData({
          totalComplaints: complaints.length,
          resolvedComplaints: resolved,
          pendingComplaints: pending,
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
      <h1 className="text-2xl font-bold">Worker Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Total Complaints</h2>
            <p className="text-2xl font-bold">{data?.totalComplaints}</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Resolved</h2>
            <p className="text-2xl font-bold">{data?.resolvedComplaints}</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Pending</h2>
            <p className="text-2xl font-bold">{data?.pendingComplaints}</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">Submit a new complaint.</p>
          </div>
          <Button>Submit Complaint</Button>
        </div>
      </Card>
    </div>
  );
}
