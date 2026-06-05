import { useEffect } from 'react';
import { Card } from '@/components';

export default function AdminSettingsPage() {
  useEffect(() => {
    document.title = 'Admin Settings';
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Administration</h2>
          <p className="text-sm text-muted-foreground">
            Manage platform settings and permissions.
          </p>
        </div>
      </Card>
    </div>
  );
}