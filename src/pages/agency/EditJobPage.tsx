import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { JobPostingForm } from '@/components';
import { LoadingSpinner } from '@/components';
import type { JobPostingFormData } from '@/app/components/forms/JobPostingForm';
import { agencyService } from '@/services/agencyService';

function toEmploymentType(jobType: string): string {
  const map: Record<string, string> = {
    'full-time': 'FullTime', 'part-time': 'PartTime',
    'contract': 'Contract',  'temporary': 'Temporary',
  };
  return map[jobType.toLowerCase()] ?? 'FullTime';
}

function fromEmploymentType(type: string): string {
  const map: Record<string, string> = {
    'fulltime': 'full-time', 'parttime': 'part-time',
    'contract': 'contract',  'temporary': 'temporary',
  };
  return map[type.toLowerCase()] ?? 'full-time';
}

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [initialData, setInitialData] = useState<Partial<JobPostingFormData> | undefined>();

  useEffect(() => {
    document.title = 'Edit Job';
    const load = async () => {
      if (!id) { setLoading(false); return; }
      try {
        const job = await agencyService.getJob(id);
        setInitialData({
          title: job.jobTitle ?? job.title ?? '',
          company: job.agency?.companyName ?? job.agencyName ?? '',
          description: job.description ?? '',
          requirements: job.requirements ?? '',
          location: job.location ?? '',
          salaryMin: job.salaryMin != null ? String(job.salaryMin) : '',
          salaryMax: job.salaryMax != null ? String(job.salaryMax) : '',
          jobType: fromEmploymentType(job.employmentType ?? job.category ?? 'full-time'),
          experience: job.experienceLevel ?? '',
          benefits: Array.isArray(job.benefits) ? job.benefits : [],
          deadline: job.deadlineDate ? job.deadlineDate.slice(0, 10) : '',
        });
      } catch {
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
      <JobPostingForm
        initialData={initialData}
        isLoading={submitLoading}
        error={error}
        onSubmit={async (data) => {
          if (!id) return;
          setSubmitLoading(true);
          setError(undefined);
          try {
            await agencyService.updateJob(id, {
              title: data.title,
              description: data.description,
              location: data.location,
              salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
              salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
              category: data.jobType,
              employmentType: toEmploymentType(data.jobType),
              deadlineDate: data.deadline ? new Date(data.deadline).toISOString() : undefined,
              benefits: data.benefits,
            });
            navigate('/agency/jobs');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
          } finally {
            setSubmitLoading(false);
          }
        }}
      />
    </div>
  );
}
