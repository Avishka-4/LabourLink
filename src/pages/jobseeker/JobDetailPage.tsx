import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import {
  ArrowLeft, MapPin, Briefcase, DollarSign, Clock,
  Calendar, Building2, Globe, Mail, Phone,
  Bookmark, BookmarkCheck, CheckCircle, Users,
  AlertCircle,
} from 'lucide-react';
import { jobService } from '@/services/jobService';
import { jobSeekerService } from '@/services/jobSeekerService';
import type { JobDetailResponse } from '@/types/api.types';

function formatSalary(min: number, max: number): string {
  if (!min && !max) return 'Not specified';
  const fmt = (n: number) =>
    n >= 1000 ? `LKR ${(n / 1000).toFixed(0)}k` : `LKR ${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} / month`;
  if (min) return `From ${fmt(min)} / month`;
  return `Up to ${fmt(max)} / month`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function JobDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobDetailResponse | null>(null);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Job Details — LabourLink';
    if (!id) { setLoading(false); return; }
    jobService.getById(id)
      .then(result => setJob(result))
      .catch(() => setError('Failed to load job details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    try {
      await jobSeekerService.applyToJob(job.jobId, {});
      setApplied(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to apply.');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!job || saved) return;
    setSaving(true);
    try {
      await jobSeekerService.saveJob(job.jobId);
      setSaved(true);
      toast.success('Job saved to your list!');
    } catch {
      toast.error('Failed to save job.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="size-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading job details…</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center max-w-sm w-full border border-gray-100 dark:border-gray-700">
          <AlertCircle className="size-10 mx-auto mb-3 text-red-400" />
          <p className="font-semibold text-gray-800 dark:text-gray-200">{error ?? 'Job not found'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-purple-600 hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = job.deadlineDate
    ? new Date(job.deadlineDate) < new Date()
    : false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-100 hover:text-white text-sm mb-5 transition"
          >
            <ArrowLeft className="size-4" /> Back to Jobs
          </button>

          <div className="flex items-start gap-4">
            <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Briefcase className="size-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">{job.title}</h1>
              <p className="text-purple-100 text-sm mt-1">{job.agency?.name ?? 'Recruitment Agency'}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                {job.location && (
                  <span className="flex items-center gap-1.5 text-xs text-purple-100">
                    <MapPin className="size-3" /> {job.location}
                  </span>
                )}
                {job.employmentType && (
                  <span className="flex items-center gap-1.5 text-xs text-purple-100">
                    <Briefcase className="size-3" /> {job.employmentType}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-purple-100">
                  <Clock className="size-3" /> Posted {timeAgo(job.postedDate)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-purple-100">
                  <Users className="size-3" /> {job.applicationCount} applicants
                </span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={handleApply}
              disabled={applied || applying || isDeadlinePassed}
              className="flex items-center gap-2 bg-white text-purple-700 hover:bg-purple-50 font-semibold text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {applying ? (
                <span className="size-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              ) : applied ? (
                <CheckCircle className="size-4" />
              ) : null}
              {applied ? 'Applied!' : isDeadlinePassed ? 'Deadline Passed' : 'Apply Now'}
            </button>
            <button
              onClick={handleSave}
              disabled={saved || saving}
              className="flex items-center gap-2 bg-purple-700/40 hover:bg-purple-700/60 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-60"
            >
              {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              {saved ? 'Saved' : 'Save Job'}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Job Overview</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: DollarSign, label: 'Salary', value: formatSalary(job.salaryMin, job.salaryMax), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                  { icon: MapPin, label: 'Location', value: job.location || 'Not specified', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { icon: Briefcase, label: 'Employment', value: job.employmentType || 'Not specified', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                  { icon: Calendar, label: 'Deadline', value: job.deadlineDate ? new Date(job.deadlineDate).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Open', color: isDeadlinePassed ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400', bg: isDeadlinePassed ? 'bg-red-50 dark:bg-red-900/20' : 'bg-amber-50 dark:bg-amber-900/20' },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-4 flex items-start gap-3`}>
                    <Icon className={`size-4 ${color} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                      <p className={`text-sm font-semibold ${color} mt-0.5`}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Job Description</h2>
              <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {job.description || 'No description provided.'}
              </div>
            </div>

            {/* Benefits */}
            {job.category && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Category</h2>
                <span className="inline-flex items-center gap-1.5 text-sm text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                  <Briefcase className="size-3.5" />
                  {job.category}
                </span>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Agency info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Building2 className="size-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{job.agency?.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Recruitment Agency</p>
                </div>
              </div>

              {job.agency?.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{job.agency.description}</p>
              )}

              <div className="space-y-2">
                {job.agency?.email && (
                  <a href={`mailto:${job.agency.email}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-purple-600 transition">
                    <Mail className="size-3.5 flex-shrink-0" /> {job.agency.email}
                  </a>
                )}
                {job.agency?.phoneNumber && (
                  <a href={`tel:${job.agency.phoneNumber}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-purple-600 transition">
                    <Phone className="size-3.5 flex-shrink-0" /> {job.agency.phoneNumber}
                  </a>
                )}
                {job.agency?.website && (
                  <a href={job.agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-purple-600 hover:underline">
                    <Globe className="size-3.5 flex-shrink-0" /> Visit website
                  </a>
                )}
              </div>
            </div>

            {/* Apply CTA */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-5">
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">Interested?</p>
              <p className="text-xs text-purple-700 dark:text-purple-400 mb-4">Apply now to be among the first candidates reviewed.</p>
              <button
                onClick={handleApply}
                disabled={applied || applying || isDeadlinePassed}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm py-2.5 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {applying ? 'Submitting…' : applied ? '✓ Applied!' : isDeadlinePassed ? 'Deadline Passed' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}