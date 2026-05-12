import { useEffect, useState } from 'react';
import { ProfileForm } from '@/components';
import { jobSeekerService } from '@/services/jobSeekerService';

export default function JobSeekerProfilePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [initialData, setInitialData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    document.title = 'Job Seeker Profile';
    const load = async () => {
      setLoading(true);
      try {
        const profile = await jobSeekerService.getProfile();
        const fullName = profile.fullName?.split(' ') ?? [];
        setInitialData({
          firstName: fullName[0] ?? '',
          lastName: fullName.slice(1).join(' '),
          email: profile.email ?? '',
          location: profile.location ?? '',
          skills: profile.languages ? profile.languages.split(',').map((s) => s.trim()) : [],
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <ProfileForm
        isLoading={loading}
        error={error}
        initialData={initialData}
        showSkills
        onSubmit={async (data) => {
          setLoading(true);
          setError(undefined);
          try {
            await jobSeekerService.updateProfile({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              location: data.location,
              languages: data.skills?.join(', '),
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
