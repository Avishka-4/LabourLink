import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, MapPin, Briefcase, Clock, DollarSign,
  Bookmark, BookmarkCheck, ChevronRight, SlidersHorizontal,
  Building2, Calendar, Eye,
} from 'lucide-react';
import { jobSeekerService } from '@/services/jobSeekerService';
import type { JobSearchResponse } from '@/types/api.types';
import { toast } from 'sonner';

const FILTERS = ['All', 'FullTime', 'PartTime', 'Contract', 'Temporary'] as const;
type Filter = typeof FILTERS[number];

const FILTER_LABELS: Record<Filter, string> = {
  All: 'All Jobs',
  FullTime: 'Full-time',
  PartTime: 'Part-time',
  Contract: 'Contract',
  Temporary: 'Temporary',
};

function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Salary not specified';
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
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function JobCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function BrowseJobsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [jobs, setJobs] = useState<JobSearchResponse[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadJobs = useCallback(async (q?: string) => {
    try {
      const results = await jobSeekerService.searchJobs(q ? { search: q } : undefined);
      setJobs(Array.isArray(results) ? results : []);
    } catch {
      toast.error('Failed to load jobs. Please try again.');
    }
  }, []);

  useEffect(() => {
    document.title = 'Browse Jobs — LabourLink';
    (async () => {
      await loadJobs();
      setLoading(false);
    })();
  }, [loadJobs]);

  const handleSearch = async () => {
    setSearchLoading(true);
    await loadJobs(search.trim() || undefined);
    setSearchLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSave = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (savingId) return;
    setSavingId(jobId);
    try {
      await jobSeekerService.saveJob(jobId);
      setSavedIds(prev => new Set([...prev, jobId]));
      toast.success('Job saved!');
    } catch {
      toast.error('Failed to save job.');
    } finally {
      setSavingId(null);
    }
  };

  const filtered = filter === 'All'
    ? jobs
    : jobs.filter(j => j.employmentType?.toLowerCase().replace(/[^a-z]/g, '') === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero search section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-purple-200 hover:text-white text-sm mb-5 transition"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Find Your Next Job</h1>
          <p className="text-purple-100 text-sm mb-6">Browse opportunities from verified agencies</p>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Job title, keyword, or company…"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border-0 focus:ring-2 focus:ring-white/50 outline-none shadow-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-5 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition text-sm shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {searchLoading ? (
                <span className="size-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <SlidersHorizontal className="size-4 text-gray-400 flex-shrink-0" />
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                filter === f
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:text-purple-700 dark:hover:text-purple-300'
              }`}
            >
              {FILTER_LABELS[f]}
              {f !== 'All' && !loading && (
                <span className={`ml-1.5 ${filter === f ? 'text-purple-200' : 'text-gray-400'}`}>
                  {jobs.filter(j => j.employmentType?.toLowerCase().replace(/[^a-z]/g, '') === f.toLowerCase()).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filtered.length}</span> {filtered.length === 1 ? 'job' : 'jobs'}
            {search && ` for "${search}"`}
          </p>
        )}

        {/* Job cards */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <Briefcase className="size-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">No jobs found</p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? 'Try different keywords or clear the search.' : 'Check back later for new opportunities.'}
            </p>
            {search && (
              <button
                onClick={() => { setSearch(''); loadJobs(); }}
                className="mt-4 text-sm text-purple-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(job => {
              const isSaved = savedIds.has(job.jobId);
              return (
                <div
                  key={job.jobId}
                  onClick={() => navigate(`/jobseeker/jobs/${job.jobId}`)}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700 transition-all cursor-pointer relative"
                >
                  {/* Save button */}
                  <button
                    onClick={e => handleSave(e, job.jobId)}
                    disabled={isSaved || savingId === job.jobId}
                    className={`absolute top-4 right-4 p-1.5 rounded-lg transition ${
                      isSaved
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-300 hover:text-purple-500 dark:text-gray-600 dark:hover:text-purple-400'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                  </button>

                  {/* Company + title */}
                  <div className="flex items-start gap-3 mb-3 pr-8">
                    <div className="size-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="size-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug truncate group-hover:text-purple-700 dark:group-hover:text-purple-300 transition">
                        {job.title}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {job.agency?.name ?? 'Recruitment Agency'}
                      </p>
                    </div>
                  </div>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {job.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded-md">
                        <MapPin className="size-2.5" /> {job.location}
                      </span>
                    )}
                    {job.employmentType && (
                      <span className="inline-flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md">
                        <Briefcase className="size-2.5" /> {job.employmentType}
                      </span>
                    )}
                  </div>

                  {/* Salary */}
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 mb-3">
                    <DollarSign className="size-3" />
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="size-3" />
                      {timeAgo(job.postedDate)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-medium group-hover:gap-2 transition-all">
                      View details <ChevronRight className="size-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}