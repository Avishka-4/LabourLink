import { useState } from 'react';
import { Users, Upload, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ThemeLanguageToggle } from '../components/theme-language-toggle';

export function WorkerRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    passportNumber: '',
    nic: '',
    dateOfBirth: '',
    gender: '',
    currentAgency: '',
    workplace: '',
    position: '',
    contractStartDate: '',
    phoneNumber: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: '',
    address: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Registration successful! You can now login.');
      navigate('/login/worker');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-amber-950">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Users className="size-8 text-white" />
              </div>
              <div>
                <h1 className="dark:text-white text-indigo-900">LabourLink</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Existing Worker Registration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeLanguageToggle />
              <Button variant="ghost" onClick={() => navigate('/login/worker')}>
                <ArrowLeft className="size-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 dark:bg-gray-800">
          <div className="text-center mb-8">
            <div className="bg-amber-100 dark:bg-amber-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="size-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="mb-2 dark:text-white">Existing Worker Registration</h2>
            <p className="text-gray-600 dark:text-gray-400">Register to access worker services and support</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
              <h4 className="text-amber-800 dark:text-amber-300 mb-2">👤 Worker Registration</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                This registration is for migrant workers currently employed in Sri Lanka. If you are seeking employment, please register as a Job Seeker instead.
              </p>
            </div>

            <h4 className="dark:text-white">Personal Information</h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name (as per passport) *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Full legal name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <select
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="">Select nationality</option>
                  <option value="india">India</option>
                  <option value="bangladesh">Bangladesh</option>
                  <option value="pakistan">Pakistan</option>
                  <option value="philippines">Philippines</option>
                  <option value="nepal">Nepal</option>
                  <option value="myanmar">Myanmar</option>
                  <option value="indonesia">Indonesia</option>
                  <option value="thailand">Thailand</option>
                  <option value="china">China</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="passportNumber">Passport Number *</Label>
                <Input
                  id="passportNumber"
                  name="passportNumber"
                  placeholder="Passport no."
                  value={formData.passportNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="nic">NIC/ID Number</Label>
                <Input
                  id="nic"
                  name="nic"
                  placeholder="National ID"
                  value={formData.nic}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <hr className="dark:border-gray-700" />

            <h4 className="dark:text-white">Employment Information</h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAgency">Current Agency *</Label>
                <Input
                  id="currentAgency"
                  name="currentAgency"
                  placeholder="Recruitment agency name"
                  value={formData.currentAgency}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="workplace">Workplace/Employer *</Label>
                <Input
                  id="workplace"
                  name="workplace"
                  placeholder="Company or employer name"
                  value={formData.workplace}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Job Position *</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Your job title"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contractStartDate">Contract Start Date *</Label>
                <Input
                  id="contractStartDate"
                  name="contractStartDate"
                  type="date"
                  value={formData.contractStartDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Employment Contract Document</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="size-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload contract (optional, PDF or Image)</p>
                <Button type="button" variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>

            <hr className="dark:border-gray-700" />

            <h4 className="dark:text-white">Contact Information</h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+94 XX XXX XXXX"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Current Address in Sri Lanka *</Label>
              <Input
                id="address"
                name="address"
                placeholder="Complete address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  placeholder="Contact person name"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  type="tel"
                  placeholder="Emergency phone number"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <hr className="dark:border-gray-700" />

            <h4 className="dark:text-white">Account Security</h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))}
              />
              <Label htmlFor="acceptTerms" className="cursor-pointer text-sm">
                I confirm that all information provided is accurate and I agree to the{' '}
                <a href="#" className="text-amber-600 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>. I understand my rights as a worker in Sri Lanka.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? 'Creating Account...' : 'Create Worker Account'}
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/login/worker" className="text-amber-600 hover:underline">
              Login here
            </a>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Looking for a job?{' '}
            <a href="/register/jobseeker" className="text-purple-600 hover:underline">
              Register as Job Seeker
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
