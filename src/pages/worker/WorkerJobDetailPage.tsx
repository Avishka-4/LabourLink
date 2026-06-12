import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Building2, MapPin, DollarSign, Clock,
  Briefcase, Users, Globe, Mail, Phone, CheckCircle,
  AlertTriangle, Send,
} from 'lucide-react';
import { workerService, type WorkerJobDetail } from '@/services/workerService';

export default function WorkerJobDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState<WorkerJobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    document.title = 'Job Detail — LabourLink';
    if (!id) { setLoading(false); return; }
    workerService.getJob(id)
      .then(j => setJob(j))
      .catch(() => setError('Failed to load job details.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleApply() {
    if (!id) return;
    setApplying(true);
    setApplyError(null);
    try {
      await workerService.applyToJob(id, { coverLetter: coverLetter.trim() || undefined, resumeUrl: resumeUrl.trim() || undefined });
      setApplied(true);
      setShowApplyModal(false);
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-4 sm:px-6 py-8">
          <div className="mx-auto max-w-3xl animate-pulse space-y-3">
            <div className="h-4 bg-white/20 rounded w-24" />
            <div className="h-7 bg-white/20 rounded w-60" />
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 animate-pulse space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center max-w-sm w-full border border-gray-100 dark:border-gray-700">
          <AlertTriangle className="size-10 mx-auto mb-3 text-red-400" />
          <p className="font-semibold text-gray-800 dark:text-gray-200">{error ?? 'Job not found'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-amber-600 hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const deadline = job.deadlineDate ? new Date(job.deadlineDate) : null;
  const isExpired = deadline && deadline < new Date();

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-100 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="size-4" /> Back to Jobs
          </button>
          <div className="flex items-start gap-4">
            <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="size-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-amber-100 text-sm">{job.agency?.name}</p>
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5">{job.title}</h1>
              <div className="flex flex-wrap gap-3 mt-2">
                {job.location && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-100">
                    <MapPin className="size-3" /> {job.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-amber-100">
                  <Briefcase className="size-3" /> {job.employmentType}
                </span>
                {job.category && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-100">
                    <Clock className="size-3" /> {job.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-5">
        {/* Apply action card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {(job.salaryMin > 0 || job.salaryMax > 0) && (
                <div className="flex items-center gap-1.5 text-lg font-bold text-gray-900 dark:text-white mb-1">
                  <DollarSign className="size-4 text-amber-500" />
                  LKR {job.salaryMin.toLocaleString()} – {job.salaryMax.toLocaleString()}
                </div>
              )}
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Users className="size-3" /> {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}</span>
                <span className="flex items-center gap-1"><Clock className="size-3" /> Posted {new Date(job.postedDate).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                {deadline && (
                  <span className={`flex items-center gap-1 ${isExpired ? 'text-red-500' : 'text-amber-600'}`}>
                    {isExpired ? '⚠ Deadline passed' : `Deadline: ${deadline.toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </span>
                )}
              </div>
            </div>

            {applied ? (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 px-4 py-2.5 rounded-xl text-sm font-medium">
                <CheckCircle className="size-4" /> Application Submitted
              </div>
            ) : (
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={!!isExpired}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
              >
                <Send className="size-4" /> Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Job Description</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Agency info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">About the Agency</h2>
          <div className="flex items-start gap-4 mb-4">
            <div className="size-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="size-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{job.agency?.name}</h3>
              {job.agency?.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{job.agency.description}</p>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {job.agency?.website && (
              <a href={job.agency.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-700">
                <Globe className="size-3.5" /> {job.agency.website}
              </a>
            )}
            {job.agency?.email && (
              <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Mail className="size-3.5" /> {job.agency.email}
              </span>
            )}
            {job.agency?.phoneNumber && (
              <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Phone className="size-3.5" /> {job.agency.phoneNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
                  <Send className="size-4 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Apply for this Job</h2>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">{job.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Cover Letter <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder="Briefly describe your experience and why you're suitable for this role…"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 p-3 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Resume URL <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  value={resumeUrl}
                  onChange={e => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/…"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>

              {applyError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-xs text-red-700 dark:text-red-400">
                  {applyError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setShowApplyModal(false)}
                disabled={applying}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="inline-flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition"
              >
                {applying ? (
                  <>
                    <span className="size-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="size-4" /> Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
