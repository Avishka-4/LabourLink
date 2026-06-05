import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button, Card, EmptyState, LoadingSpinner } from '@/components';
import { adminService } from '@/services/adminService';

type JobItem = { id: string; title: string; agency: string };

export default function JobApprovalsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Job Approvals';
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPendingJobs() as any[];
      setJobs(response.map((job: any) => ({
        id: job.jobId,
        title: job.title,
        agency: job.agencyName,
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, approve: boolean) => {
    setActionLoading(id);
    try {
      await adminService.reviewJob(id, { IsApproved: approve });
      setJobs(prev => prev.filter(j => j.id !== id));
      toast.success(approve ? 'Job approved and published' : 'Job rejected');
    } catch {
      toast.error('Action failed. Please try again.');
    } finally {
      setActionLoading(null);
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
      <button onClick={() => navigate(-1)} className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
      <h1 className="text-2xl font-bold">Job Approvals</h1>
      {jobs.length === 0 ? (
        <EmptyState title="No jobs pending" description="Jobs awaiting approval will appear here." />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">{job.agency}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    isLoading={actionLoading === job.id}
                    disabled={actionLoading !== null}
                    onClick={() => handleReview(job.id, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    isLoading={actionLoading === job.id}
                    disabled={actionLoading !== null}
                    onClick={() => handleReview(job.id, false)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}