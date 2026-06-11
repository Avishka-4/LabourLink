import { useRef, useState } from 'react';
import { Briefcase, Upload, ArrowLeft, Users, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Textarea } from '../components/ui/textarea';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ThemeLanguageToggle } from '../components/theme-language-toggle';
import { authService } from '@/services/authService';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5007/api';
const ACCEPTED_CV_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);
const MAX_SIZE_MB = 5;

async function uploadDoc(token: string, key: string, file: File): Promise<void> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('documentType', key);
  const res = await fetch(`${API_BASE}/upload/document`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error(`Failed to upload ${key}`);
}

export function JobSeekerRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    passportNumber: '',
    nic: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    currentCountry: '',
    currentCity: '',
    preferredJobType: '',
    preferredLocation: '',
    experienceYears: '',
    educationLevel: '',
    skills: '',
    languages: '',
    expectedSalary: '',
    availableFrom: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    if (!ACCEPTED_CV_EXTENSIONS.has(ext)) {
      toast.error(`${file.name}: only PDF, DOC or DOCX files are accepted for CV`);
      e.target.value = '';
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`${file.name}: file must be smaller than ${MAX_SIZE_MB} MB`);
      e.target.value = '';
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      toast.error('Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number');
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      setUploadStatus('Creating account…');
      await authService.register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: formData.fullName,
        role: 'JobSeeker',
        phoneNumber: formData.phoneNumber,
      });

      setUploadStatus('Signing in…');
      const session = await authService.login(formData.email, formData.password);

      if (cvFile) {
        setUploadStatus('Uploading CV…');
        await uploadDoc(session.token, 'cv', cvFile);
      }

      toast.success('Registration successful! You can now browse jobs.');
      navigate('/jobseeker');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-900 dark:to-purple-950">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Users className="size-8 text-white" />
              </div>
              <div>
                <h1 className="dark:text-white text-indigo-900">LabourLink</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Job Seeker Registration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeLanguageToggle />
              <Button variant="ghost" onClick={() => navigate('/login/jobseeker')}>
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
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="size-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="mb-2 dark:text-white">Job Seeker Registration</h2>
            <p className="text-gray-600 dark:text-gray-400">Create your profile and start applying for jobs in Sri Lanka</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
              <h4 className="text-purple-800 dark:text-purple-300 mb-2">🔍 Job Seeker Registration</h4>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Register as a job seeker to browse and apply for employment opportunities in Sri Lanka. If you are already employed, please register as an Existing Worker instead.
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

            <h4 className="dark:text-white">Current Location</h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentCountry">Current Country *</Label>
                <Input
                  id="currentCountry"
                  name="currentCountry"
                  placeholder="Country where you are now"
                  value={formData.currentCountry}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="currentCity">Current City</Label>
                <Input
                  id="currentCity"
                  name="currentCity"
                  placeholder="City"
                  value={formData.currentCity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr className="dark:border-gray-700" />

            <h4 className="dark:text-white">Job Preferences</h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredJobType">Preferred Job Type *</Label>
                <select
                  id="preferredJobType"
                  name="preferredJobType"
                  value={formData.preferredJobType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="">Select job type</option>
                  <option value="construction">Construction Worker</option>
                  <option value="housekeeping">Housekeeping/Domestic</option>
                  <option value="hospitality">Hospitality & Tourism</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="driver">Driver</option>
                  <option value="security">Security</option>
                  <option value="healthcare">Healthcare Support</option>
                  <option value="retail">Retail/Sales</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="preferredLocation">Preferred Location in Sri Lanka *</Label>
                <select
                  id="preferredLocation"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="">Select location</option>
                  <option value="colombo">Colombo</option>
                  <option value="gampaha">Gampaha</option>
                  <option value="kalutara">Kalutara</option>
                  <option value="kandy">Kandy</option>
                  <option value="galle">Galle</option>
                  <option value="matara">Matara</option>
                  <option value="anywhere">Anywhere in Sri Lanka</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experienceYears">Years of Experience *</Label>
                <select
                  id="experienceYears"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="">Select experience</option>
                  <option value="0">No experience</option>
                  <option value="1">Less than 1 year</option>
                  <option value="2">1-2 years</option>
                  <option value="3">3-5 years</option>
                  <option value="5">5+ years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>

              <div>
                <Label htmlFor="educationLevel">Education Level *</Label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="">Select education</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                  <option value="high">High School</option>
                  <option value="diploma">Diploma/Certificate</option>
                  <option value="degree">Bachelor's Degree</option>
                  <option value="masters">Master's Degree or Higher</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="skills">Skills & Qualifications</Label>
              <Textarea
                id="skills"
                name="skills"
                placeholder="List your relevant skills, certifications, and qualifications (e.g., welding, cooking, driving license, etc.)"
                value={formData.skills}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="languages">Languages Spoken *</Label>
              <Input
                id="languages"
                name="languages"
                placeholder="e.g., English, Sinhala, Tamil, Hindi"
                value={formData.languages}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedSalary">Expected Monthly Salary (LKR)</Label>
                <Input
                  id="expectedSalary"
                  name="expectedSalary"
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="availableFrom">Available From *</Label>
                <Input
                  id="availableFrom"
                  name="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label className="mb-1 block">Resume / CV <span className="text-gray-400 text-xs">(optional — PDF, DOC, DOCX, max 5 MB)</span></Label>
              <input
                ref={cvRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleCvChange}
              />
              {cvFile ? (
                <div className="flex items-center gap-2 border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                  <CheckCircle className="size-4 text-green-600 flex-shrink-0" />
                  <FileText className="size-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm truncate flex-1 text-gray-700 dark:text-gray-300">{cvFile.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{(cvFile.size / 1024).toFixed(0)} KB</span>
                  <button
                    type="button"
                    onClick={() => { setCvFile(null); if (cvRef.current) cvRef.current.value = ''; }}
                    className="text-gray-400 hover:text-red-500 transition"
                    aria-label="Remove CV"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => cvRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 rounded-lg p-4 text-center transition group"
                >
                  <Upload className="size-5 mx-auto mb-1 text-gray-400 group-hover:text-purple-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload your resume</p>
                </button>
              )}
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
                  placeholder="With country code"
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must include uppercase, lowercase, and a number</p>
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
                <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>. I understand that LabourLink will help connect me with verified employment agencies.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {uploadStatus || 'Creating Account…'}
                </span>
              ) : 'Create Job Seeker Account'}
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/login/jobseeker" className="text-purple-600 hover:underline">
              Login here
            </a>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Already employed?{' '}
            <a href="/register/worker" className="text-amber-600 hover:underline">
              Register as Existing Worker
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}