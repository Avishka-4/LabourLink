import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LoginForm } from '@/components';
import { authService } from '@/services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'LabourLink - Login';
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <LoginForm
        isLoading={loading}
        error={error}
        onSubmit={async ({ email, password }) => {
          setLoading(true);
          setError(undefined);
          try {
            // Hardcoded admin credentials
            const trimmedEmail = email.trim().toLowerCase();
            const isAdminEmail = trimmedEmail === 'avishkanishada73@gamil.com' || trimmedEmail === 'avishkanishada73@gmail.com';
            if (isAdminEmail && password.trim() === 'admin') {
              localStorage.setItem('token', 'admin-token');
              localStorage.setItem('refreshToken', 'admin-refresh');
              localStorage.setItem('userRole', 'Administrator');
              localStorage.setItem('userId', 'admin-user');
              navigate('/admin');
              return;
            }

            const result = await authService.login(email, password);
            const role = result.role;
            if (role === 'Administrator') {
              navigate('/admin');
            } else if (role === 'RecruitmentAgency') {
              navigate('/agency');
            } else if (role === 'JobSeeker') {
              navigate('/jobseeker');
            } else {
              navigate('/worker');
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
          } finally {
            setLoading(false);
          }
        }}
        onForgotPassword={() => navigate('/forgot-password')}
      />
    </div>
  );
}
