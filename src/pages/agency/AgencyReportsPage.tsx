import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Briefcase, Users, Eye, CheckCircle, Clock,
  TrendingUp, BarChart2, Plus, ArrowLeft,
  XCircle, AlertCircle, FileText,
} from 'lucide-react';
import { agencyService, type AgencyAnalytics } from '@/services/agencyService';

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

function StatusDot({ color }: { color: string }) {
  return <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />;
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-28" />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64" />
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64" />
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-72" />
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  draft:     'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  closed:    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  expired:   'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export default function AgencyReportsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AgencyAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Analytics — LabourLink';
    agencyService.getAnalytics()
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load analytics data.'))
      .finally(() => setLoading(false));
  }, []);

  const d = data;
  const totalApps = d?.totalApplications ?? 0;
  const totalJobs = d?.totalJobs ?? 0;
  const approvalRate = totalJobs > 0 ? Math.round(((d?.publishedJobs ?? 0) / totalJobs) * 100) : 0;
  const conversionRate = (d?.totalViews ?? 0) > 0
    ? ((totalApps / (d?.totalViews ?? 1)) * 100).toFixed(1)
    : '0';
  const avgAppsPerJob = totalJobs > 0 ? (totalApps / totalJobs).toFixed(1) : '0';

  const kpiCards = [
    { label: 'Total Jobs',       value: d?.totalJobs ?? 0,        icon: Briefcase,    bg: 'bg-emerald-50 dark:bg-emerald-900/20',  iconCls: 'text-emerald-600 dark:text-emerald-400',  iconBg: 'bg-emerald-100 dark:bg-emerald-900/40' },
    { label: 'Applications',     value: d?.totalApplications ?? 0, icon: Users,        bg: 'bg-blue-50 dark:bg-blue-900/20',         iconCls: 'text-blue-600 dark:text-blue-400',         iconBg: 'bg-blue-100 dark:bg-blue-900/40' },
    { label: 'Total Views',      value: d?.totalViews ?? 0,        icon: Eye,          bg: 'bg-purple-50 dark:bg-purple-900/20',     iconCls: 'text-purple-600 dark:text-purple-400',     iconBg: 'bg-purple-100 dark:bg-purple-900/40' },
    { label: 'Published Jobs',   value: d?.publishedJobs ?? 0,     icon: CheckCircle,  bg: 'bg-teal-50 dark:bg-teal-900/20',         iconCls: 'text-teal-600 dark:text-teal-400',         iconBg: 'bg-teal-100 dark:bg-teal-900/40' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-100 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <BarChart2 className="size-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Agency Analytics</h1>
                <p className="text-emerald-100 text-sm mt-0.5">Live data from your recruitment activity</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/agency/jobs/new')}
              className="hidden sm:flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              <Plus className="size-4" /> Post Job
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-5 py-4 text-sm text-red-700 dark:text-red-400 flex items-center gap-3">
            <AlertCircle className="size-4 flex-shrink-0" /> {error}
          </div>
        )}

        {loading ? <Skeleton /> : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpiCards.map(({ label, value, icon: Icon, bg, iconCls, iconBg }) => (
                <div key={label} className={`${bg} rounded-2xl p-5 border border-white/60 dark:border-gray-700`}>
                  <div className={`inline-flex p-2 rounded-xl mb-3 ${iconBg}`}>
                    <Icon className={`size-4 ${iconCls}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
                </div>
              ))}
            </div>

            {/* Derived metrics row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Publish Rate',         value: `${approvalRate}%`,   sub: 'of jobs are live',              icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Avg Applications',     value: avgAppsPerJob,         sub: 'per job posting',               icon: TrendingUp,  color: 'text-blue-600 dark:text-blue-400' },
                { label: 'View → Apply Rate',    value: `${conversionRate}%`,  sub: 'of views convert to apply',     icon: Eye,         color: 'text-purple-600 dark:text-purple-400' },
              ].map(({ label, value, sub, icon: Icon, color }) => (
                <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 text-center">
                  <Icon className={`size-5 mx-auto mb-2 ${color}`} />
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Job Status + Application Status side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Job Status Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Briefcase className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Job Status Breakdown</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Published',  value: d?.publishedJobs ?? 0, dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
                    { label: 'Draft',      value: d?.draftJobs ?? 0,     dot: 'bg-amber-400',   bar: 'bg-amber-400' },
                    { label: 'Closed',     value: d?.closedJobs ?? 0,    dot: 'bg-gray-400',    bar: 'bg-gray-400' },
                  ].map(({ label, value, dot, bar }) => (
                    <div key={label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <StatusDot color={dot} /> {label}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
                      </div>
                      <Bar value={value} max={totalJobs} color={bar} />
                    </div>
                  ))}
                </div>

                {/* Mini stacked bar */}
                {totalJobs > 0 && (
                  <div className="mt-5">
                    <div className="flex rounded-full overflow-hidden h-3 bg-gray-100 dark:bg-gray-700 gap-0.5">
                      {(d?.publishedJobs ?? 0) > 0 && (
                        <div className="bg-emerald-500" style={{ width: `${((d?.publishedJobs ?? 0) / totalJobs) * 100}%` }} />
                      )}
                      {(d?.draftJobs ?? 0) > 0 && (
                        <div className="bg-amber-400" style={{ width: `${((d?.draftJobs ?? 0) / totalJobs) * 100}%` }} />
                      )}
                      {(d?.closedJobs ?? 0) > 0 && (
                        <div className="bg-gray-400" style={{ width: `${((d?.closedJobs ?? 0) / totalJobs) * 100}%` }} />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">{totalJobs} total job{totalJobs !== 1 ? 's' : ''}</p>
                  </div>
                )}
              </div>

              {/* Application Status Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Users className="size-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Application Status Breakdown</h3>
                </div>

                {totalApps === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <Users className="size-8 text-gray-200 dark:text-gray-700 mb-2" />
                    <p className="text-sm text-gray-400">No applications yet</p>
                    <p className="text-xs text-gray-400 mt-1">Applications will appear here once candidates apply</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { label: 'Pending / Shortlisted', value: d?.pendingApplications ?? 0,   dot: 'bg-amber-400',   bar: 'bg-amber-400',   icon: Clock },
                      { label: 'Under Review',          value: d?.reviewingApplications ?? 0,  dot: 'bg-blue-500',    bar: 'bg-blue-500',    icon: TrendingUp },
                      { label: 'Accepted',              value: d?.acceptedApplications ?? 0,   dot: 'bg-emerald-500', bar: 'bg-emerald-500', icon: CheckCircle },
                      { label: 'Rejected / Withdrawn',  value: d?.rejectedApplications ?? 0,   dot: 'bg-red-400',     bar: 'bg-red-400',     icon: XCircle },
                    ].map(({ label, value, dot, bar }) => (
                      <div key={label}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <StatusDot color={dot} /> {label}
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
                        </div>
                        <Bar value={value} max={totalApps} color={bar} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Jobs by Applications */}
            {(d?.topJobsByApplications?.length ?? 0) > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Top Jobs by Applications</h3>
                  </div>
                  <button
                    onClick={() => navigate('/agency/jobs')}
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    View all →
                  </button>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 px-6 py-2.5 bg-gray-50 dark:bg-gray-700/50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <span className="col-span-5">Job Title</span>
                  <span className="col-span-2 text-center">Status</span>
                  <span className="col-span-2 text-center">Apps</span>
                  <span className="col-span-3">Applications bar</span>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-gray-700">
                  {d?.topJobsByApplications.map((job, idx) => {
                    const maxApps = d.topJobsByApplications[0]?.applicationCount ?? 1;
                    const pct = maxApps > 0 ? (job.applicationCount / maxApps) * 100 : 0;
                    const statusKey = job.status.toLowerCase();
                    return (
                      <div
                        key={job.jobId}
                        onClick={() => navigate(`/agency/jobs/${job.jobId}/applications`)}
                        className="grid grid-cols-12 gap-2 items-center px-6 py-3.5 hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 cursor-pointer transition"
                      >
                        <div className="col-span-5 flex items-center gap-3 min-w-0">
                          <span className="text-xs font-bold text-gray-400 w-4 flex-shrink-0">#{idx + 1}</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{job.title}</span>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[statusKey] ?? STATUS_COLOR['draft']}`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{job.applicationCount}</span>
                          <span className="text-xs text-gray-400 ml-1">app{job.applicationCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="col-span-3">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Jobs by Views */}
            {(d?.topJobsByViews?.length ?? 0) > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                  <Eye className="size-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Top Jobs by Views</h3>
                </div>
                <div className="grid grid-cols-12 gap-2 px-6 py-2.5 bg-gray-50 dark:bg-gray-700/50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <span className="col-span-5">Job Title</span>
                  <span className="col-span-2 text-center">Status</span>
                  <span className="col-span-2 text-center">Views</span>
                  <span className="col-span-3">Views bar</span>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-700">
                  {d?.topJobsByViews.map((job, idx) => {
                    const maxViews = d.topJobsByViews[0]?.viewCount ?? 1;
                    const pct = maxViews > 0 ? (job.viewCount / maxViews) * 100 : 0;
                    const statusKey = job.status.toLowerCase();
                    return (
                      <div
                        key={job.jobId}
                        onClick={() => navigate(`/agency/jobs/${job.jobId}/applications`)}
                        className="grid grid-cols-12 gap-2 items-center px-6 py-3.5 hover:bg-purple-50/50 dark:hover:bg-gray-700/50 cursor-pointer transition"
                      >
                        <div className="col-span-5 flex items-center gap-3 min-w-0">
                          <span className="text-xs font-bold text-gray-400 w-4 flex-shrink-0">#{idx + 1}</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{job.title}</span>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[statusKey] ?? STATUS_COLOR['draft']}`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{job.viewCount.toLocaleString()}</span>
                          <span className="text-xs text-gray-400 ml-1">views</span>
                        </div>
                        <div className="col-span-3">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state for new agencies */}
            {totalJobs === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
                <BarChart2 className="size-12 mx-auto mb-3 text-gray-200 dark:text-gray-700" />
                <p className="font-semibold text-gray-700 dark:text-gray-300">No analytics data yet</p>
                <p className="text-sm text-gray-400 mt-1">Post your first job to start tracking performance.</p>
                <button
                  onClick={() => navigate('/agency/jobs/new')}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  Post Your First Job
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-3 text-sm">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Post New Job',     href: '/agency/jobs/new' },
                  { label: 'Manage Jobs',      href: '/agency/jobs' },
                  { label: 'View Complaints',  href: '/agency/complaints' },
                  { label: 'Agency Profile',   href: '/agency/profile' },
                ].map(({ label, href }) => (
                  <button
                    key={href}
                    onClick={() => navigate(href)}
                    className="text-xs bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition font-medium"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}