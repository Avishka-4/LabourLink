import { useEffect, useState } from 'react';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<Array<{ id: string; action: string; entityType: string }>>([]);

  useEffect(() => {
    document.title = 'Audit Logs';
    const load = async () => {
      try {
        const response = await adminService.getAuditLogs();
        setLogs(response.map((log: any) => ({
          id: log.logId,
          action: log.action,
          entityType: log.entityType,
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
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      {logs.length === 0 ? (
        <EmptyState title="No audit logs" description="Audit activity will appear here." />
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log.id}>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{log.action}</h2>
                <p className="text-sm text-muted-foreground">{log.entityType}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
