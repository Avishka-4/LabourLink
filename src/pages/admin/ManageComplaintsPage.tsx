import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';

export default function ManageComplaintsPage() {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Array<{ id: string; title: string; status: string }>>([]);

  useEffect(() => {
    document.title = 'Manage Complaints';
    const load = async () => {
      try {
        const response = await adminService.getComplaints();
        setComplaints(response.map((item: any) => ({
          id: item.complaintId,
          title: item.title,
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
      <h1 className="text-2xl font-bold">Manage Complaints</h1>
      {complaints.length === 0 ? (
        <EmptyState title="No complaints" description="Complaints requiring review will appear here." />
      ) : (
        <div className="space-y-3">
          {complaints.map((item) => (
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
