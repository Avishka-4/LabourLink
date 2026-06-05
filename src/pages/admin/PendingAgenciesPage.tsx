import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button, Card, EmptyState, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';

type VerificationItem = { id: string; name: string; email: string };

export default function PendingAgenciesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Pending Agencies';
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPendingVerifications() as any[];
      setItems(response.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, approve: boolean) => {
    setActionLoading(id);
    try {
      await adminService.reviewVerification(id, { IsApproved: approve });
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success(approve ? 'Agency approved' : 'Agency rejected');
    } catch {
      toast.error('Action failed. Please try again.');
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
      <h1 className="text-2xl font-bold">Pending Agencies</h1>
      {items.length === 0 ? (
        <EmptyState title="No pending agencies" description="Pending agency approvals will appear here." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">{item.email}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    isLoading={actionLoading === item.id}
                    disabled={actionLoading !== null}
                    onClick={() => handleReview(item.id, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    isLoading={actionLoading === item.id}
                    disabled={actionLoading !== null}
                    onClick={() => handleReview(item.id, false)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}