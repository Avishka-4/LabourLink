import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';

export default function JobApprovalsPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Array<{ id: string; title: string; agency: string }>>([]);

  useEffect(() => {
    document.title = 'Job Approvals';
    const load = async () => {
      try {
        const response = await adminService.getPendingJobs();
        setJobs(response.map((job: any) => ({
          id: job.jobId,
          title: job.title,
          agency: job.agencyName,
        })));
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
      <h1 className="text-2xl font-bold">Job Approvals</h1>
      {jobs.length === 0 ? (
        <EmptyState title="No jobs pending" description="Jobs awaiting approval will appear here." />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-muted-foreground">{job.agency}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
