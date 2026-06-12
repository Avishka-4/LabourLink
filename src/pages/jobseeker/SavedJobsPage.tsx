import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Bookmark, BookmarkX, Briefcase, MapPin,
  DollarSign, Calendar, Search, ChevronRight, Trash2,
} from 'lucide-react';
import { jobSeekerService } from '@/services/jobSeekerService';
import type { SavedJobResponse } from '@/types/api.types';
import { toast } from 'sonner';

function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Salary not listed';
  const fmt = (n: number) =>
    n >= 1000 ? `LKR ${(n / 1000).toFixed(0)}k` : `LKR ${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="size-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="flex gap-3 mt-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SavedJobsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<SavedJobResponse[]>([]);
  const [search, setSearch] = useState('');
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = 'Saved Jobs — LabourLink';
    jobSeekerService.getSavedJobs()
      .then(items => setJobs(Array.isArray(items) ? items : []))
      .catch(() => toast.error('Failed to load saved jobs.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(j =>
      j.title.toLowerCase().includes(q) ||
      (j.location ?? '').toLowerCase().includes(q)
    );
  }, [jobs, search]);

  const handleUnsave = async (jobId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRemoving(prev => new Set(prev).add(jobId));
    setJobs(prev => prev.filter(j => j.jobId !== jobId));
    try {
      await jobSeekerService.unsaveJob(jobId);
      toast.success(`"${title}" removed from saved jobs.`);
    } catch {
      toast.error('Failed to remove. Please try again.');
      jobSeekerService.getSavedJobs()
        .then(items => setJobs(Array.isArray(items) ? items : []))
        .catch(() => {});
    } finally {
      setRemoving(prev => { const s = new Set(prev); s.delete(jobId); return s; });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-100 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft className="size-4" /> Back
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Bookmark className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Saved Jobs</h1>
              <p className="text-purple-100 text-sm mt-0.5">
                {loading ? 'Loading…' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} saved`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-purple-300" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search saved jobs by title or location…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/20 text-white placeholder-purple-300 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        {/* Search result count */}
        {search && !loading && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {filtered.length === 0
              ? `No saved jobs matching "${search}"`
              : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`}
          </p>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-20 text-center">
            <div className="inline-flex p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl mb-4">
              <Bookmark className="size-10 text-purple-300 dark:text-purple-600" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
              {search ? 'No matching saved jobs' : 'No saved jobs yet'}
            </p>
            <p className="text-sm text-gray-400 mt-1.5">
              {search
                ? 'Try a different search term.'
                : 'Browse jobs and tap the bookmark icon to save them here.'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/jobseeker/jobs')}
                className="mt-5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
              >
                Browse Jobs
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(job => (
              <div
                key={job.jobId}
                onClick={() => navigate(`/jobseeker/jobs/${job.jobId}`)}
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="size-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="size-5 text-purple-600 dark:text-purple-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-purple-700 dark:group-hover:text-purple-400 transition truncate">
                          {job.title}
                        </h2>
                        {job.location && (
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            <MapPin className="size-3 flex-shrink-0" />
                            {job.location}
                          </span>
                        )}
                      </div>

                      {/* Unsave button */}
                      <button
                        onClick={e => handleUnsave(job.jobId, job.title, e)}
                        disabled={removing.has(job.jobId)}
                        title="Remove from saved"
                        className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-40"
                      >
                        {removing.has(job.jobId)
                          ? <BookmarkX className="size-4 animate-pulse" />
                          : <Trash2 className="size-4" />}
                      </button>
                    </div>

                    {/* Chips row */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <DollarSign className="size-3" />
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                      <span className="text-gray-200 dark:text-gray-600">·</span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="size-3" />
                        Saved {timeAgo(job.savedDate)}
                      </span>
                      <span className="text-gray-200 dark:text-gray-600">·</span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        Posted {timeAgo(job.postedDate)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="size-4 text-gray-300 group-hover:text-purple-400 flex-shrink-0 mt-1 transition" />
                </div>
              </div>
            ))}

            {/* Summary footer */}
            <div className="flex items-center justify-between pt-3 pb-1">
              <p className="text-xs text-gray-400">
                {filtered.length} saved job{filtered.length !== 1 ? 's' : ''}
                {search ? ` matching "${search}"` : ''}
              </p>
              <button
                onClick={() => navigate('/jobseeker/jobs')}
                className="text-xs text-purple-600 hover:underline font-medium"
              >
                Browse more jobs →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
