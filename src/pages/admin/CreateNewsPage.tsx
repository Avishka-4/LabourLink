import { useEffect, useState } from 'react';
import { Card, Button, TextArea, Input } from '@/components';
import { adminService } from '@/services/adminService';

export default function CreateNewsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Create News';
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Create News</h1>
      <Card>
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="News title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextArea
            label="Content"
            placeholder="Write the announcement..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            isLoading={loading}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await adminService.createNews({
                  title,
                  content,
                  category: 'Update',
                  priority: 1,
                });
                setTitle('');
                setContent('');
              } finally {
                setLoading(false);
              }
            }}
          >
            Publish
          </Button>
        </div>
      </Card>
    </div>
  );
}
