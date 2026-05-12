import { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '@/components';
import { jobSeekerService } from '@/services/jobSeekerService';

export default function JobSeekerDashboard() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ applications: 0, saved: 0, interviews: 0 });

  useEffect(() => {
    document.title = 'Job Seeker Dashboard';
    const load = async () => {
      try {
        const [applications, saved] = await Promise.all([
          jobSeekerService.getApplications(),
          jobSeekerService.getSavedJobs(),
        ]);
        setCounts({ applications: applications.length, saved: saved.length, interviews: 0 });
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
      <h1 className="text-2xl font-bold">Job Seeker Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Applications</h2>
            <p className="text-2xl font-bold">{counts.applications}</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Saved Jobs</h2>
            <p className="text-2xl font-bold">{counts.saved}</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Interviews</h2>
            <p className="text-2xl font-bold">{counts.interviews}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
