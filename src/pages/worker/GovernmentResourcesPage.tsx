import { useEffect } from 'react';
import { Card } from '@/components';

export default function GovernmentResourcesPage() {
  useEffect(() => {
    document.title = 'Worker Resources';
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Worker Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Legal Aid</h2>
            <p className="text-sm text-muted-foreground">
              Find legal support services near you.
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Health Services</h2>
            <p className="text-sm text-muted-foreground">
              Access public health and safety resources.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
