import { useEffect, useState } from 'react';
import { ProfileForm } from '@/components';
import { workerService } from '@/services/workerService';

export default function WorkerProfilePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [initialData, setInitialData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    document.title = 'Worker Profile';
    const load = async () => {
      setLoading(true);
      try {
        const profile = await workerService.getProfile();
        const fullName = profile.fullName?.split(' ') ?? [];
        setInitialData({
          firstName: fullName[0] ?? '',
          lastName: fullName.slice(1).join(' '),
          email: profile.email ?? '',
          phone: profile.phoneNumber ?? '',
          location: profile.location ?? '',
          skills: profile.skills ? profile.skills.split(',').map((s) => s.trim()) : [],
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
            await workerService.updateProfile({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phoneNumber: data.phone,
              location: data.location,
              skills: data.skills?.join(', '),
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
