import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button, Card, LoadingSpinner } from '@/components';
import { jobService } from '@/services/jobService';
import { jobSeekerService } from '@/services/jobSeekerService';
import type { JobDetailResponse } from '@/types/api.types';

export default function JobDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobDetailResponse | null>(null);

  useEffect(() => {
    document.title = 'Job Seeker - Job Detail';
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const result = await jobService.getById(id);
        setJob(result);
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
      <h1 className="text-2xl font-bold">Job Detail</h1>
      <Card>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{job?.title ?? 'Role Title'}</h2>
          <p className="text-sm text-muted-foreground">
            {job?.agency?.name ?? 'Company'} • {job?.location ?? 'Location'}
          </p>
          <Button
            onClick={async () => {
              if (!job) return;
              await jobSeekerService.applyToJob(job.jobId, {});
            }}
          >
            Apply
          </Button>
        </div>
      </Card>
    </div>
  );
}
