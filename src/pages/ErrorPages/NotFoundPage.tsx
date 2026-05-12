import { useEffect } from 'react';
import { Button } from '@/components';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found';
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
      <h1 className="text-3xl font-bold">Page Not Found</h1>
      <p className="text-sm text-muted-foreground">
        The page you requested could not be found.
      </p>
      <Button>Return Home</Button>
    </div>
  );
}
