import { useEffect, useState } from 'react';
import { ProfileForm } from '@/components';
import { agencyService } from '@/services/agencyService';

export default function AgencyProfilePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [initialData, setInitialData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    document.title = 'Agency Profile';
    const load = async () => {
      setLoading(true);
      try {
        const profile = await agencyService.getProfile();
        const nameParts = profile.name.split(' ');
        setInitialData({
          firstName: nameParts[0] ?? '',
          lastName: nameParts.slice(1).join(' '),
          email: profile.contactEmail ?? '',
          phone: profile.contactPhone ?? '',
          location: profile.address ?? '',
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
        onSubmit={async (data) => {
          setLoading(true);
          setError(undefined);
          try {
            await agencyService.updateProfile({
              name: `${data.firstName} ${data.lastName}`.trim(),
              contactEmail: data.email,
              contactPhone: data.phone,
              address: data.location,
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
