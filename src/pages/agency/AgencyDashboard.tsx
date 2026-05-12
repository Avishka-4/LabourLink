import { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '@/components';
import { agencyService } from '@/services/agencyService';

export default function AgencyDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, totalViewCount: 0 });

  useEffect(() => {
    document.title = 'Agency Dashboard';
    const load = async () => {
      try {
        const response = await agencyService.getStats();
        setStats(response);
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
      <h1 className="text-2xl font-bold">Agency Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Active Jobs</h2>
            <p className="text-2xl font-bold">{stats.totalJobs}</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Applicants</h2>
            <p className="text-2xl font-bold">{stats.totalApplications}</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Interviews</h2>
            <p className="text-2xl font-bold">0</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
