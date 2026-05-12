import { useEffect } from 'react';
import { EmptyState } from '@/components';

export default function ManageNewsPage() {
  useEffect(() => {
    document.title = 'Manage News';
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Manage News</h1>
      <EmptyState
        title="No news items"
        description="News items will appear here."
      />
    </div>
  );
}
