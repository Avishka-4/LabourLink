import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, AlertTriangle, Clock, CheckCircle,
  FileText, Calendar, Tag, Shield, Building2,
  ThumbsUp, RotateCcw,
} from 'lucide-react';
import { workerService } from '@/services/workerService';

type ComplaintDetail = {
  complaintId: string;
  title: string;
  type: string;
  description: string;
  status: string;
  attachmentUrl?: string | null;
  resolutionNotes?: string | null;
  workerRating?: number | null;
  createdAt: string;
  updatedAt?: string | null;
  history?: { updatedAt: string; updateNotes?: string }[];
};

function StarDisplay({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-3xl' : 'text-xl';
  return (
    <span className={`${sz} tracking-wide`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}>★</span>
      ))}
    </span>
  );
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  submitted:    { label: 'Submitted',     color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',           icon: FileText },
  underreview:  { label: 'Under Review',  color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',       icon: Clock },
  inprogress:   { label: 'In Progress',   color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',       icon: Clock },
  resolved:     { label: 'Resolved',      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: CheckCircle },
  closed:       { label: 'Closed',        color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',               icon: Shield },
};

function getStatus(s: string) {
  const key = s.toLowerCase().replace(/[^a-z]/g, '');
  return STATUS_MAP[key] ?? { label: s, color: 'bg-amber-100 text-amber-700', icon: Clock };
}

const TYPE_LABELS: Record<string, string> = {
  workplace: 'Workplace Safety',
  wage: 'Wage Issue',
  harassment: 'Harassment',
  discrimination: 'Discrimination',
  other: 'Other',
  wagetheft: 'Wage Theft',
  workplacesafety: 'Workplace Safety',
};

function formatType(t: string): string {
  return TYPE_LABELS[t.toLowerCase().replace(/[^a-z]/g, '')] ?? t;
}

const STEPS = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];

function StatusTimeline({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/[^a-z]/g, '');
  const stepMap: Record<string, number> = { submitted: 0, underreview: 1, inprogress: 2, resolved: 3, closed: 3 };
  const current = stepMap[key] ?? 0;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((step, i) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold z-10 relative ${
              i <= current
                ? 'bg-amber-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <p className={`text-xs mt-1.5 text-center ${i <= current ? 'text-amber-700 dark:text-amber-300 font-medium' : 'text-gray-400'}`}>
              {step}
            </p>
          </div>
        ))}
      </div>
      <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0">
        <div
          className="h-full bg-amber-500 transition-all"
          style={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function ComplaintDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ComplaintDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState<'satisfied' | 'reopen' | null>(null);
  const [respondError, setRespondError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Complaint Detail — LabourLink';
    if (!id) { setLoading(false); return; }
    workerService.getComplaint(id)
      .then((r: any) => setDetail({
        complaintId: r.complaintId,
        title: r.title,
        type: r.type ?? 'Other',
        description: r.description,
        status: r.status,
        attachmentUrl: r.attachmentUrl,
        resolutionNotes: r.resolutionNotes ?? null,
        workerRating: r.workerRating ?? null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        history: r.history ?? [],
      }))
      .catch(() => setError('Failed to load complaint.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleRespond(action: 'satisfied' | 'reopen') {
    if (!detail) return;
    setResponding(action);
    setRespondError(null);
    try {
      await workerService.respondToComplaint(detail.complaintId, action);
      setDetail(prev => prev ? {
        ...prev,
        status: action === 'satisfied' ? 'Closed' : 'InProgress',
        resolutionNotes: action === 'reopen' ? null : prev.resolutionNotes,
        workerRating: action === 'satisfied' ? 5 : 1,
      } : prev);
    } catch {
      setRespondError('Failed to submit your response. Please try again.');
    } finally {
      setResponding(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-4 sm:px-6 py-8">
          <div className="mx-auto max-w-3xl animate-pulse space-y-3">
            <div className="h-4 bg-white/20 rounded w-24" />
            <div className="h-7 bg-white/20 rounded w-60" />
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center max-w-sm w-full border border-gray-100 dark:border-gray-700">
          <AlertTriangle className="size-10 mx-auto mb-3 text-red-400" />
          <p className="font-semibold text-gray-800 dark:text-gray-200">{error ?? 'Complaint not found'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-amber-600 hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const cfg = getStatus(detail.status);
  const StatusIcon = cfg.icon;
  const statusKey = detail.status.toLowerCase().replace(/[^a-z]/g, '');
  const isResolved = statusKey === 'resolved';
  const isClosed = statusKey === 'closed';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-100 hover:text-white text-sm mb-4 transition"
          >
            <ArrowLeft className="size-4" /> Back to Complaints
          </button>
          <div className="flex items-start gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0">
              <AlertTriangle className="size-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">{detail.title}</h1>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-amber-100">
                  <Tag className="size-3" /> {formatType(detail.type)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-amber-100">
                  <Calendar className="size-3" />
                  {new Date(detail.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${cfg.color}`}>
              <StatusIcon className="size-3" />
              {cfg.label}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-5">
        {/* Status timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Status Progress</h2>
          <StatusTimeline status={detail.status} />
        </div>

        {/* Agency resolution section — shown when resolved */}
        {isResolved && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="size-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">Agency has marked this as Resolved</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Please review their response below</p>
              </div>
            </div>

            {detail.resolutionNotes ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Resolution Description:</p>
                <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {detail.resolutionNotes}
                </p>
              </div>
            ) : (
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-4 italic">
                No resolution details provided by the agency.
              </p>
            )}

            {respondError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-xs text-red-700 dark:text-red-400 mb-4">
                {respondError}
              </div>
            )}

            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-3">
              Are you satisfied with this resolution?
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleRespond('satisfied')}
                disabled={responding !== null}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition"
              >
                {responding === 'satisfied' ? (
                  <span className="size-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <ThumbsUp className="size-4" />
                )}
                Yes, I'm Satisfied — Close Case
              </button>
              <button
                onClick={() => handleRespond('reopen')}
                disabled={responding !== null}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-amber-300 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed text-amber-700 dark:text-amber-400 text-sm font-medium rounded-xl transition"
              >
                {responding === 'reopen' ? (
                  <span className="size-3.5 border-2 border-amber-400/40 border-t-amber-500 rounded-full animate-spin" />
                ) : (
                  <RotateCcw className="size-4" />
                )}
                No, Reopen the Case
              </button>
            </div>
          </div>
        )}

        {/* Closed confirmation */}
        {isClosed && (
          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="size-4 text-gray-500" />
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Case Closed</h3>
            </div>
            {detail.workerRating != null && (
              <div className="flex items-center gap-3 mb-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-600">
                <StarDisplay rating={detail.workerRating} size="md" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {detail.workerRating === 5 ? 'You rated this resolution as Satisfied' : 'You marked this as Unsatisfactory'}
                </span>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {detail.workerRating === 5
                ? 'Thank you for confirming. This complaint is now closed.'
                : 'Your feedback has been recorded. This complaint is closed.'}
              {' '}If the issue recurs, you can submit a new complaint.
            </p>
          </div>
        )}

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {detail.description}
          </p>
        </div>

        {/* Meta info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Tag,       label: 'Type',         value: formatType(detail.type),             color: 'text-purple-600 dark:text-purple-400' },
              { icon: StatusIcon, label: 'Current Status', value: cfg.label,                         color: 'text-amber-600 dark:text-amber-400' },
              { icon: Calendar,  label: 'Filed On',     value: new Date(detail.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' }), color: 'text-blue-600 dark:text-blue-400' },
              { icon: Clock,     label: 'Last Updated', value: detail.updatedAt ? new Date(detail.updatedAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No updates yet', color: 'text-gray-500 dark:text-gray-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <Icon className={`size-4 ${color} mt-0.5 flex-shrink-0`} />
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className={`text-sm font-medium ${color} mt-0.5`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        {detail.history && detail.history.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Update History</h2>
            <div className="space-y-3">
              {detail.history.map((h, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="size-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">{h.updateNotes ?? 'Status updated'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(h.updatedAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachment */}
        {detail.attachmentUrl && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Attachment</h2>
            <a
              href={detail.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 hover:underline"
            >
              <FileText className="size-4" /> View Attachment
            </a>
          </div>
        )}

        {/* Guidance (shown only for active, non-resolved complaints) */}
        {!isResolved && !isClosed && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="size-4 text-amber-600" />
              <h3 className="font-semibold text-amber-900 dark:text-amber-300 text-sm">What happens next?</h3>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Your complaint has been received. The agency will review it and provide a resolution.
              Once they mark it as resolved, you will be able to confirm satisfaction or reopen the case if the issue persists.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
