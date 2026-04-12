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

export function WorkerLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Login successful! Welcome to Worker Portal');
      navigate('/worker');
    }, 1500);
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
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="size-8 text-amber-600" />
            </div>
            <h2 className="mb-2">Worker Portal</h2>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="worker-id">Worker ID / Passport Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="worker-id"
                  type="text"
                  placeholder="Enter your Worker ID"
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Use the ID provided by your agency or government
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="worker-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="worker-password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember-worker" />
                <Label htmlFor="remember-worker" className="text-sm cursor-pointer">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-amber-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <a href="/register/worker" className="text-amber-600 hover:underline">
                Register as worker
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
                <h4 className="text-sm mb-1">Need Help?</h4>
                <p className="text-xs text-gray-700">
                  Contact our 24/7 support hotline
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  +971-800-WORKER
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