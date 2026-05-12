import { useEffect } from 'react';
import { Card } from '@/components';

export default function JobSeekerSettingsPage() {
  useEffect(() => {
    document.title = 'Job Seeker Settings';
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Update your notification and profile settings.
          </p>
        </div>
      </Card>
    </div>
  );
}
