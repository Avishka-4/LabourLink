import { useEffect, useState } from 'react';
import { ForgotPasswordForm } from '@/components';
import { authService } from '@/services/authService';

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  useEffect(() => {
    document.title = 'LabourLink - Forgot Password';
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <ForgotPasswordForm
        isLoading={loading}
        error={error}
        successMessage={successMessage}
        onSubmit={async ({ email }) => {
          setLoading(true);
          setError(undefined);
          try {
            await authService.forgotPassword(email);
            setSuccessMessage('If that email exists, a reset link has been sent.');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Request failed');
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
