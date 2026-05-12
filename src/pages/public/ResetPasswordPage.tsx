import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ResetPasswordForm } from '@/components';
import { authService } from '@/services/authService';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'LabourLink - Reset Password';
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <ResetPasswordForm
        token={token ?? ''}
        isLoading={loading}
        error={error}
        onSubmit={async ({ email, password, confirmPassword }) => {
          setLoading(true);
          setError(undefined);
          try {
            await authService.resetPassword({
              email,
              token: token ?? '',
              newPassword: password,
              confirmPassword,
            });
            navigate('/login');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Reset failed');
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
