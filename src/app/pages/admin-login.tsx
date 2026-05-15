import { useState } from 'react';
import { Lock, User, Users, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { useLanguage } from '../contexts/language-context';

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
      const result = await authService.login(email, password);
      toast.success(t('login_success_admin'));
      if (result.role === 'Administrator') {
        navigate('/admin');
      } else {
        navigate('/login');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('login_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
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
        <Card className="p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="size-8 text-white" />
            </div>
            <h2 className="mb-2">{t('admin_portal')}</h2>
            <p className="text-gray-600">{t('admin_signin_subtitle')}</p>
            <p className="text-xs text-amber-600 mt-2">{t('admin_authorized_only')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-id">{t('admin_id_label')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="admin-id"
                  type="text"
                  placeholder={t('admin_id_placeholder')}
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">{t('password_label')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder={t('password_placeholder')}
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember-admin" />
                <Label htmlFor="remember-admin" className="text-sm cursor-pointer">
                  {t('remember_me')}
                </Label>
              </div>
              <a href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                {t('forgot_password')}
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? t('signing_in') : t('sign_in')}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <div className="text-center text-xs text-gray-500">
              <p>{t('admin_access_monitored')}</p>
              <p className="mt-1">{t('admin_contact_it')}</p>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Card className="p-4 bg-amber-50 border-amber-200">
            <p className="text-xs text-amber-800 text-center">
              🔒 {t('admin_secure_notice')}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}