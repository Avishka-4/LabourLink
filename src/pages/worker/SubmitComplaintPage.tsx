import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  ArrowLeft, AlertTriangle, FileText, Building2,
  Upload, X, CheckCircle,
} from 'lucide-react';
import { workerService } from '@/services/workerService';

const COMPLAINT_TYPES = [
  { value: 'WagetheftIssue', label: 'Wage Theft / Non-Payment', icon: '💰' },
  { value: 'WorkplaceSafety', label: 'Workplace Safety', icon: '⚠️' },
  { value: 'Harassment', label: 'Harassment or Abuse', icon: '🚨' },
  { value: 'Discrimination', label: 'Discrimination', icon: '⚖️' },
  { value: 'ContractViolation', label: 'Contract Violation', icon: '📄' },
  { value: 'WorkingConditions', label: 'Working Conditions', icon: '🏭' },
  { value: 'Other', label: 'Other Issue', icon: '📝' },
];

export default function SubmitComplaintPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: '',
    title: '',
    description: '',
    targetAgencyName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.title = 'Submit Complaint — LabourLink';
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.type) e.type = 'Please select a complaint type';
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setError(null);
    try {
      await workerService.submitComplaint({
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim(),
        targetAgencyName: form.targetAgencyName.trim() || undefined,
      });
      setSubmitted(true);
      toast.success('Complaint submitted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 text-center max-w-md w-full">
          <div className="size-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="size-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Complaint Submitted</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your complaint has been received and will be reviewed by our team. You can track the status in "My Complaints".
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/worker/complaints')}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm py-2.5 rounded-xl transition"
            >
              View My Complaints
            </button>
            <button
              onClick={() => navigate('/worker')}
              className="flex-1 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm py-2.5 rounded-xl transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-100 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <AlertTriangle className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">File a Complaint</h1>
              <p className="text-amber-100 text-sm">Your complaint is confidential and will be reviewed promptly</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Complaint Type */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Complaint Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMPLAINT_TYPES.map(ct => (
                <button
                  key={ct.value}
                  type="button"
                  onClick={() => update('type', ct.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center text-xs font-medium transition ${
                    form.type === ct.value
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-2 border-amber-400 dark:border-amber-600'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:border-amber-200 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                  }`}
                >
                  <span className="text-xl">{ct.icon}</span>
                  {ct.label}
                </button>
              ))}
            </div>
            {errors.type && <p className="text-xs text-red-500 mt-2">{errors.type}</p>}
          </div>

          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Provide a brief, clear summary of your complaint</p>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="e.g., Unpaid wages for March 2026"
              maxLength={255}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${
                errors.title ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
              <span className="text-xs text-gray-400 ml-auto">{form.title.length}/255</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Include dates, names, locations, and any other relevant details. The more specific you are, the faster we can help.
            </p>
            <textarea
              id="description"
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe what happened, when it happened, and who was involved…"
              rows={6}
              maxLength={2000}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none ${
                errors.description ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
              <span className="text-xs text-gray-400 ml-auto">{form.description.length}/2000</span>
            </div>
          </div>

          {/* Agency Name (optional) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="size-4 text-amber-600" />
              <label htmlFor="agencyName" className="text-sm font-semibold text-gray-900 dark:text-white">
                Agency / Company Name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              If your complaint is about a specific agency or employer, enter their name here. This helps us forward your complaint to the right party.
            </p>
            <input
              id="agencyName"
              type="text"
              value={form.targetAgencyName}
              onChange={e => update('targetAgencyName', e.target.value)}
              placeholder="e.g., ABC Recruitment Agency"
              maxLength={255}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          {/* Info box */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              <strong>Your privacy matters.</strong> All complaints are treated confidentially.
              The LabourLink team will review your complaint and take appropriate action.
              If you entered an agency name, they may be contacted for their response.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <AlertTriangle className="size-4" />
                Submit Complaint
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}