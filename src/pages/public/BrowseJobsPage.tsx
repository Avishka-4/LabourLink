import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, EmptyState, Input, LoadingSpinner } from '@/components';
import { jobService } from '@/services/jobService';

interface JobPreview {
  id: string;
  title: string;
  company: string;
}

export default function BrowseJobsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobPreview[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'LabourLink - Browse Jobs';
    const load = async () => {
      try {
        const results = await jobService.list({ search });
        setJobs(
          results.map((job) => ({
            id: job.jobId,
            title: job.title,
            company: job.agency?.name ?? 'Unknown Agency',
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
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
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Browse Jobs</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search jobs"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button
            variant="outline"
            onClick={async () => {
              setLoading(true);
              const results = await jobService.list({ search });
              setJobs(
                results.map((job) => ({
                  id: job.jobId,
                  title: job.title,
                  company: job.agency?.name ?? 'Unknown Agency',
                }))
              );
              setLoading(false);
            }}
          >
            Search
          </Button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs available"
          description="Try adjusting your filters or check back later."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <Button size="sm" onClick={() => navigate(`/jobs/${job.id}`)}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
