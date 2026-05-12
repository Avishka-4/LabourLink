import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { workerService } from '@/services/workerService';

interface ComplaintItem {
  id: string;
  title: string;
}

export default function MyComplaintsPage() {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);

  useEffect(() => {
    document.title = 'My Complaints';
    const load = async () => {
      try {
        const items = await workerService.getComplaints();
        setComplaints(items.map((item) => ({ id: item.complaintId, title: item.title })));
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
      <h1 className="text-2xl font-bold">My Complaints</h1>
      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints"
          description="You have not submitted any complaints yet."
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((item) => (
            <Card key={item.id}>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground">Complaint details</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
