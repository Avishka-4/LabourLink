import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AlertTriangle, Plus, ArrowLeft, Clock, CheckCircle,
  ChevronRight, FileText, Calendar, Shield, Bell, RotateCcw,
} from 'lucide-react';
import { workerService } from '@/services/workerService';
import type { ComplaintItem } from '@/services/workerService';

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  submitted:   { label: 'Submitted',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',            icon: FileText },
  underreview: { label: 'Under Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',        icon: Clock },
  inprogress:  { label: 'In Progress',  color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',        icon: Clock },
  resolved:    { label: 'Resolved',     color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: CheckCircle },
  closed:      { label: 'Closed',       color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',               icon: Shield },
};

function getStatus(s: string) {
  const key = s.toLowerCase().replace(/[^a-z]/g, '');
  return STATUS_MAP[key] ?? { label: s, color: 'bg-amber-100 text-amber-700', icon: Clock };
}

function isAwaitingResponse(item: ComplaintItem) {
  const s = item.status.toLowerCase().replace(/[^a-z]/g, '');
  return s === 'resolved' && !!item.resolutionNotes;
}

type TabFilter = 'all' | 'active' | 'resolved';

export default function MyComplaintsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [tab, setTab] = useState<TabFilter>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'My Complaints — LabourLink';
    workerService.getComplaints()
      .then(items => setComplaints(Array.isArray(items) ? items : []))
      .catch(() => setError('Failed to load complaints.'))
      .finally(() => setLoading(false));
  }, []);

  const awaitingResponse = complaints.filter(isAwaitingResponse);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-4 sm:px-6 py-8">
          <div className="mx-auto max-w-4xl animate-pulse space-y-3">
            <div className="h-4 bg-white/20 rounded w-24" />
            <div className="h-8 bg-white/20 rounded w-48" />
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
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-100 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <AlertTriangle className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Complaints</h1>
                <p className="text-amber-100 text-sm">
                  {complaints.length} total submission{complaints.length !== 1 ? 's' : ''}
                  {awaitingResponse.length > 0 && (
                    <span className="ml-2 bg-white text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {awaitingResponse.length} need{awaitingResponse.length === 1 ? 's' : ''} your response
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/worker/complaints/new')}
              className="flex items-center gap-2 bg-white text-amber-700 hover:bg-amber-50 font-semibold text-sm px-4 py-2.5 rounded-xl transition"
            >
              <Plus className="size-4" /> New Complaint
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-5">
            {(['all', 'active', 'resolved'] as TabFilter[]).map(t => (
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

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 space-y-5">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ───── ACTION REQUIRED BANNER ───── */}
        {awaitingResponse.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-bounce">
                <Bell className="size-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">
                  {awaitingResponse.length === 1
                    ? '1 complaint needs your response!'
                    : `${awaitingResponse.length} complaints need your response!`}
                </h3>
                <p className="text-emerald-100 text-xs">The agency has resolved your complaint — tell them if you're satisfied or want to reopen</p>
              </div>
            </div>
            <div className="space-y-2">
              {awaitingResponse.map(item => (
                <button
                  key={item.complaintId}
                  onClick={() => navigate(`/worker/complaints/${item.complaintId}`)}
                  className="w-full flex items-center justify-between gap-3 bg-white/15 hover:bg-white/25 rounded-xl px-4 py-3 transition text-left group"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-white truncate">{item.title}</p>
                    {item.targetAgencyName && (
                      <p className="text-xs text-emerald-100 truncate">Agency: {item.targetAgencyName}</p>
                    )}
                    <p className="text-xs text-emerald-200 mt-0.5 line-clamp-1 italic">
                      "{item.resolutionNotes}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs bg-white text-emerald-700 font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                      Tap to Respond
                    </span>
                    <ChevronRight className="size-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <AlertTriangle className="size-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
              {tab === 'all' ? 'No complaints submitted yet' : `No ${tab} complaints`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {tab === 'all' ? 'Use the button above to file a complaint.' : `Switch to "All" to see all complaints.`}
            </p>
            {tab === 'all' && (
              <button
                onClick={() => navigate('/worker/complaints/new')}
                className="mt-4 text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
              >
                Submit Complaint
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered
              .sort((a, b) => {
                // Sort: awaiting response first, then by date
                const aWaiting = isAwaitingResponse(a) ? 1 : 0;
                const bWaiting = isAwaitingResponse(b) ? 1 : 0;
                if (aWaiting !== bWaiting) return bWaiting - aWaiting;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map(item => {
                const cfg = getStatus(item.status);
                const StatusIcon = cfg.icon;
                const needsAction = isAwaitingResponse(item);

                return (
                  <div
                    key={item.complaintId}
                    onClick={() => navigate(`/worker/complaints/${item.complaintId}`)}
                    className={`rounded-2xl p-5 transition-all cursor-pointer group ${
                      needsAction
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-400 dark:border-emerald-600 hover:shadow-md hover:shadow-emerald-100'
                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-700'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`size-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        needsAction
                          ? 'bg-emerald-200 dark:bg-emerald-800'
                          : 'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        {needsAction
                          ? <RotateCcw className="size-5 text-emerald-700 dark:text-emerald-300 animate-pulse" />
                          : <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0">
                            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h2>
                            {item.targetAgencyName && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Agency: {item.targetAgencyName}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {needsAction && (
                              <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                                Response Needed
                              </span>
                            )}
                            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${cfg.color}`}>
                              <StatusIcon className="size-3" />
                              {cfg.label}
                            </span>
                          </div>
                        </div>

                        {/* Resolution preview */}
                        {needsAction && item.resolutionNotes && (
                          <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-emerald-200 dark:border-emerald-700">
                            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-0.5">Agency's response:</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                              {item.resolutionNotes}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="size-3" />
                            {new Date(item.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          {item.updatedAt && item.updatedAt !== item.createdAt && (
                            <span className="text-xs text-gray-400">
                              · Updated {new Date(item.updatedAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`size-4 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 ${
                        needsAction ? 'text-emerald-500' : 'text-gray-300'
                      }`} />
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
