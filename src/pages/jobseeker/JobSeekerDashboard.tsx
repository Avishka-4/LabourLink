import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Search, Bookmark, ClipboardList, User,
  LogOut, Bell, ChevronRight, Menu, Briefcase,
  CheckCircle, Clock, Star, TrendingUp, MapPin,
} from 'lucide-react';
import { jobSeekerService, type JobSeekerProfile } from '@/services/jobSeekerService';
import { authService } from '@/services/authService';
import type { JobApplicationListResponse, SavedJobResponse } from '@/types/api.types';

const NAV = [
  { label: 'Dashboard',       href: '/jobseeker',              icon: TrendingUp },
  { label: 'Browse Jobs',     href: '/jobseeker/jobs',         icon: Search },
  { label: 'My Applications', href: '/jobseeker/applications', icon: ClipboardList },
  { label: 'Saved Jobs',      href: '/jobseeker/saved-jobs',   icon: Bookmark },
  { label: 'My Profile',      href: '/jobseeker/profile',      icon: User },
];

export default function JobSeekerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [applications, setApplications] = useState<JobApplicationListResponse[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Job Seeker Dashboard — LabourLink';
    (async () => {
      try {
        const [p, apps, saved] = await Promise.all([
          jobSeekerService.getProfile(),
          jobSeekerService.getApplications().catch(() => []),
          jobSeekerService.getSavedJobs().catch(() => []),
        ]);
        setProfile(p);
        setApplications(Array.isArray(apps) ? apps : []);
        setSavedJobs(Array.isArray(saved) ? saved : []);
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
    navigate('/login/jobseeker');
  };

  const totalApps    = applications.length;
  const pending      = applications.filter(a => ['pending', 'submitted', 'reviewing'].includes(a.status.toLowerCase())).length;
  const interviews   = applications.filter(a => a.status.toLowerCase() === 'interview').length;
  const recentApps   = [...applications].sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()).slice(0, 5);
  const recentSaved  = savedJobs.slice(0, 3);

  const statusColor = (s: string) => {
    const l = s.toLowerCase();
    if (l === 'accepted' || l === 'hired') return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
    if (l === 'interview') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
    if (l === 'pending' || l === 'submitted' || l === 'reviewing') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    if (l === 'rejected') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-full' : 'w-64'} bg-white dark:bg-gray-800 border-r border-purple-100 dark:border-gray-700 flex flex-col`}>
      <div className="px-6 py-5 border-b border-purple-100 dark:border-gray-700 flex items-center gap-3">
        <div className="bg-purple-600 p-1.5 rounded-lg">
          <Briefcase className="size-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-purple-900 dark:text-white text-sm">LabourLink</p>
          <p className="text-xs text-purple-600 dark:text-purple-400">Job Seeker Portal</p>
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
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300'
              }`}
            >
              <Icon className="size-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-purple-100 dark:border-gray-700">
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
    <div className="min-h-screen bg-purple-50 dark:bg-gray-900 flex">
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
        <header className="bg-white dark:bg-gray-800 border-b border-purple-100 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-purple-50" onClick={() => setSidebarOpen(true)}>
                <Menu className="size-5 text-gray-600" />
              </button>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {loading ? 'Loading…' : `Welcome back, ${profile?.fullName?.split(' ')[0] ?? 'Job Seeker'}`}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                <Star className="size-3" />
                Active
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
          <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-8 -right-8 size-48 rounded-full bg-white" />
              <div className="absolute -bottom-12 -left-8 size-64 rounded-full bg-white" />
            </div>
            <div className="relative">
              <p className="text-purple-100 text-sm font-medium mb-1">Job Seeker Portal</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {loading ? '—' : (profile?.fullName ?? 'Welcome')}
              </h1>
              <p className="text-purple-100 text-sm mb-4">
                {profile?.location ? (
                  <span className="flex items-center gap-1"><MapPin className="size-3" />{profile.location}</span>
                ) : 'Find your next opportunity with LabourLink'}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/jobseeker/jobs')}
                  className="bg-white text-purple-700 hover:bg-purple-50 text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <Search className="size-4" /> Browse Jobs
                </button>
                <button
                  onClick={() => navigate('/jobseeker/applications')}
                  className="bg-purple-700/40 hover:bg-purple-700/60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <ClipboardList className="size-4" /> My Applications
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Applications',  value: loading ? '—' : totalApps,             icon: ClipboardList, color: 'purple' },
              { label: 'Pending',       value: loading ? '—' : pending,               icon: Clock,         color: 'amber' },
              { label: 'Interviews',    value: loading ? '—' : interviews,            icon: CheckCircle,   color: 'green' },
              { label: 'Saved Jobs',    value: loading ? '—' : savedJobs.length,      icon: Bookmark,      color: 'blue' },
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
            {/* Recent applications */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
                <button
                  onClick={() => navigate('/jobseeker/applications')}
                  className="text-xs text-purple-600 hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="size-3" />
                </button>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700">
                {loading ? (
                  <div className="px-6 py-8 text-center text-sm text-gray-400">Loading…</div>
                ) : recentApps.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <Briefcase className="size-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">No applications yet.</p>
                    <button
                      onClick={() => navigate('/jobseeker/jobs')}
                      className="mt-3 text-sm text-purple-600 hover:underline"
                    >
                      Browse available jobs
                    </button>
                  </div>
                ) : (
                  recentApps.map((app) => (
                    <div key={app.applicationId} className="flex items-center justify-between px-6 py-3 hover:bg-purple-50/50 dark:hover:bg-gray-700/50 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-lg flex-shrink-0">
                          <Briefcase className="size-4 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{app.jobTitle}</p>
                          <p className="text-xs text-gray-400">
                            {app.agencyName ? `${app.agencyName} · ` : ''}
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${statusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              {/* Saved jobs snapshot */}
              {recentSaved.length > 0 && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Bookmark className="size-4 text-purple-600" />
                    <h3 className="font-semibold text-purple-900 dark:text-purple-300 text-sm">Saved Jobs</h3>
                  </div>
                  <div className="space-y-2">
                    {recentSaved.map((job) => (
                      <button
                        key={job.jobId}
                        onClick={() => navigate(`/jobseeker/jobs/${job.jobId}`)}
                        className="w-full text-left"
                      >
                        <p className="text-xs font-medium text-purple-800 dark:text-purple-300 truncate">{job.title}</p>
                        {job.location && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="size-2.5" />{job.location}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/jobseeker/saved-jobs')}
                    className="mt-3 text-xs text-purple-600 hover:underline flex items-center gap-1"
                  >
                    View all saved <ChevronRight className="size-3" />
                  </button>
                </div>
              )}

              {/* Notices */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="size-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notices</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Complete your profile and upload your CV to stand out to recruiters.
                </p>
                <button
                  onClick={() => navigate('/jobseeker/profile')}
                  className="mt-3 text-xs text-purple-600 hover:underline flex items-center gap-1"
                >
                  Complete profile <ChevronRight className="size-3" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}