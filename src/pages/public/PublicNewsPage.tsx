import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { newsService } from '@/services/newsService';
import type { NewsResponse } from '@/types/api.types';

export default function PublicNewsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [news, setNews] = useState<NewsResponse[]>([]);

  useEffect(() => {
    document.title = 'LabourLink - News';
    const load = async () => {
      try {
        const items = await newsService.listPublic();
        setNews(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load news');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Announcements</h1>
      {error ? (
        <EmptyState title="Unable to load news" description={error} />
      ) : news.length === 0 ? (
        <EmptyState title="No news yet" description="Public announcements will appear here." />
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <Card key={item.newsId}>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="uppercase">{item.category}</span>
                  <span>•</span>
                  <span>{new Date(item.publishedAt ?? item.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
