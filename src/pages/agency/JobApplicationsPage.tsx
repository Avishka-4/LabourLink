import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { agencyService } from '@/services/agencyService';

export default function JobApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Array<{ id: string; jobTitle: string; status: string }>>([]);

  useEffect(() => {
    document.title = 'Job Applications';
    const load = async () => {
      try {
        const jobs = await agencyService.getJobs();
        if (!jobs.length) {
          setApplications([]);
          return;
        }
        const firstJobId = jobs[0].jobId;
        const items = await agencyService.getJobApplications(firstJobId);
        setApplications(items.map((item: any) => ({
          id: item.applicationId,
          jobTitle: item.jobTitle,
          status: item.status,
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
      <h1 className="text-2xl font-bold">Job Applications</h1>
      {applications.length === 0 ? (
        <EmptyState title="No applications" description="Applications for your jobs will appear here." />
      ) : (
        <div className="space-y-3">
          {applications.map((item) => (
            <Card key={item.id}>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{item.jobTitle}</h2>
                <p className="text-sm text-muted-foreground">Status: {item.status}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
