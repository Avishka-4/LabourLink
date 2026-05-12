import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { RegistrationForm } from '@/components';
import { authService } from '@/services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'LabourLink - Register';
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <RegistrationForm
        isLoading={loading}
        error={error}
        onSubmit={async (data) => {
          setLoading(true);
          setError(undefined);

          const roleMap = {
            worker: 'Worker',
            jobseeker: 'JobSeeker',
            agency: 'RecruitmentAgency',
            admin: 'Administrator',
          } as const;

          try {
            await authService.register({
              email: data.email,
              password: data.password,
              confirmPassword: data.confirmPassword,
              fullName: `${data.firstName} ${data.lastName}`.trim(),
              role: roleMap[data.role],
              phoneNumber: data.phone,
            });
            navigate('/login');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
