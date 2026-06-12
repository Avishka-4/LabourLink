import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Users, AlertTriangle, CheckCircle, Clock, Plus, FileText,
  BookOpen, User, LogOut, Shield, Phone, Bell,
  ChevronRight, Menu, Briefcase,
} from 'lucide-react';
import { workerService } from '@/services/workerService';
import { authService } from '@/services/authService';

const NAV = [
  { label: 'Dashboard',        href: '/worker',                 icon: Users },
  { label: 'Browse Jobs',      href: '/worker/jobs',            icon: Briefcase },
  { label: 'My Applications',  href: '/worker/applications',    icon: FileText },
  { label: 'My Complaints',    href: '/worker/complaints',      icon: AlertTriangle },
  { label: 'Submit Complaint', href: '/worker/complaints/new',  icon: Plus },
  { label: 'Resources',        href: '/worker/resources',       icon: BookOpen },
  { label: 'My Profile',       href: '/worker/profile',         icon: User },
];

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<{ fullName?: string; status?: string; nationality?: string } | null>(null);
  const [complaints, setComplaints] = useState<{ status: string; title: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Worker Dashboard — LabourLink';
    (async () => {
      try {
        const [p, c] = await Promise.all([workerService.getProfile(), workerService.getComplaints()]);
        setProfile(p);
        setComplaints(Array.isArray(c) ? c : []);
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
    navigate('/login/worker');
  };

  const total       = complaints.length;
  const resolved    = complaints.filter(c => c.status.toLowerCase() === 'resolved').length;
  const pending     = complaints.filter(c => !['resolved', 'closed'].includes(c.status.toLowerCase())).length;
  const needsAction = (complaints as any[]).filter(c =>
    c.status.toLowerCase() === 'resolved' && c.resolutionNotes
  ).length;
  const recent = [...complaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statusColor = (s: string) => {
    const l = s.toLowerCase();
    if (l === 'resolved') return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
    if (l === 'pending' || l === 'submitted') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-full' : 'w-64'} bg-white dark:bg-gray-800 border-r border-amber-100 dark:border-gray-700 flex flex-col`}>
      <div className="px-6 py-5 border-b border-amber-100 dark:border-gray-700 flex items-center gap-3">
        <div className="bg-amber-600 p-1.5 rounded-lg">
          <Users className="size-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-amber-900 dark:text-white text-sm">LabourLink</p>
          <p className="text-xs text-amber-600 dark:text-amber-400">Worker Portal</p>
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
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-700 dark:hover:text-amber-300'
              }`}
            >
              <Icon className="size-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-amber-100 dark:border-gray-700">
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
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900 flex">
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
        <header className="bg-white dark:bg-gray-800 border-b border-amber-100 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-amber-50" onClick={() => setSidebarOpen(true)}>
                <Menu className="size-5 text-gray-600" />
              </button>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {loading ? 'Loading…' : `Welcome back, ${profile?.fullName?.split(' ')[0] ?? 'Worker'}`}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                profile?.status?.toLowerCase() === 'active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              }`}>
                <Shield className="size-3" />
                {profile?.status ?? 'Active'}
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

          {/* Agency response alert */}
          {!loading && needsAction > 0 && (
            <button
              onClick={() => navigate('/worker/complaints')}
              className="w-full flex items-center gap-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl px-5 py-4 text-white shadow-lg hover:shadow-xl transition-shadow text-left group"
            >
              <div className="size-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-bounce">
                <Bell className="size-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">
                  {needsAction === 1
                    ? 'Agency responded to your complaint!'
                    : `${needsAction} agencies responded to your complaints!`}
                </p>
                <p className="text-emerald-100 text-xs mt-0.5">
                  Tap to review and tell them if you're satisfied or want to reopen
                </p>
              </div>
              <ChevronRight className="size-5 text-white flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Hero banner */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-600 to-orange-500 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-8 -right-8 size-48 rounded-full bg-white" />
              <div className="absolute -bottom-12 -left-8 size-64 rounded-full bg-white" />
            </div>
            <div className="relative">
              <p className="text-amber-100 text-sm font-medium mb-1">Worker Portal</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {loading ? '—' : (profile?.fullName ?? 'Welcome')}
              </h1>
              <p className="text-amber-100 text-sm mb-4">
                {profile?.nationality ? `Nationality: ${profile.nationality}` : 'Migrant Worker · LabourLink Platform'}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/worker/jobs')}
                  className="bg-white text-amber-700 hover:bg-amber-50 text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <Briefcase className="size-4" /> Browse Jobs
                </button>
                <button
                  onClick={() => navigate('/worker/complaints/new')}
                  className="bg-amber-700/40 hover:bg-amber-700/60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <Plus className="size-4" /> Submit Complaint
                </button>
                <button
                  onClick={() => navigate('/worker/resources')}
                  className="bg-amber-700/40 hover:bg-amber-700/60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <BookOpen className="size-4" /> Worker Rights
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Complaints', value: loading ? '—' : total,       icon: FileText,    color: 'amber',   onClick: undefined },
              { label: 'Pending',          value: loading ? '—' : pending,     icon: Clock,       color: 'orange',  onClick: undefined },
              { label: 'Resolved',         value: loading ? '—' : resolved,    icon: CheckCircle, color: 'green',   onClick: undefined },
              { label: 'Need Response',    value: loading ? '—' : needsAction, icon: Bell,        color: needsAction > 0 ? 'emerald' : 'blue', onClick: needsAction > 0 ? () => navigate('/worker/complaints') : undefined },
            ].map(({ label, value, icon: Icon, color, onClick }) => (
              <div
                key={label}
                onClick={onClick}
                className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-emerald-300 transition' : ''} ${label === 'Need Response' && needsAction > 0 ? 'border-emerald-300 dark:border-emerald-600' : ''}`}
              >
                <div className={`inline-flex p-2 rounded-lg mb-3 bg-${color}-100 dark:bg-${color}-900/30`}>
                  <Icon className={`size-5 text-${color}-600 dark:text-${color}-400 ${label === 'Need Response' && needsAction > 0 ? 'animate-pulse' : ''}`} />
                </div>
                <p className={`text-2xl font-bold ${label === 'Need Response' && needsAction > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent complaints */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">Recent Complaints</h2>
                <button
                  onClick={() => navigate('/worker/complaints')}
                  className="text-xs text-amber-600 hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="size-3" />
                </button>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700">
                {loading ? (
                  <div className="px-6 py-8 text-center text-sm text-gray-400">Loading…</div>
                ) : recent.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <AlertTriangle className="size-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">No complaints submitted yet.</p>
                    <button
                      onClick={() => navigate('/worker/complaints/new')}
                      className="mt-3 text-sm text-amber-600 hover:underline"
                    >
                      Submit your first complaint
                    </button>
                  </div>
                ) : (
                  recent.map((c: any, i) => {
                    const needsResp = c.status?.toLowerCase() === 'resolved' && c.resolutionNotes;
                    return (
                      <button
                        key={i}
                        onClick={() => navigate(`/worker/complaints/${c.complaintId}`)}
                        className={`w-full flex items-center justify-between px-6 py-3 text-left transition ${
                          needsResp
                            ? 'bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
                            : 'hover:bg-amber-50/50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-1.5 rounded-lg flex-shrink-0 ${needsResp ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                            <AlertTriangle className={`size-4 ${needsResp ? 'text-emerald-600' : 'text-amber-600'}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{c.title}</p>
                            {needsResp ? (
                              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Agency responded — tap to review</p>
                            ) : (
                              <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          {needsResp && (
                            <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">!</span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(c.status)}`}>
                            {c.status}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              {/* Support */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="size-4 text-amber-600" />
                  <h3 className="font-semibold text-amber-900 dark:text-amber-300 text-sm">Need Help?</h3>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">24/7 Worker Support Hotline</p>
                <p className="font-bold text-amber-800 dark:text-amber-300">+94742330023</p>
                <p className="text-xs text-amber-600 mt-1">support@labourlink.gov.lk</p>
              </div>

              {/* Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="size-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notices</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your account is active. Complete your profile to improve visibility and access all services.
                </p>
                <button
                  onClick={() => navigate('/worker/profile')}
                  className="mt-3 text-xs text-amber-600 hover:underline flex items-center gap-1"
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
