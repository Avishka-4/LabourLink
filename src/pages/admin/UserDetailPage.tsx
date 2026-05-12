import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Card, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';

export default function UserDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    document.title = 'User Detail';
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const response = await adminService.getUser(id);
        setUser(response);
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
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">User Detail</h1>
      <Card>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{user?.fullName ?? 'Profile Summary'}</h2>
          <p className="text-sm text-muted-foreground">{user?.email ?? ''}</p>
          <p className="text-sm text-muted-foreground">{user?.role ?? ''} • {user?.status ?? ''}</p>
        </div>
      </Card>
    </div>
  );
}
