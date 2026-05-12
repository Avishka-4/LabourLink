import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { jobSeekerService } from '@/services/jobSeekerService';

export default function SavedJobsPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    document.title = 'Saved Jobs';
    const load = async () => {
      try {
        const items = await jobSeekerService.getSavedJobs();
        setJobs(items.map((job) => ({ id: job.jobId, title: job.title })));
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
      <h1 className="text-2xl font-bold">Saved Jobs</h1>
      {jobs.length === 0 ? (
        <EmptyState title="No saved jobs" description="Jobs you save will appear here." />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{job.title}</h2>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
