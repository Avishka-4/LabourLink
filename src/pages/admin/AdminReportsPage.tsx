import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, Briefcase, ClipboardList, AlertTriangle, Clock, CheckCircle, TrendingUp, FileText } from 'lucide-react';
import { LoadingSpinner } from '@/components';
import { adminService, type AdminStats } from '@/services/adminService';

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Admin Reports';
    adminService.getStats()
      .then(setStats)
      .catch(() => setError('Failed to load report data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-10 flex justify-center"><LoadingSpinner /></div>;
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      valueColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      label: 'Total Jobs',
      value: stats?.totalJobs ?? 0,
      icon: Briefcase,
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-700 dark:text-emerald-300',
    },
    {
      label: 'Total Applications',
      value: stats?.totalApplications ?? 0,
      icon: ClipboardList,
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
      valueColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      label: 'Open Complaints',
      value: stats?.totalComplaints ?? 0,
      icon: AlertTriangle,
      bg: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
      valueColor: 'text-red-700 dark:text-red-300',
    },
    {
      label: 'Pending Verifications',
      value: stats?.pendingVerifications ?? 0,
      icon: Clock,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      valueColor: 'text-amber-700 dark:text-amber-300',
    },
    {
      label: 'Pending Job Approvals',
      value: stats?.pendingApprovals ?? 0,
      icon: CheckCircle,
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      iconBg: 'bg-teal-100 dark:bg-teal-900/40',
      iconColor: 'text-teal-600 dark:text-teal-400',
      valueColor: 'text-teal-700 dark:text-teal-300',
    },
  ];

  const totalActive = (stats?.totalUsers ?? 0) - (stats?.pendingVerifications ?? 0);
  const reviewRate = stats?.totalComplaints
    ? Math.round(((stats.totalComplaints - (stats.totalComplaints)) / stats.totalComplaints) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2.5 rounded-xl">
          <TrendingUp className="size-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Reports</h1>
          <p className="text-sm text-muted-foreground">Live platform overview and statistics</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statCards.map(({ label, value, icon: Icon, bg, iconBg, iconColor, valueColor }) => (
            <div key={label} className={`${bg} rounded-xl p-5 border border-white/60 dark:border-gray-700`}>
              <div className={`inline-flex p-2 rounded-lg mb-3 ${iconBg}`}>
                <Icon className={`size-5 ${iconColor}`} />
              </div>
              <p className={`text-3xl font-bold ${valueColor}`}>{value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* User breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Users className="size-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">User Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total registered users</span>
              <span className="font-bold text-gray-900 dark:text-white">{(stats?.totalUsers ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Verified / active</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{Math.max(0, totalActive).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Awaiting verification</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{(stats?.pendingVerifications ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Jobs & Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Briefcase className="size-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Jobs & Applications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total job postings</span>
              <span className="font-bold text-gray-900 dark:text-white">{(stats?.totalJobs ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total applications</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{(stats?.totalApplications ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending job approvals</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{(stats?.pendingApprovals ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-5">
          <FileText className="size-5 text-red-500 dark:text-red-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Complaint Overview</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{(stats?.totalComplaints ?? 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Filed</p>
          </div>
          <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">—</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Under Review</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">—</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Resolved</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Detailed complaint breakdown available in Manage Complaints.{' '}
          <button onClick={() => navigate('/admin/complaints')} className="text-indigo-600 dark:text-indigo-400 hover:underline">
            View all complaints →
          </button>
        </p>
      </div>

      {/* Quick links */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5">
        <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3 text-sm">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Manage Users', href: '/admin/users' },
            { label: 'Pending Verifications', href: '/admin/verifications' },
            { label: 'Job Approvals', href: '/admin/jobs' },
            { label: 'Manage Complaints', href: '/admin/complaints' },
            { label: 'Audit Logs', href: '/admin/audit-logs' },
          ].map(({ label, href }) => (
            <button
              key={href}
              onClick={() => navigate(href)}
              className="text-xs bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition font-medium"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}