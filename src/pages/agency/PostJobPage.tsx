import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { JobPostingForm } from '@/components';
import { agencyService } from '@/services/agencyService';

function toEmploymentType(jobType: string): string {
  const map: Record<string, string> = {
    'full-time': 'FullTime',
    'part-time': 'PartTime',
    'contract': 'Contract',
    'temporary': 'Temporary',
  };
  return map[jobType.toLowerCase()] ?? 'FullTime';
}

export default function PostJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    document.title = 'Post a Job';
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
      <JobPostingForm
        isLoading={loading}
        error={error}
        onSubmit={async (data) => {
          setLoading(true);
          setError(undefined);
          try {
            await agencyService.createJob({
              title: data.title,
              description: data.description,
              location: data.location,
              salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
              salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
              category: data.jobType,
              employmentType: toEmploymentType(data.jobType),
              deadlineDate: data.deadline ? new Date(data.deadline).toISOString() : undefined,
              publishNow: true,
              benefits: data.benefits,
            });
            navigate('/agency/jobs');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Post failed');
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
