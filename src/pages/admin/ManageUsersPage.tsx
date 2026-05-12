import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';

export default function ManageUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string; status: string }>>([]);

  useEffect(() => {
    document.title = 'Manage Users';
    const load = async () => {
      try {
        const response = await adminService.getUsers();
        setUsers(response.map((user: any) => ({
          id: user.userId,
          name: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        })));
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
      <h1 className="text-2xl font-bold">Manage Users</h1>
      {users.length === 0 ? (
        <EmptyState title="No users available" description="User records will appear here." />
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id}>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.role} • {user.status}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
