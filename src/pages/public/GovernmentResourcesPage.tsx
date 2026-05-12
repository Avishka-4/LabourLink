import { useEffect } from 'react';
import { Card } from '@/components';

export default function GovernmentResourcesPage() {
  useEffect(() => {
    document.title = 'LabourLink - Resources';
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Government Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Worker Rights</h2>
            <p className="text-sm text-muted-foreground">
              Learn about workplace protections and support services.
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Reporting Channels</h2>
            <p className="text-sm text-muted-foreground">
              Contact official agencies for assistance and reporting.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
