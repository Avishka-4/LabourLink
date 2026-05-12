import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, EmptyState, Input, LoadingSpinner } from '@/components';
import { jobSeekerService } from '@/services/jobSeekerService';

export default function BrowseJobsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Array<{ id: string; title: string; agency?: string }>>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Job Seeker - Browse Jobs';
    const load = async () => {
      try {
        const results = await jobSeekerService.searchJobs();
        setJobs(results.map((job) => ({
          id: job.jobId,
          title: job.title,
          agency: job.agency?.name,
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
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Browse Jobs</h1>
      <div className="flex gap-2">
        <Input placeholder="Search jobs" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button
          variant="outline"
          onClick={async () => {
            setLoading(true);
            const results = await jobSeekerService.searchJobs({ search });
            setJobs(results.map((job) => ({
              id: job.jobId,
              title: job.title,
              agency: job.agency?.name,
            })));
            setLoading(false);
          }}
        >
          Search
        </Button>
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="No jobs available" description="Try adjusting your search." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-muted-foreground">{job.agency ?? 'Unknown Agency'}</p>
                <Button size="sm" onClick={() => navigate(`/jobseeker/jobs/${job.id}`)}>
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
