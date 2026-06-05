import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Briefcase, BarChart2, Plus, FileText, Users,
  LogOut, Bell, ChevronRight, Menu, Eye, CheckCircle,
  Clock, TrendingUp, User, ClipboardList, AlertTriangle,
} from 'lucide-react';
import { agencyService, type AgencyProfile, type AgencyStats } from '@/services/agencyService';
import { authService } from '@/services/authService';

const NAV = [
  { label: 'Dashboard',     href: '/agency',              icon: BarChart2 },
  { label: 'Post New Job',  href: '/agency/jobs/new',      icon: Plus },
  { label: 'Manage Jobs',   href: '/agency/jobs',          icon: ClipboardList },
  { label: 'Complaints',    href: '/agency/complaints',    icon: AlertTriangle },
  { label: 'Profile',       href: '/agency/profile',       icon: User },
  { label: 'Reports',       href: '/agency/reports',       icon: FileText },
];

type JobRow = { id: string; title: string; status: string; applicants?: number };

export default function AgencyDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<AgencyProfile | null>(null);
  const [stats, setStats] = useState<AgencyStats | null>(null);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Agency Dashboard — LabourLink';
    (async () => {
      try {
        const [p, s, j] = await Promise.all([
          agencyService.getProfile(),
          agencyService.getStats(),
          agencyService.getJobs().catch(() => []),
        ]);
        setProfile(p);
        setStats(s);
        const jobList = Array.isArray(j) ? j : [];
        setJobs(
          jobList.slice(0, 5).map((job: any) => ({
            id: job.jobId,
            title: job.title,
            status: job.status,
            applicants: job.applicationCount ?? 0,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    authService.clearSession();
    navigate('/login/agency');
  };

  const statusColor = (s: string) => {
    const l = s.toLowerCase();
    if (l === 'approved' || l === 'active') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (l === 'draft' || l === 'pending') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    if (l === 'closed' || l === 'rejected') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-full' : 'w-64'} bg-white dark:bg-gray-800 border-r border-emerald-100 dark:border-gray-700 flex flex-col`}>
      <div className="px-6 py-5 border-b border-emerald-100 dark:border-gray-700 flex items-center gap-3">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <Briefcase className="size-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-emerald-900 dark:text-white text-sm">LabourLink</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">Agency Portal</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href;
          return (
            <button
              key={href}
              onClick={() => { navigate(href); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              <Icon className="size-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-emerald-100 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-gray-900 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-64 flex-col z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-emerald-50" onClick={() => setSidebarOpen(true)}>
                <Menu className="size-5 text-gray-600" />
              </button>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {loading ? 'Loading…' : `Welcome, ${profile?.name ?? 'Agency'}`}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                profile?.status?.toLowerCase() === 'approved'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              }`}>
                <CheckCircle className="size-3" />
                {profile?.status ?? 'Pending'}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-8 space-y-8">

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Hero banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-8 -right-8 size-48 rounded-full bg-white" />
              <div className="absolute -bottom-12 -left-8 size-64 rounded-full bg-white" />
            </div>
            <div className="relative">
              <p className="text-emerald-100 text-sm font-medium mb-1">Agency Portal</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {loading ? '—' : (profile?.name ?? 'Your Agency')}
              </h1>
              <p className="text-emerald-100 text-sm mb-4">
                {profile?.address ?? 'Recruitment Agency · LabourLink Platform'}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/agency/jobs/new')}
                  className="bg-white text-emerald-700 hover:bg-emerald-50 text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <Plus className="size-4" /> Post New Job
                </button>
                <button
                  onClick={() => navigate('/agency/jobs')}
                  className="bg-emerald-700/40 hover:bg-emerald-700/60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <Briefcase className="size-4" /> Manage Jobs
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Jobs',     value: loading ? '—' : (stats?.totalJobs ?? 0),        icon: Briefcase,   color: 'emerald' },
              { label: 'Applications',   value: loading ? '—' : (stats?.totalApplications ?? 0), icon: Users,       color: 'teal' },
              { label: 'Total Views',    value: loading ? '—' : (stats?.totalViewCount ?? 0),    icon: Eye,         color: 'blue' },
              { label: 'Approved Jobs',  value: loading ? '—' : (stats?.approvedJobs ?? 0),      icon: CheckCircle, color: 'green' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className={`inline-flex p-2 rounded-lg mb-3 bg-${color}-100 dark:bg-${color}-900/30`}>
                  <Icon className={`size-5 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent jobs */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">Recent Job Postings</h2>
                <button
                  onClick={() => navigate('/agency/jobs')}
                  className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="size-3" />
                </button>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700">
                {loading ? (
                  <div className="px-6 py-8 text-center text-sm text-gray-400">Loading…</div>
                ) : jobs.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <Briefcase className="size-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">No jobs posted yet.</p>
                    <button
                      onClick={() => navigate('/agency/jobs/new')}
                      className="mt-3 text-sm text-emerald-600 hover:underline"
                    >
                      Post your first job
                    </button>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between px-6 py-3 hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg flex-shrink-0">
                          <Briefcase className="size-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{job.title}</p>
                          <p className="text-xs text-gray-400">{job.applicants ?? 0} applicant{job.applicants !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${statusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              {/* Performance snapshot */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="size-4 text-emerald-600" />
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm">Performance</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-700 dark:text-emerald-400">Draft jobs</span>
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">{stats?.draftJobs ?? '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-700 dark:text-emerald-400">Approved jobs</span>
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">{stats?.approvedJobs ?? '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-700 dark:text-emerald-400">Total views</span>
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">{stats?.totalViewCount ?? '—'}</span>
                  </div>
                </div>
              </div>

              {/* Notices */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="size-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notices</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keep your agency profile up to date to attract more qualified candidates.
                </p>
                <button
                  onClick={() => navigate('/agency/profile')}
                  className="mt-3 text-xs text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Update profile <ChevronRight className="size-3" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}