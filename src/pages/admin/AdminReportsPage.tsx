import { useEffect } from 'react';
import { Card } from '@/components';

export default function AdminReportsPage() {
  useEffect(() => {
    document.title = 'Admin Reports';
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <Card>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">System Summary</h2>
          <p className="text-sm text-muted-foreground">
            Reporting data will appear here.
          </p>
        </div>
      </Card>
    </div>
  );
}
