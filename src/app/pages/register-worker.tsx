import { useRef, useState } from 'react';
import { Users, Upload, ArrowLeft, X, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ThemeLanguageToggle } from '../components/theme-language-toggle';
import { authService } from '@/services/authService';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://labourlink-backend-env.eba-fjpwzbyr.ap-south-1.elasticbeanstalk.com/api';

async function uploadDoc(token: string, key: DocKey, file: File): Promise<void> {
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

const ACCEPTED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp']);
const MAX_SIZE_MB = 5;

type DocKey = 'passport' | 'nic' | 'workPermit' | 'contract';

interface DocSlot {
  key: DocKey;
  label: string;
  required: boolean;
  hint: string;
}

const DOC_SLOTS: DocSlot[] = [
  { key: 'passport',   label: 'Passport Bio-data Page',   required: true,  hint: 'Clear scan of the photo page (PDF or image, max 5 MB)' },
  { key: 'nic',        label: 'NIC / National ID',         required: false, hint: 'Front and back as one file (optional)' },
  { key: 'workPermit', label: 'Work Permit / Visa',        required: false, hint: 'Current valid permit or visa (optional)' },
  { key: 'contract',   label: 'Employment Contract',       required: false, hint: 'Signed contract document (optional)' },
];

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

  const [docs, setDocs] = useState<Partial<Record<DocKey, File>>>({});
  const fileRefs: Record<DocKey, React.RefObject<HTMLInputElement | null>> = {
    passport:   useRef<HTMLInputElement>(null),
    nic:        useRef<HTMLInputElement>(null),
    workPermit: useRef<HTMLInputElement>(null),
    contract:   useRef<HTMLInputElement>(null),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (key: DocKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    if (!ACCEPTED_EXTENSIONS.has(ext)) {
      toast.error(`${file.name}: only PDF, JPG, PNG or WEBP files are accepted`);
      e.target.value = '';
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`${file.name}: file must be smaller than ${MAX_SIZE_MB} MB`);
      e.target.value = '';
      return;
    }
    setDocs(prev => ({ ...prev, [key]: file }));
  };

  const removeDoc = (key: DocKey) => {
    setDocs(prev => { const next = { ...prev }; delete next[key]; return next; });
    const ref = fileRefs[key];
    if (ref.current) ref.current.value = '';
  };

  const [uploadStatus, setUploadStatus] = useState('');

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

    if (!docs.passport) {
      toast.error('Passport bio-data page is required');
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
        role: 'Worker',
        phoneNumber: formData.phoneNumber,
      });

      setUploadStatus('Signing in…');
      const session = await authService.login(formData.email, formData.password);

      const entries = Object.entries(docs) as [DocKey, File][];
      for (let i = 0; i < entries.length; i++) {
        const [key, file] = entries[i];
        setUploadStatus(`Uploading ${key} (${i + 1}/${entries.length})…`);
        await uploadDoc(session.token, key, file);
      }

      toast.success('Registration complete! Welcome to LabourLink.');
      navigate('/worker');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
      setUploadStatus('');
    }
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
                  <option value="srilankan">Sri Lankan</option>
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

            <hr className="dark:border-gray-700" />

            <h4 className="dark:text-white">Supporting Documents</h4>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
              Passport scan is required. Other documents help speed up verification. PDF, JPG, PNG — max 5 MB each.
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {DOC_SLOTS.map(({ key, label, required, hint }) => {
                const file = docs[key];
                return (
                  <div key={key}>
                    <Label className="mb-1 block">
                      {label} {required && <span className="text-red-500">*</span>}
                    </Label>
                    <input
                      ref={fileRefs[key]}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => handleFileChange(key, e)}
                    />
                    {file ? (
                      <div className="flex items-center gap-2 border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                        <CheckCircle className="size-4 text-green-600 flex-shrink-0" />
                        <FileText className="size-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm truncate flex-1 text-gray-700 dark:text-gray-300">{file.name}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                        <button
                          type="button"
                          onClick={() => removeDoc(key)}
                          className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                          aria-label="Remove file"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRefs[key].current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-500 rounded-lg p-4 text-center transition group"
                      >
                        <Upload className="size-5 mx-auto mb-1 text-gray-400 group-hover:text-amber-500" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
                      </button>
                    )}
                  </div>
                );
              })}
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
                <a href="#" className="text-amber-600 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>. I understand my rights as a worker in Sri Lanka.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {uploadStatus || 'Creating Account…'}
                </span>
              ) : 'Create Worker Account'}
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