import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, AlertTriangle, Clock, CheckCircle,
  User, Calendar, Shield, FileText, Tag, CheckCheck, X,
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';

type AgencyComplaint = {
  complaintId: string;
  title: string;
  type: string;
  status: string;
  workerName?: string | null;
  resolutionNotes?: string | null;
  workerRating?: number | null;
  resolvedAt?: string | null;
  createdAt: string;
};

function StarBadge({ rating }: { rating: number }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
      rating === 5
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    }`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      <span className="ml-1">{rating === 5 ? 'Satisfied' : 'Unsatisfied'}</span>
    </span>
  );
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  submitted:   { label: 'Submitted',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',           icon: FileText },
  underreview: { label: 'Under Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',       icon: Clock },
  inprogress:  { label: 'In Progress',  color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',       icon: Clock },
  resolved:    { label: 'Resolved',     color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: CheckCircle },
  closed:      { label: 'Closed',       color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',               icon: Shield },
};

function getStatus(s: string) {
  const key = s.toLowerCase().replace(/[^a-z]/g, '');
  return STATUS_MAP[key] ?? { label: s, color: 'bg-amber-100 text-amber-700', icon: Clock };
}

const TYPE_LABELS: Record<string, string> = {
  wagetheftissue: 'Wage Theft',
  workplacesafety: 'Workplace Safety',
  harassment: 'Harassment',
  discrimination: 'Discrimination',
  contractviolation: 'Contract Violation',
  workingconditions: 'Working Conditions',
  other: 'Other',
};

function formatType(t: string): string {
  return TYPE_LABELS[t.toLowerCase().replace(/[^a-z]/g, '')] ?? t;
}

type TabFilter = 'all' | 'active' | 'resolved';

type ResolveModal = { complaintId: string; title: string } | null;

export default function AgencyComplaintsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<AgencyComplaint[]>([]);
  const [tab, setTab] = useState<TabFilter>('all');
  const [error, setError] = useState<string | null>(null);
  const [resolveModal, setResolveModal] = useState<ResolveModal>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = 'Worker Complaints — LabourLink';
    agencyService.getComplaints()
      .then((items: any[]) => setComplaints(Array.isArray(items) ? items : []))
      .catch(() => setError('Failed to load complaints.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (resolveModal) {
      setResolutionText('');
      setSubmitError(null);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [resolveModal]);

  const filtered = complaints.filter(c => {
    const s = c.status.toLowerCase().replace(/[^a-z]/g, '');
    if (tab === 'all') return true;
    if (tab === 'active') return !['resolved', 'closed'].includes(s);
    if (tab === 'resolved') return ['resolved', 'closed'].includes(s);
    return true;
  });

  const counts = {
    all: complaints.length,
    active: complaints.filter(c => !['resolved', 'closed'].includes(c.status.toLowerCase().replace(/[^a-z]/g, ''))).length,
    resolved: complaints.filter(c => ['resolved', 'closed'].includes(c.status.toLowerCase().replace(/[^a-z]/g, ''))).length,
  };

  async function handleResolve() {
    if (!resolveModal || !resolutionText.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await agencyService.resolveComplaint(resolveModal.complaintId, resolutionText.trim());
      setComplaints(prev => prev.map(c =>
        c.complaintId === resolveModal.complaintId
          ? { ...c, status: 'Resolved', resolutionNotes: resolutionText.trim(), resolvedAt: new Date().toISOString() }
          : c
      ));
      setResolveModal(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to mark complaint as resolved. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function isActive(status: string) {
    return !['resolved', 'closed'].includes(status.toLowerCase().replace(/[^a-z]/g, ''));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-red-600 to-rose-500 px-4 sm:px-6 py-8">
          <div className="mx-auto max-w-4xl animate-pulse space-y-3">
            <div className="h-4 bg-white/20 rounded w-24" />
            <div className="h-8 bg-white/20 rounded w-56" />
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
      <div className="bg-gradient-to-r from-red-600 to-rose-500 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-red-100 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <AlertTriangle className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Worker Complaints</h1>
              <p className="text-red-100 text-sm">
                {complaints.length === 0
                  ? 'No complaints received'
                  : `${complaints.length} complaint${complaints.length !== 1 ? 's' : ''} directed to your agency`}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-5">
            {(['all', 'active', 'resolved'] as TabFilter[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                  tab === t
                    ? 'bg-white text-red-700 shadow'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-red-100 text-red-700' : 'bg-white/20 text-white'}`}>
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

        {/* Info banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <strong>How this works:</strong> When a worker files a complaint against your agency, it appears here.
            You can mark a complaint as resolved with a description of how it was addressed.
            Workers will be asked to confirm satisfaction or reopen the case if unresolved.
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <CheckCircle className="size-12 mx-auto mb-3 text-emerald-400" />
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
              {tab === 'all' ? 'No complaints received' : `No ${tab} complaints`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {tab === 'all'
                ? 'Worker complaints directed to your agency will appear here.'
                : `Switch to "All" to see all complaints.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(item => {
                const cfg = getStatus(item.status);
                const StatusIcon = cfg.icon;
                const active = isActive(item.status);
                return (
                  <div
                    key={item.complaintId}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-sm transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="size-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h2>
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${cfg.color}`}>
                            <StatusIcon className="size-3" />
                            {cfg.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Tag className="size-3" /> {formatType(item.type)}
                          </span>
                          {item.workerName && (
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <User className="size-3" /> {item.workerName}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="size-3" />
                            {new Date(item.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Resolution notes + worker rating (shown when resolved) */}
                        {!active && (
                          <div className="mt-3 space-y-2">
                            {item.resolutionNotes && (
                              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
                                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">Your resolution:</p>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">{item.resolutionNotes}</p>
                              </div>
                            )}
                            {item.workerRating != null && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Worker feedback:</span>
                                <StarBadge rating={item.workerRating} />
                              </div>
                            )}
                            {item.workerRating == null && item.resolutionNotes && (
                              <p className="text-xs text-gray-400 italic">Awaiting worker feedback…</p>
                            )}
                          </div>
                        )}

                        {/* Resolve button for active complaints */}
                        {active && (
                          <div className="mt-3">
                            <button
                              onClick={() => setResolveModal({ complaintId: item.complaintId, title: item.title })}
                              className="inline-flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg transition"
                            >
                              <CheckCheck className="size-3.5" /> Mark as Resolved
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {resolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                  <CheckCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Mark as Resolved</h2>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">{resolveModal.title}</p>
                </div>
              </div>
              <button
                onClick={() => setResolveModal(null)}
                className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How was this complaint resolved? <span className="text-red-500">*</span>
                </label>
                <textarea
                  ref={textareaRef}
                  value={resolutionText}
                  onChange={e => setResolutionText(e.target.value)}
                  rows={5}
                  placeholder="Describe the steps taken to resolve this complaint. For example: 'We reviewed the worker's wage records and issued the missing payment of LKR 25,000. We have also updated our payroll process to prevent future occurrences.'"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 p-3 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent leading-relaxed"
                />
                <p className="text-xs text-gray-400 mt-1.5">{resolutionText.trim().length} characters — be specific so the worker understands what action was taken.</p>
              </div>

              {submitError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-xs text-red-700 dark:text-red-400">
                  {submitError}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                  The worker will be notified and asked to confirm whether they are satisfied with the resolution or wish to reopen the case.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setResolveModal(null)}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={submitting || !resolutionText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition"
              >
                {submitting ? (
                  <>
                    <span className="size-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <CheckCheck className="size-4" /> Mark Resolved
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
