import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { agencyService } from '@/services/agencyService';
import {
  Users, CheckCircle, XCircle, Clock, ArrowLeft,
  Mail, Phone, User, Briefcase, Calendar, ChevronRight,
} from 'lucide-react';
import { LoadingSpinner } from '@/components';

type Applicant = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
};

type ApplicationItem = {
  id: string;
  applicantName: string;
  jobTitle: string;
  status: string;
  appliedDate?: string;
  applicant?: Applicant;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  accepted:  { label: 'Accepted',  color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: CheckCircle },
  rejected:  { label: 'Rejected',  color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',               icon: XCircle },
  pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',       icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',          icon: Clock },
};

function getStatusCfg(status: string) {
  return STATUS_CONFIG[status.toLowerCase()] ?? STATUS_CONFIG['pending'];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-teal-500',
  'bg-indigo-500', 'bg-rose-500', 'bg-amber-500',
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function JobApplicationsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    document.title = 'Job Applications';
    if (!id) { setLoading(false); return; }
    agencyService.getJobApplications(id)
      .then((items: any[]) =>
        setApplications(items.map((item: any) => ({
          id: item.applicationId,
          applicantName: item.applicant?.fullName || item.applicantName || item.jobSeekerName || 'Applicant',
          jobTitle: item.jobTitle ?? '',
          status: item.status,
          appliedDate: item.appliedDate,
          applicant: item.applicant,
        })))
      )
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    setActionLoading(applicationId + status);
    try {
      await agencyService.updateApplicationStatus(applicationId, { Status: status });
      setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status } : a));
      toast.success(`Application ${status === 'Accepted' ? 'accepted' : 'rejected'}`);
    } catch {
      toast.error('Failed to update application status.');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status.toLowerCase() === filter);

  const counts = {
    all: applications.length,
    pending: applications.filter(a => ['pending', 'submitted'].includes(a.status.toLowerCase())).length,
    accepted: applications.filter(a => a.status.toLowerCase() === 'accepted').length,
    rejected: applications.filter(a => a.status.toLowerCase() === 'rejected').length,
  };

  const jobTitle = applications[0]?.jobTitle;

  if (loading) {
    return <div className="py-20 flex justify-center"><LoadingSpinner /></div>;
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
            <ArrowLeft className="size-4" /> Back to Jobs
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <Users className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Applications</h1>
              {jobTitle && <p className="text-emerald-100 text-sm">{jobTitle}</p>}
            </div>
          </div>

          {/* Summary pills */}
          <div className="flex flex-wrap gap-3 mt-5">
            {(['all', 'pending', 'accepted', 'rejected'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === tab
                    ? 'bg-white text-emerald-700 shadow'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  filter === tab ? 'bg-emerald-100 text-emerald-700' : 'bg-white/20 text-white'
                }`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <div className="size-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="size-8 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === 'all'
                ? 'Applications for this job will appear here.'
                : `Switch to "All" to see all applications.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const cfg = getStatusCfg(item.status);
              const StatusIcon = cfg.icon;
              const isPending = !['accepted', 'rejected'].includes(item.status.toLowerCase());
              const initials = getInitials(item.applicantName);
              const color = avatarColor(item.applicantName);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`${color} size-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm`}>
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-semibold text-gray-900 dark:text-white">{item.applicantName}</h2>
                            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${cfg.color}`}>
                              <StatusIcon className="size-3" />
                              {cfg.label}
                            </span>
                          </div>

                          {/* Contact info */}
                          <div className="flex flex-wrap gap-3 mt-1.5">
                            {item.applicant?.email && (
                              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Mail className="size-3" />
                                {item.applicant.email}
                              </span>
                            )}
                            {item.applicant?.phoneNumber && (
                              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Phone className="size-3" />
                                {item.applicant.phoneNumber}
                              </span>
                            )}
                            {item.appliedDate && (
                              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar className="size-3" />
                                Applied {new Date(item.appliedDate).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        {isPending && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              disabled={actionLoading !== null}
                              onClick={() => handleStatusUpdate(item.id, 'Accepted')}
                              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition disabled:opacity-50"
                            >
                              {actionLoading === item.id + 'Accepted' ? (
                                <span className="animate-spin size-3 border-2 border-emerald-600 border-t-transparent rounded-full inline-block" />
                              ) : (
                                <CheckCircle className="size-3.5" />
                              )}
                              Accept
                            </button>
                            <button
                              disabled={actionLoading !== null}
                              onClick={() => handleStatusUpdate(item.id, 'Rejected')}
                              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition disabled:opacity-50"
                            >
                              {actionLoading === item.id + 'Rejected' ? (
                                <span className="animate-spin size-3 border-2 border-red-500 border-t-transparent rounded-full inline-block" />
                              ) : (
                                <XCircle className="size-3.5" />
                              )}
                              Reject
                            </button>
                          </div>
                        )}

                        {!isPending && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                            Decision recorded
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

        {/* Stats footer */}
        {applications.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: 'Total', value: counts.all, color: 'text-gray-700 dark:text-gray-300', bg: 'bg-white dark:bg-gray-800' },
              { label: 'Accepted', value: counts.accepted, color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { label: 'Pending', value: counts.pending, color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center`}>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
