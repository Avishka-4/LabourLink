import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Card, LoadingSpinner } from '@/components';
import { workerService } from '@/services/workerService';

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<{ title: string; description: string; status: string } | null>(null);

  useEffect(() => {
    document.title = 'Complaint Detail';
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await workerService.getComplaint(id);
        setDetail({
          title: response.title,
          description: response.description,
          status: response.status,
        });
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
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Complaint Detail</h1>
      <Card>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{detail?.title ?? 'Complaint Title'}</h2>
          <p className="text-sm text-muted-foreground">{detail?.description}</p>
          <p className="text-xs text-muted-foreground">Status: {detail?.status}</p>
        </div>
      </Card>
    </div>
  );
}
