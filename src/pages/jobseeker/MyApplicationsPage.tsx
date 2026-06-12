import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Briefcase, Calendar, Building2,
  ArrowLeft, Clock, CheckCircle, XCircle, Star,
  ClipboardList,
} from 'lucide-react';
import { jobSeekerService } from '@/services/jobSeekerService';
import type { JobApplicationListResponse } from '@/types/api.types';

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  accepted:   { label: 'Accepted',   color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: CheckCircle },
  hired:      { label: 'Hired',      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: CheckCircle },
  interview:  { label: 'Interview',  color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',     icon: Star },
  pending:    { label: 'Pending',    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',         icon: Clock },
  submitted:  { label: 'Submitted',  color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',         icon: Clock },
  reviewing:  { label: 'Reviewing',  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',             icon: Clock },
  rejected:   { label: 'Rejected',   color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',                 icon: XCircle },
  withdrawn:  { label: 'Withdrawn',  color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',                icon: XCircle },
};

function getStatus(s: string) {
  return STATUS_MAP[s.toLowerCase()] ?? STATUS_MAP['pending'];
}

type TabFilter = 'all' | 'active' | 'accepted' | 'rejected';
const TAB_LABELS: Record<TabFilter, string> = {
  all: 'All',
  active: 'Active',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplicationListResponse[]>([]);
  const [tab, setTab] = useState<TabFilter>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'My Applications — LabourLink';
    jobSeekerService.getApplications()
      .then(items => setApplications(Array.isArray(items) ? items : []))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(a => {
    const s = a.status.toLowerCase();
    if (tab === 'all') return true;
    if (tab === 'active') return ['pending', 'submitted', 'reviewing', 'interview'].includes(s);
    if (tab === 'accepted') return ['accepted', 'hired'].includes(s);
    if (tab === 'rejected') return s === 'rejected';
    return true;
  });

  const counts: Record<TabFilter, number> = {
    all: applications.length,
    active: applications.filter(a => ['pending', 'submitted', 'reviewing', 'interview'].includes(a.status.toLowerCase())).length,
    accepted: applications.filter(a => ['accepted', 'hired'].includes(a.status.toLowerCase())).length,
    rejected: applications.filter(a => a.status.toLowerCase() === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 sm:px-6 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="h-6 bg-white/20 rounded w-32 mb-4 animate-pulse" />
            <div className="h-8 bg-white/20 rounded w-48 animate-pulse" />
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 space-y-3">
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-100 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <ClipboardList className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Applications</h1>
              <p className="text-purple-100 text-sm">{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-5">
            {(Object.keys(TAB_LABELS) as TabFilter[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                  tab === t
                    ? 'bg-white text-purple-700 shadow'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {TAB_LABELS[t]}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-purple-100 text-purple-700' : 'bg-white/20 text-white'}`}>
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400 mb-4">
            {error}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <ClipboardList className="size-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
              {tab === 'all' ? 'No applications yet' : `No ${TAB_LABELS[tab].toLowerCase()} applications`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {tab === 'all' ? 'Browse jobs and start applying.' : 'Switch to "All" to see all applications.'}
            </p>
            {tab === 'all' && (
              <button
                onClick={() => navigate('/jobseeker/jobs')}
                className="mt-4 text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Browse Jobs
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered
              .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
              .map(app => {
                const cfg = getStatus(app.status);
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={app.applicationId}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="size-11 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="size-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0">
                            <h2 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{app.jobTitle}</h2>
                            {app.agencyName && (
                              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                <Building2 className="size-3" /> {app.agencyName}
                              </span>
                            )}
                          </div>
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${cfg.color}`}>
                            <StatusIcon className="size-3" />
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="size-3" />
                            Applied {new Date(app.appliedDate).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {app.responseDate && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <CheckCircle className="size-3" />
                              Response {new Date(app.responseDate).toLocaleDateString('en-LK', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
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