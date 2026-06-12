import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Briefcase, MapPin, DollarSign, Search,
  Filter, Clock, ChevronRight, Building2, X,
} from 'lucide-react';
import { workerService, type WorkerJob } from '@/services/workerService';

const CATEGORIES = ['All', 'Construction', 'Manufacturing', 'Domestic', 'Agriculture', 'Hospitality', 'Transport', 'Other'];

export default function WorkerBrowseJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<WorkerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = 'Browse Jobs — LabourLink';
    loadJobs();
  }, []);

  async function loadJobs(params?: { search?: string; category?: string; location?: string }) {
    setLoading(true);
    setError(null);
    try {
      const result = await workerService.browseJobs({
        search: params?.search || undefined,
        category: params?.category && params.category !== 'All' ? params.category : undefined,
        location: params?.location || undefined,
      });
      setJobs(Array.isArray(result) ? result : []);
    } catch {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    loadJobs({ search, category, location });
  }

  function clearFilters() {
    setSearch('');
    setCategory('All');
    setLocation('');
    loadJobs();
  }

  const hasFilters = search || category !== 'All' || location;

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate('/worker')}
            className="flex items-center gap-2 text-amber-100 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="size-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <Briefcase className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Browse Jobs</h1>
              <p className="text-amber-100 text-sm">Find opportunities that match your skills</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/95 dark:bg-gray-800 rounded-xl px-3 py-2.5 shadow">
              <Search className="size-4 text-gray-400 flex-shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search by job title or keyword…"
                className="flex-1 text-sm bg-transparent text-gray-800 dark:text-gray-200 outline-none placeholder-gray-400"
              />
              {search && (
                <button onClick={() => { setSearch(''); }} className="text-gray-400 hover:text-gray-600">
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                showFilters || category !== 'All' || location
                  ? 'bg-white text-amber-700'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Filter className="size-4" /> Filter
            </button>
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-amber-800/50 hover:bg-amber-800/70 text-white text-sm font-medium rounded-xl transition"
            >
              Search
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-3 bg-white/95 dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Location</label>
                  <input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Colombo, Kandy…"
                    className="w-full text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">
                  Clear filters
                </button>
                <button
                  onClick={() => { handleSearch(); setShowFilters(false); }}
                  className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-1.5 rounded-lg transition"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-5xl overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => { setCategory(c); loadJobs({ search, category: c, location }); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  category === c
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-amber-100 hover:text-amber-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
            <span className="text-gray-500">Filters:</span>
            {search && <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">"{search}"</span>}
            {category !== 'All' && <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">{category}</span>}
            {location && <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">{location}</span>}
            <button onClick={clearFilters} className="text-gray-400 hover:text-red-500 transition">✕ Clear all</button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <Briefcase className="size-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">No jobs found</p>
            <p className="text-sm text-gray-400 mt-1">Try different keywords or clear filters.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-4 text-sm text-amber-600 hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {jobs.map(job => (
                <button
                  key={job.jobId}
                  onClick={() => navigate(`/worker/jobs/${job.jobId}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 text-left hover:shadow-md hover:border-amber-200 dark:hover:border-amber-700 transition group"
                >
                  {/* Agency + category */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-9 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="size-4 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{job.agency?.name ?? 'Agency'}</p>
                        {job.category && (
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{job.category}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-gray-300 group-hover:text-amber-500 flex-shrink-0 mt-1 transition" />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2.5 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition line-clamp-2">
                    {job.title}
                  </h3>

                  {/* Details */}
                  <div className="space-y-1.5">
                    {job.location && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="size-3 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                    )}
                    {(job.salaryMin || job.salaryMax) && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <DollarSign className="size-3 flex-shrink-0" />
                        <span>
                          {job.salaryMin && job.salaryMax
                            ? `LKR ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}`
                            : `LKR ${(job.salaryMin || job.salaryMax)!.toLocaleString()}`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="size-3 flex-shrink-0" />
                      <span>{new Date(job.postedDate).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {job.employmentType && (
                        <>
                          <span className="mx-1">·</span>
                          <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                            {job.employmentType}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
