import { useState } from 'react';
import { Shield, Lock, User, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

export function AdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      toast.success('Login successful! Welcome to Admin Portal');
      if (result.role === 'Administrator') {
        navigate('/admin');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="size-8 text-white" />
            </div>
            <h2 className="mb-2">Admin Portal</h2>
            <p className="text-gray-600">LabourLink</p>
            <p className="text-xs text-amber-600 mt-2">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-id">Admin ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="admin-id"
                  type="text"
                  placeholder="Enter your admin ID"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="admin-password"
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
                <Checkbox id="remember-admin" />
                <Label htmlFor="remember-admin" className="text-sm cursor-pointer">
                  Remember me
                </Label>
              </div>
              <a href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <div className="text-center text-xs text-gray-500">
              <p>All access is monitored and logged</p>
              <p className="mt-1">If you don't have access, contact IT support</p>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Card className="p-4 bg-amber-50 border-amber-200">
            <p className="text-xs text-amber-800 text-center">
              🔒 This is a secure government portal. Unauthorized access is prohibited and will be prosecuted.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}