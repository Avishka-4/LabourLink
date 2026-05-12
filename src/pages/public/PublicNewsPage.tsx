import { useEffect } from 'react';
import { Card, EmptyState } from '@/components';

export default function PublicNewsPage() {
  useEffect(() => {
    document.title = 'LabourLink - News';
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Announcements</h1>
      <EmptyState
        title="No news yet"
        description="Public announcements will appear here."
      />
      <Card>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Coming soon</h2>
          <p className="text-sm text-muted-foreground">
            Check back later for updates.
          </p>
        </div>
      </Card>
    </div>
  );
}
