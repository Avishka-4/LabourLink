import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button, Card, EmptyState, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';

type ComplaintItem = { id: string; title: string; status: string; workerName: string | null; type: string };

export default function ManageComplaintsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Manage Complaints';
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const response = await adminService.getComplaints() as any[];
      setComplaints(response.map((item: any) => ({
        id: item.complaintId,
        title: item.title,
        status: item.status,
        workerName: item.workerName ?? null,
        type: item.type ?? '',
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setActionLoading(id + status);
    try {
      await adminService.updateComplaintStatus(id, { Status: status });
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      toast.success(`Complaint marked as ${status}`);
    } catch {
      toast.error('Failed to update complaint status.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <button onClick={() => navigate(-1)} className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
      <h1 className="text-2xl font-bold">Manage Complaints</h1>
      {complaints.length === 0 ? (
        <EmptyState title="No complaints" description="Complaints requiring review will appear here." />
      ) : (
        <div className="space-y-3">
          {complaints.map((item) => (
            <Card key={item.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  {item.workerName && (
                    <p className="text-sm text-muted-foreground">By: {item.workerName}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {item.type && <span>{item.type} • </span>}
                    Status: <span className="font-medium">{item.status}</span>
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {item.status !== 'UnderReview' && item.status !== 'Resolved' && item.status !== 'Closed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      isLoading={actionLoading === item.id + 'UnderReview'}
                      disabled={actionLoading !== null}
                      onClick={() => handleStatusUpdate(item.id, 'UnderReview')}
                    >
                      Review
                    </Button>
                  )}
                  {item.status !== 'Resolved' && item.status !== 'Closed' && (
                    <Button
                      size="sm"
                      isLoading={actionLoading === item.id + 'Resolved'}
                      disabled={actionLoading !== null}
                      onClick={() => handleStatusUpdate(item.id, 'Resolved')}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}