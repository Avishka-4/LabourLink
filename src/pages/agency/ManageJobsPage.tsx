import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  Plus, Briefcase, Eye, Users, Edit2, Trash2,
  ChevronRight, ArrowLeft, Clock, CheckCircle, XCircle,
  Filter,
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';

type JobItem = {
  id: string;
  title: string;
  status: string;
  applicationCount: number;
  viewCount: number;
  postedDate?: string;
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  published: { label: 'Published', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  draft:     { label: 'Draft',     color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  closed:    { label: 'Closed',    color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  pending:   { label: 'Pending',   color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
};

function getStatus(s: string) {
  return STATUS_MAP[s.toLowerCase()] ?? { label: s, color: 'bg-gray-100 text-gray-600' };
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString('en-LK', { day: 'numeric', month: 'short' });
}

type TabFilter = 'all' | 'published' | 'draft' | 'closed';

export default function ManageJobsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [tab, setTab] = useState<TabFilter>('all');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Manage Jobs — LabourLink';
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const response = await agencyService.getJobs();
      setJobs((response as any[]).map((job: any) => ({
        id: job.jobId,
        title: job.title,
        status: job.status,
        applicationCount: job.applicationCount ?? 0,
        viewCount: job.viewCount ?? 0,
        postedDate: job.postedDate,
      })));
    } catch {
      toast.error('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    setDeleteLoading(id);
    try {
      await agencyService.deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
      toast.success('Job deleted successfully.');
    } catch {
      toast.error('Failed to delete job.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filtered = tab === 'all' ? jobs : jobs.filter(j => j.status.toLowerCase() === tab);

  const counts = {
    all: jobs.length,
    published: jobs.filter(j => j.status.toLowerCase() === 'published').length,
    draft: jobs.filter(j => j.status.toLowerCase() === 'draft').length,
    closed: jobs.filter(j => j.status.toLowerCase() === 'closed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-4 sm:px-6 py-8">
          <div className="mx-auto max-w-5xl animate-pulse space-y-3">
            <div className="h-4 bg-white/20 rounded w-24" />
            <div className="h-8 bg-white/20 rounded w-48" />
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-100 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Briefcase className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Manage Jobs</h1>
                <p className="text-emerald-100 text-sm">{jobs.length} job posting{jobs.length !== 1 ? 's' : ''} total</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/agency/jobs/new')}
              className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold text-sm px-4 py-2.5 rounded-xl transition"
            >
              <Plus className="size-4" /> Post New Job
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-5">
            {(['all', 'published', 'draft', 'closed'] as TabFilter[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                  tab === t
                    ? 'bg-white text-emerald-700 shadow'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-emerald-100 text-emerald-700' : 'bg-white/20 text-white'}`}>
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <Briefcase className="size-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
              {tab === 'all' ? 'No jobs posted yet' : `No ${tab} jobs`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {tab === 'all' ? 'Create your first job posting to start receiving applications.' : `Switch to "All" to see all jobs.`}
            </p>
            {tab === 'all' && (
              <button
                onClick={() => navigate('/agency/jobs/new')}
                className="mt-4 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Post a Job
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(job => {
              const cfg = getStatus(job.status);
              return (
                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-sm transition">
                  <div className="flex items-start gap-4">
                    <div className="size-11 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="size-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                          <h2 className="font-semibold text-gray-900 dark:text-white truncate">{job.title}</h2>
                          {job.postedDate && (
                            <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <Clock className="size-3" /> Posted {timeAgo(job.postedDate)}
                            </span>
                          )}
                        </div>
                        <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Users className="size-3.5" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{job.applicationCount}</span> applications
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Eye className="size-3.5" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{job.viewCount}</span> views
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={() => navigate(`/agency/jobs/${job.id}/applications`)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                        >
                          <Users className="size-3" />
                          View Applications
                          {job.applicationCount > 0 && (
                            <span className="bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded-full">{job.applicationCount}</span>
                          )}
                        </button>
                        <button
                          onClick={() => navigate(`/agency/jobs/${job.id}/edit`)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                        >
                          <Edit2 className="size-3" /> Edit
                        </button>
                        <button
                          disabled={deleteLoading !== null}
                          onClick={() => handleDelete(job.id, job.title)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition disabled:opacity-50"
                        >
                          {deleteLoading === job.id ? (
                            <span className="size-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="size-3" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
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
