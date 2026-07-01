import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Shield, CheckCircle, XCircle, Megaphone, LogOut,
  Menu, BarChart2, Users, Newspaper, Plus, Send,
  Clock, AlertTriangle, ChevronDown, X,
} from 'lucide-react';
import { adminService, type AdminStatistics, type PendingVerification, type NewsItem } from '@/services/adminService';
import { authService } from '@/services/authService';

type Tab = 'dashboard' | 'verifications' | 'ads';

const NAV: { label: string; tab: Tab; icon: typeof Shield }[] = [
  { label: 'Dashboard', tab: 'dashboard', icon: BarChart2 },
  { label: 'Verifications', tab: 'verifications', icon: Users },
  { label: 'Place Ads', tab: 'ads', icon: Newspaper },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Rejection modal
  const [rejectTarget, setRejectTarget] = useState<PendingVerification | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // New ad form
  const [adForm, setAdForm] = useState({ title: '', content: '', category: 'Update', priority: 1 });
  const [adCreating, setAdCreating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [s, v, n] = await Promise.all([
        adminService.getStatistics().catch(() => null),
        adminService.getPendingVerifications().catch(() => []),
        adminService.getNews().catch(() => []),
      ]);
      setStats(s);
      setVerifications(Array.isArray(v) ? v : []);
      setNews(Array.isArray(n) ? n : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Admin Portal — LabourLink';
    fetchData();
  }, []);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  const handleLogout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    authService.clearSession();
    navigate('/login');
  };

  const handleApprove = async (v: PendingVerification) => {
    setActionLoading(v.id);
    try {
      await adminService.reviewVerification(v.id, true);
      setVerifications((prev) => prev.filter((p) => p.id !== v.id));
      setStats((prev) => prev ? { ...prev, pendingVerifications: Math.max(0, prev.pendingVerifications - 1) } : prev);
      setSuccessMsg(`${v.name} has been verified successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setActionLoading(rejectTarget.id);
    try {
      await adminService.reviewVerification(rejectTarget.id, false, rejectionReason || undefined);
      setVerifications((prev) => prev.filter((p) => p.id !== rejectTarget.id));
      setStats((prev) => prev ? { ...prev, pendingVerifications: Math.max(0, prev.pendingVerifications - 1) } : prev);
      setSuccessMsg(`${rejectTarget.name} has been rejected`);
      setRejectTarget(null);
      setRejectionReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.title.trim() || !adForm.content.trim()) return;
    setAdCreating(true);
    try {
      const created = await adminService.createNews({
        title: adForm.title,
        content: adForm.content,
        category: adForm.category,
        priority: adForm.priority,
      });
      setNews((prev) => [created, ...prev]);
      setAdForm({ title: '', content: '', category: 'Update', priority: 1 });
      setSuccessMsg('Ad created successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ad');
    } finally {
      setAdCreating(false);
    }
  };

  const handlePublish = async (item: NewsItem) => {
    setActionLoading(item.newsId);
    try {
      const updated = await adminService.publishNews(item.newsId);
      setNews((prev) => prev.map((n) => n.newsId === item.newsId ? updated : n));
      setSuccessMsg(`"${item.title}" published`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' });

  // — Sidebar —
  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-full' : 'w-64'} bg-white dark:bg-gray-800 border-r border-indigo-100 dark:border-gray-700 flex flex-col`}>
      <div className="px-6 py-5 border-b border-indigo-100 dark:border-gray-700 flex items-center gap-3">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Shield className="size-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-indigo-900 dark:text-white text-sm">LabourLink</p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400">Admin Portal</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ label, tab, icon: Icon }) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-300'
              }`}
            >
              <Icon className="size-4 flex-shrink-0" />
              {label}
              {tab === 'verifications' && verifications.length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
                  {verifications.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-indigo-100 dark:border-gray-700">
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

  // — Stats cards —
  const StatsCards = () => {
    if (!stats) return null;
    const cards = [
      { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
      { label: 'Pending Verifications', value: stats.pendingVerifications, icon: Clock, color: 'bg-amber-500' },
      { label: 'Total Jobs', value: stats.totalJobs, icon: Megaphone, color: 'bg-emerald-500' },
      { label: 'Total Complaints', value: stats.totalComplaints, icon: AlertTriangle, color: 'bg-red-500' },
    ];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`${color} p-2.5 rounded-lg`}>
              <Icon className="size-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // — Verifications Tab —
  const VerificationsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Verifications</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{verifications.length} pending</span>
      </div>

      {verifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <CheckCircle className="size-12 text-emerald-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">All caught up!</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No pending verifications at the moment.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {verifications.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/40 rounded-full p-2">
                          <Users className="size-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{v.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{v.email}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(v.submittedAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(v)}
                          disabled={actionLoading === v.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="size-3.5" />
                          {actionLoading === v.id ? 'Processing…' : 'Approve'}
                        </button>
                        <button
                          onClick={() => setRejectTarget(v)}
                          disabled={actionLoading === v.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="size-3.5" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // — Ads Tab —
  const AdsTab = () => (
    <div className="space-y-6">
      {/* Create new ad */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="size-5 text-indigo-600" />
          Create New Ad
        </h2>
        <form onSubmit={handleCreateAd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={adForm.title}
              onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
              placeholder="Enter ad title…"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <textarea
              value={adForm.content}
              onChange={(e) => setAdForm({ ...adForm, content: e.target.value })}
              placeholder="Write your ad content…"
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <div className="relative">
                <select
                  value={adForm.category}
                  onChange={(e) => setAdForm({ ...adForm, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none"
                >
                  <option value="Update">Update</option>
                  <option value="Alert">Alert</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Policy">Policy</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <div className="relative">
                <select
                  value={adForm.priority}
                  onChange={(e) => setAdForm({ ...adForm, priority: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none"
                >
                  <option value={0}>Low</option>
                  <option value={1}>Normal</option>
                  <option value={2}>High</option>
                  <option value={3}>Urgent</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={adCreating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Send className="size-4" />
            {adCreating ? 'Creating…' : 'Create Ad'}
          </button>
        </form>
      </div>

      {/* Existing ads */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Existing Ads</h2>
        {news.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Newspaper className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No ads yet. Create one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <div key={item.newsId} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.content}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {item.category} · Created {formatDate(item.createdAt)}
                      {item.publishedAt && ` · Published ${formatDate(item.publishedAt)}`}
                    </p>
                  </div>
                  {item.status !== 'Published' && (
                    <button
                      onClick={() => handlePublish(item)}
                      disabled={actionLoading === item.newsId}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                      <Megaphone className="size-3.5" />
                      {actionLoading === item.newsId ? 'Publishing…' : 'Publish'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // — Loading skeleton —
  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin size-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading admin portal…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-gray-900 flex">
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
        <header className="bg-white dark:bg-gray-800 border-b border-indigo-100 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-indigo-50" onClick={() => setSidebarOpen(true)}>
                <Menu className="size-5 text-gray-600" />
              </button>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Admin Portal</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-8 space-y-6">
          {/* Success toast */}
          {successMsg && (
            <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-[slideIn_0.3s_ease-out]">
              <CheckCircle className="size-5 flex-shrink-0" />
              <span className="text-sm font-medium">{successMsg}</span>
              <button onClick={() => setSuccessMsg(null)} className="ml-1 hover:bg-emerald-700 rounded p-0.5 transition">
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Hero banner */}
          {activeTab === 'dashboard' && (
            <>
              <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-8 -right-8 size-48 rounded-full bg-white" />
                  <div className="absolute -bottom-12 -left-8 size-64 rounded-full bg-white" />
                </div>
                <div className="relative">
                  <p className="text-indigo-200 text-sm font-medium mb-1">Administrator</p>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-indigo-100 text-sm mb-4">Manage agency verifications and platform announcements.</p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('verifications')}
                      className="bg-white text-indigo-700 hover:bg-indigo-50 text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                      <Users className="size-4" /> Review Verifications
                    </button>
                    <button
                      onClick={() => setActiveTab('ads')}
                      className="bg-white/20 hover:bg-white/30 text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                      <Megaphone className="size-4" /> Place an Ad
                    </button>
                  </div>
                </div>
              </div>
              <StatsCards />

              {/* Quick peek at pending verifications */}
              {verifications.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                      <Clock className="size-4 text-amber-500" />
                      Pending Verifications
                    </h3>
                    <button
                      onClick={() => setActiveTab('verifications')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {verifications.slice(0, 3).map((v) => (
                      <div key={v.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                        <div className="flex items-center gap-2">
                          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-1.5">
                            <Users className="size-3 text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{v.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(v.submittedAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'verifications' && <VerificationsTab />}
          {activeTab === 'ads' && <AdsTab />}
        </main>
      </div>

      {/* Rejection reason modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => { setRejectTarget(null); setRejectionReason(''); }} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reject {rejectTarget.name}?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This will reject the verification request. Optionally provide a reason.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection (optional)…"
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => { setRejectTarget(null); setRejectionReason(''); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectTarget.id}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <XCircle className="size-4" />
                {actionLoading === rejectTarget.id ? 'Rejecting…' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
