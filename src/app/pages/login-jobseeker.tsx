import { useState } from 'react';
import { Briefcase, ArrowLeft, Lock, CreditCard, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

export function JobSeekerLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      toast.success('Login successful! Welcome to Job Seeker Portal');
      if (result.role === 'JobSeeker') {
        navigate('/jobseeker');
      } else {
        navigate('/login');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Home
          </Button>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <Globe className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
              <SelectItem value="tl">Tagalog</SelectItem>
              <SelectItem value="ur">اردو</SelectItem>
              <SelectItem value="bn">বাংলা</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="size-8 text-purple-600" />
            </div>
            <h2 className="mb-2">Job Seeker Portal</h2>
            <p className="text-gray-600">Sign in to find your next opportunity</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jobseeker-id">Applicant ID / Email</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="jobseeker-id"
                  type="text"
                  placeholder="Enter your ID or email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Use the ID provided during registration
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobseeker-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="jobseeker-password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember-jobseeker" />
                <Label htmlFor="remember-jobseeker" className="text-sm cursor-pointer">
                  Remember me
                </Label>
              </div>
              <a href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <a href="/register/jobseeker" className="text-purple-600 hover:underline">
                Register as job seeker
              </a>
            </p>
          </div>
        </Card>

        <div className="mt-6 space-y-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <div className="bg-blue-100 p-2 rounded-lg h-fit">
                <Briefcase className="size-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm mb-1">Need Help?</h4>
                <p className="text-xs text-gray-700">
                  Contact our 24/7 support hotline
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  +971-800-JOBS
                </p>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <p className="text-xs text-gray-600">
              Available in multiple languages for your convenience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}