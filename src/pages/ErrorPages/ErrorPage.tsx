import { useEffect } from 'react';
import { Button } from '@/components';

export default function ErrorPage() {
  useEffect(() => {
    document.title = 'Server Error';
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        Please try again later.
      </p>
      <Button variant="outline">Retry</Button>
    </div>
  );
}
