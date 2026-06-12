import { useRef, useState } from 'react';
import { Building2, Upload, Users, ArrowLeft, CheckCircle, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ThemeLanguageToggle } from '../components/theme-language-toggle';
import { authService } from '@/services/authService';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5007/api';
const ACCEPTED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp']);
const MAX_SIZE_MB = 5;

type AgencyDocKey = 'businessReg' | 'bankGuarantee';

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

export function AgencyRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [step, setStep] = useState(1);
  const [docs, setDocs] = useState<Partial<Record<AgencyDocKey, File>>>({});
  const businessRegRef = useRef<HTMLInputElement>(null);
  const bankGuaranteeRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    agencyName: '',
    sltdaNumber: '',
    businessRegNumber: '',
    businessType: '',
    capitalAmount: '',
    address: '',
    district: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (key: AgencyDocKey, ref: React.RefObject<HTMLInputElement | null>, e: React.ChangeEvent<HTMLInputElement>) => {
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

  const removeDoc = (key: AgencyDocKey, ref: React.RefObject<HTMLInputElement | null>) => {
    setDocs(prev => { const next = { ...prev }; delete next[key]; return next; });
    if (ref.current) ref.current.value = '';
  };

  const handleSltdaVerification = async () => {
    if (!formData.sltdaNumber || formData.sltdaNumber.length < 8) {
      toast.error('Please enter a valid SLTDA registration number');
      return;
    }

    setIsLoading(true);
    // Simulate SLTDA verification
    setTimeout(() => {
      setIsLoading(false);
      toast.success('SLTDA registration verified successfully!');
      setStep(2);
    }, 2000);
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

    if (!docs.businessReg) {
      toast.error('Business Registration Certificate is required');
      return;
    }

    if (!docs.bankGuarantee) {
      toast.error('Bank Guarantee document is required');
      return;
    }

    setIsLoading(true);
    try {
      setUploadStatus('Creating account…');
      await authService.register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: formData.agencyName,
        role: 'RecruitmentAgency',
        phoneNumber: formData.phone,
      });

      setUploadStatus('Signing in…');
      const session = await authService.login(formData.email, formData.password);

      const entries = Object.entries(docs) as [AgencyDocKey, File][];
      for (let i = 0; i < entries.length; i++) {
        const [key, file] = entries[i];
        setUploadStatus(`Uploading document ${i + 1}/${entries.length}…`);
        await uploadDoc(session.token, key, file);
      }

      toast.success('Registration submitted for admin approval!');
      navigate('/agency');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-emerald-950">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Users className="size-8 text-white" />
              </div>
              <div>
                <h1 className="dark:text-white text-indigo-900">LabourLink</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Agency Registration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeLanguageToggle />
              <Button variant="ghost" onClick={() => navigate('/login/agency')}>
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
            <div className="bg-emerald-100 dark:bg-emerald-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="size-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="mb-2 dark:text-white">Agency Registration</h2>
            <p className="text-gray-600 dark:text-gray-400">Register your travel agency with LabourLink</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  1
                </div>
                <span className="text-sm">SLTDA Verification</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  2
                </div>
                <span className="text-sm">Agency Details</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  3
                </div>
                <span className="text-sm">Documents & Account</span>
              </div>
            </div>
          </div>

          {/* Step 1: SLTDA Verification */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <h4 className="text-amber-800 dark:text-amber-300 mb-2">📋 SLTDA Registration Requirements</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                  Travel agencies in Sri Lanka must be verified and registered with the Sri Lanka Tourism Development Authority (SLTDA) to operate legally.
                </p>
                <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
                  <li>Valid SLTDA registration number required</li>
                  <li>Business registration documentation</li>
                  <li>Bank guarantee (original) submission</li>
                  <li>Capital requirements: Rs. 1 million+ for limited liability companies</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="sltdaNumber">SLTDA Registration Number *</Label>
                <Input
                  id="sltdaNumber"
                  name="sltdaNumber"
                  placeholder="Enter your SLTDA registration number"
                  value={formData.sltdaNumber}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Example: SLTDA/TA/2024/001234
                </p>
              </div>

              <div>
                <Label htmlFor="agencyName">Agency Name *</Label>
                <Input
                  id="agencyName"
                  name="agencyName"
                  placeholder="Registered agency name"
                  value={formData.agencyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                onClick={handleSltdaVerification}
                disabled={isLoading || !formData.sltdaNumber || !formData.agencyName}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? 'Verifying...' : 'Verify SLTDA Registration'}
              </Button>
            </div>
          )}

          {/* Step 2: Agency Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                <CheckCircle className="size-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-green-800 dark:text-green-300 mb-1">SLTDA Verification Successful</h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    SLTDA Number: {formData.sltdaNumber}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessRegNumber">Business Registration Number *</Label>
                  <Input
                    id="businessRegNumber"
                    name="businessRegNumber"
                    placeholder="BR Number"
                    value={formData.businessRegNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="llc">Limited Liability Company</option>
                    <option value="partnership">Partnership</option>
                    <option value="sole">Sole Proprietorship</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="capitalAmount">Capital Amount (LKR) *</Label>
                <Input
                  id="capitalAmount"
                  name="capitalAmount"
                  type="number"
                  placeholder="Minimum Rs. 1,000,000 for LLC"
                  value={formData.capitalAmount}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Limited liability companies require minimum Rs. 1 million capital
                </p>
              </div>

              <div>
                <Label htmlFor="address">Registered Address *</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Complete business address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="district">District *</Label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="">Select district</option>
                  <option value="colombo">Colombo</option>
                  <option value="gampaha">Gampaha</option>
                  <option value="kalutara">Kalutara</option>
                  <option value="kandy">Kandy</option>
                  <option value="matale">Matale</option>
                  <option value="nuwara-eliya">Nuwara Eliya</option>
                  <option value="galle">Galle</option>
                  <option value="matara">Matara</option>
                  <option value="hambantota">Hambantota</option>
                  <option value="jaffna">Jaffna</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.businessRegNumber || !formData.businessType || !formData.capitalAmount}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Continue to Documents
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Documents & Account */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h4 className="text-blue-800 dark:text-blue-300 mb-2">📄 Required Documents</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                  Please prepare the following documents for upload:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>✓ Business Registration Certificate (scanned copy)</li>
                  <li>✓ SLTDA Registration Certificate</li>
                  <li>✓ Bank Guarantee (original document)</li>
                  <li>✓ Company Articles of Association</li>
                  <li>✓ Tax Registration Certificate</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {([
                  { key: 'businessReg' as AgencyDocKey, label: 'Business Registration Certificate', ref: businessRegRef },
                  { key: 'bankGuarantee' as AgencyDocKey, label: 'Bank Guarantee (Original)', ref: bankGuaranteeRef },
                ] as const).map(({ key, label, ref }) => {
                  const file = docs[key];
                  return (
                    <div key={key}>
                      <Label className="mb-1 block">{label} <span className="text-red-500">*</span></Label>
                      <input
                        ref={ref}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => handleFileChange(key, ref, e)}
                      />
                      {file ? (
                        <div className="flex items-center gap-2 border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                          <CheckCircle className="size-4 text-green-600 flex-shrink-0" />
                          <FileText className="size-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm truncate flex-1 text-gray-700 dark:text-gray-300">{file.name}</span>
                          <span className="text-xs text-gray-400 flex-shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                          <button type="button" onClick={() => removeDoc(key, ref)} className="text-gray-400 hover:text-red-500 transition" aria-label="Remove">
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => ref.current?.click()}
                          className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-400 rounded-lg p-4 text-center transition group"
                        >
                          <Upload className="size-5 mx-auto mb-1 text-gray-400 group-hover:text-emerald-500" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">PDF or image, max 5 MB</p>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <hr className="dark:border-gray-700" />

              <h4 className="dark:text-white">Contact Person & Account Details</h4>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person Name *</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    placeholder="Full name"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+94 XX XXX XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="agency@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

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
                  <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>. I understand that my registration will be verified by LabourLink administrators.
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      {uploadStatus || 'Submitting…'}
                    </span>
                  ) : 'Submit Registration'}
                </Button>
              </div>
            </form>
          )}
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/login/agency" className="text-emerald-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
