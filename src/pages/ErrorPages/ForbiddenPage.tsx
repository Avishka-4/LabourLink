import { useEffect } from 'react';
import { Button } from '@/components';

export default function ForbiddenPage() {
  useEffect(() => {
    document.title = 'Access Forbidden';
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
      <h1 className="text-3xl font-bold">Access Forbidden</h1>
      <p className="text-sm text-muted-foreground">
        You do not have permission to view this page.
      </p>
      <Button variant="outline">Go Back</Button>
    </div>
  );
}
