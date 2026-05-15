import { useState } from 'react';
import { Users, ArrowLeft, Lock, CreditCard, Globe } from 'lucide-react';
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

export function WorkerLogin() {
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
      toast.success(t('login_success_worker'));
      if (result.role === 'Worker') {
        navigate('/worker');
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
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 flex items-center justify-center p-4">
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

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="size-8 text-amber-600" />
            </div>
            <h2 className="mb-2">{t('worker_portal')}</h2>
            <p className="text-gray-600">{t('worker_signin_subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="worker-id">{t('worker_id_label')}</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="worker-id"
                  type="text"
                  placeholder={t('worker_id_placeholder')}
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                {t('worker_id_hint')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="worker-password">{t('password_label')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="worker-password"
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
                <Checkbox id="remember-worker" />
                <Label htmlFor="remember-worker" className="text-sm cursor-pointer">
                  {t('remember_me')}
                </Label>
              </div>
              <a href="/forgot-password" className="text-sm text-amber-600 hover:underline">
                {t('forgot_password')}
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={isLoading}
            >
              {isLoading ? t('signing_in') : t('sign_in')}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-center text-gray-600">
              {t('dont_have_account')}{' '}
              <a href="/register/worker" className="text-amber-600 hover:underline">
                {t('register_worker')}
              </a>
            </p>
          </div>
        </Card>

        <div className="mt-6 space-y-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <div className="bg-blue-100 p-2 rounded-lg h-fit">
                <Users className="size-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm mb-1">{t('need_help')}</h4>
                <p className="text-xs text-gray-700">
                  {t('support_hotline')}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  +971-800-WORKER
                </p>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <p className="text-xs text-gray-600">
              {t('available_languages')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}