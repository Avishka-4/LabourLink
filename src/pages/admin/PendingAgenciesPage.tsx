import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';

export default function PendingAgenciesPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Array<{ id: string; name: string; email: string }>>([]);

  useEffect(() => {
    document.title = 'Pending Agencies';
    const load = async () => {
      try {
        const response = await adminService.getPendingVerifications();
        setItems(response.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
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
      <h1 className="text-2xl font-bold">Pending Agencies</h1>
      {items.length === 0 ? (
        <EmptyState title="No pending agencies" description="Pending agency approvals will appear here." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-muted-foreground">{item.email}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
