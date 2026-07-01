import { useState } from 'react';
import { Shield, ArrowLeft, Lock, Mail, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/language-context';
import { authService } from '@/services/authService';

// What the user types
const CUSTOM_EMAILS = ['avishkanishada73@gamil.com', 'avishkanishada73@gmail.com'];
const CUSTOM_PASSWORD = 'admin';

// Real seeded backend admin (from Program.cs SeedDemoUsersAsync)
const BACKEND_ADMIN_EMAIL = 'admin@labourlink.demo';
const BACKEND_ADMIN_PASSWORD = 'Admin@123456';

export function AdminLogin() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // Accept the user's custom credentials OR the real backend credentials
      const isCustom = CUSTOM_EMAILS.includes(trimmedEmail) && trimmedPassword === CUSTOM_PASSWORD;
      const isDirect = trimmedEmail === BACKEND_ADMIN_EMAIL && trimmedPassword === BACKEND_ADMIN_PASSWORD;

      if (!isCustom && !isDirect) {
        toast.error('Invalid admin credentials');
        return;
      }

      // Authenticate with the REAL backend admin account to get a valid JWT token
      const result = await authService.login(BACKEND_ADMIN_EMAIL, BACKEND_ADMIN_PASSWORD);

      if (result.role !== 'Administrator') {
        toast.error('This account does not have admin privileges');
        return;
      }

      toast.success('Welcome, Administrator!');
      navigate('/admin');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-violet-50 to-purple-100 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="size-4 mr-2" />
            {t('back_to_home')}
          </Button>

          <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'si' | 'ta')}>
            <SelectTrigger className="w-32">
              <Globe className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="si">සිංහල</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="p-8 shadow-2xl border-indigo-200 dark:border-indigo-800">
          <div className="text-center mb-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-full inline-flex mb-4">
              <Shield className="size-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-indigo-900 dark:text-white">{t('admin_portal')}</h2>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">{t('admin_signin_subtitle')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('admin_authorized_only')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('admin_id_label')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('admin_id_placeholder')}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? t('signing_in') : t('sign_in')}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              🔒 {t('admin_access_monitored')}
            </p>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              {t('admin_secure_notice')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
