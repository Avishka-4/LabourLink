import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { agencyService } from '@/services/agencyService';

export default function ManageJobsPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Array<{ id: string; title: string; status: string }>>([]);

  useEffect(() => {
    document.title = 'Manage Jobs';
    const load = async () => {
      try {
        const response = await agencyService.getJobs();
        setJobs(
          response.map((job: any) => ({
            id: job.jobId,
            title: job.title,
            status: job.status,
          }))
        );
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
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Manage Jobs</h1>
      {jobs.length === 0 ? (
        <EmptyState title="No jobs posted" description="Create your first job posting to get started." />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-muted-foreground">Status: {job.status}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
