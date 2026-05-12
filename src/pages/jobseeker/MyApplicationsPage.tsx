import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { jobSeekerService } from '@/services/jobSeekerService';

export default function MyApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Array<{ id: string; title: string; status: string }>>([]);

  useEffect(() => {
    document.title = 'My Applications';
    const load = async () => {
      try {
        const items = await jobSeekerService.getApplications();
        setApplications(items.map((item) => ({ id: item.applicationId, title: item.jobTitle, status: item.status })));
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
      <h1 className="text-2xl font-bold">My Applications</h1>
      {applications.length === 0 ? (
        <EmptyState title="No applications" description="Track your submitted applications here." />
      ) : (
        <div className="space-y-3">
          {applications.map((item) => (
            <Card key={item.id}>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground">Status: {item.status}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
