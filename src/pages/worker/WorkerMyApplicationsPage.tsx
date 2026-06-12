import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Briefcase, Clock, CheckCircle,
  XCircle, AlertTriangle, Building2, Calendar,
} from 'lucide-react';
import { workerService, type WorkerApplication } from '@/services/workerService';

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending:     { label: 'Pending',      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',       icon: Clock },
  shortlisted: { label: 'Shortlisted',  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',           icon: Clock },
  underreview: { label: 'Under Review', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',           icon: Clock },
  accepted:    { label: 'Accepted',     color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: CheckCircle },
  rejected:    { label: 'Rejected',     color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',               icon: XCircle },
  withdrawn:   { label: 'Withdrawn',    color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',              icon: AlertTriangle },
};

function getStatus(s: string) {
  const key = s.toLowerCase().replace(/[^a-z]/g, '');
  return STATUS_MAP[key] ?? { label: s, color: 'bg-gray-100 text-gray-600', icon: Clock };
}

type TabFilter = 'all' | 'active' | 'accepted' | 'rejected';

export default function WorkerMyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<WorkerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabFilter>('all');

  useEffect(() => {
    document.title = 'My Applications — LabourLink';
    workerService.getApplications()
      .then(data => setApplications(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load your applications.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(a => {
    const s = a.status.toLowerCase().replace(/[^a-z]/g, '');
    if (tab === 'all') return true;
    if (tab === 'active') return !['accepted', 'rejected', 'withdrawn'].includes(s);
    if (tab === 'accepted') return s === 'accepted';
    if (tab === 'rejected') return ['rejected', 'withdrawn'].includes(s);
    return true;
  });

  const counts = {
    all: applications.length,
    active: applications.filter(a => !['accepted', 'rejected', 'withdrawn'].includes(a.status.toLowerCase().replace(/[^a-z]/g, ''))).length,
    accepted: applications.filter(a => a.status.toLowerCase().replace(/[^a-z]/g, '') === 'accepted').length,
    rejected: applications.filter(a => ['rejected', 'withdrawn'].includes(a.status.toLowerCase().replace(/[^a-z]/g, ''))).length,
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-3xl">
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
              <h1 className="text-2xl font-bold text-white">My Applications</h1>
              <p className="text-amber-100 text-sm">
                {applications.length === 0
                  ? 'No applications yet'
                  : `${applications.length} application${applications.length !== 1 ? 's' : ''} submitted`}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'accepted', 'rejected'] as TabFilter[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                  tab === t
                    ? 'bg-white text-amber-700 shadow'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-amber-100 text-amber-700' : 'bg-white/20 text-white'}`}>
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <Briefcase className="size-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
              {tab === 'all' ? 'No applications yet' : `No ${tab} applications`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {tab === 'all'
                ? 'Browse available jobs and apply to get started.'
                : 'Switch to "All" to see everything.'}
            </p>
            {tab === 'all' && (
              <button
                onClick={() => navigate('/worker/jobs')}
                className="mt-4 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
              >
                <Briefcase className="size-4" /> Browse Jobs
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => {
              const cfg = getStatus(app.status);
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={app.applicationId}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="size-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="size-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <h2 className="font-semibold text-gray-900 dark:text-white text-sm">{app.jobTitle}</h2>
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${cfg.color}`}>
                          <StatusIcon className="size-3" />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {app.agencyName && (
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Building2 className="size-3" /> {app.agencyName}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="size-3" />
                          Applied {new Date(app.appliedDate).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {app.responseDate && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="size-3" />
                            Response {new Date(app.responseDate).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}
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
