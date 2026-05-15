import { useEffect, useState } from 'react';
import { Button, Card, EmptyState, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';
import type { NewsResponse } from '@/types/api.types';

export default function ManageNewsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [news, setNews] = useState<NewsResponse[]>([]);

  useEffect(() => {
    document.title = 'Manage News';
    const load = async () => {
      try {
        const items = await adminService.listNews();
        setNews(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load news');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handlePublish = async (newsId: string) => {
    setLoading(true);
    setError(undefined);
    try {
      await adminService.publishNews(newsId, { publishNow: true });
      const items = await adminService.listNews();
      setNews(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to publish news');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Manage News</h1>
      {error ? (
        <EmptyState title="Unable to load news" description={error} />
      ) : news.length === 0 ? (
        <EmptyState title="No news items" description="Create an announcement to get started." />
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <Card key={item.newsId}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="uppercase">{item.category}</span>
                    <span>•</span>
                    <span>Status: {item.status}</span>
                  </div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.content}
                  </p>
                </div>
                {item.status !== 'Published' && (
                  <Button onClick={() => handlePublish(item.newsId)}>Publish</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
