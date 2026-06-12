import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Phone, Globe, BookOpen, Shield,
  Heart, Gavel, AlertTriangle, Building2, ExternalLink,
  Mail, HelpCircle, FileText,
} from 'lucide-react';

type Resource = {
  icon: typeof Phone;
  color: string;
  title: string;
  subtitle: string;
  items: { label: string; value: string; link?: string; type?: 'phone' | 'email' | 'url' }[];
};

const RESOURCES: Resource[] = [
  {
    icon: Phone,
    color: 'red',
    title: 'Emergency Helplines',
    subtitle: 'Available 24 hours, 7 days a week',
    items: [
      { label: 'LabourLink Support', value: '+94 742 330 023', type: 'phone' },
      { label: 'SLBFE Hotline', value: '+94 112 864 100', type: 'phone' },
      { label: 'Sri Lanka Police Emergency', value: '119', type: 'phone' },
      { label: 'Support Email', value: 'support@labourlink.gov.lk', type: 'email' },
    ],
  },
  {
    icon: Building2,
    color: 'blue',
    title: 'SLBFE — Sri Lanka Bureau of Foreign Employment',
    subtitle: 'Official government body for overseas workers',
    items: [
      { label: 'Main Hotline', value: '+94 112 864 100', type: 'phone' },
      { label: 'Welfare Division', value: '+94 112 864 141', type: 'phone' },
      { label: 'Website', value: 'www.slbfe.lk', link: 'https://www.slbfe.lk', type: 'url' },
      { label: 'Address', value: '234, Denzil Kobbekaduwa Mawatha, Koswatta, Battaramulla' },
    ],
  },
  {
    icon: Globe,
    color: 'indigo',
    title: 'Sri Lankan Embassies & Missions',
    subtitle: 'Contact your nearest embassy for urgent assistance',
    items: [
      { label: 'UAE (Dubai)', value: '+971 4 398 6535', type: 'phone' },
      { label: 'Saudi Arabia (Riyadh)', value: '+966 11 488 4800', type: 'phone' },
      { label: 'Malaysia (KL)', value: '+60 3 2148 8007', type: 'phone' },
      { label: 'Qatar (Doha)', value: '+974 4467 8800', type: 'phone' },
      { label: 'Kuwait City', value: '+965 2256 5571', type: 'phone' },
      { label: 'Oman (Muscat)', value: '+968 2469 5720', type: 'phone' },
    ],
  },
  {
    icon: Gavel,
    color: 'amber',
    title: 'Legal Aid & Workers\' Rights',
    subtitle: 'Know your rights and get legal support',
    items: [
      { label: 'Legal Aid Commission (Sri Lanka)', value: '+94 112 433 618', type: 'phone' },
      { label: 'Labour Department', value: '+94 112 368 023', type: 'phone' },
      { label: 'Workers\' Rights Hotline', value: '+94 112 864 100', type: 'phone' },
      { label: 'Legal Resources', value: 'labordept.gov.lk', link: 'http://www.labordept.gov.lk', type: 'url' },
    ],
  },
  {
    icon: Heart,
    color: 'pink',
    title: 'Health & Safety',
    subtitle: 'Medical support and health resources',
    items: [
      { label: 'Ministry of Health (Sri Lanka)', value: '+94 112 694 033', type: 'phone' },
      { label: 'SLBFE Welfare Fund Hotline', value: '+94 112 864 141', type: 'phone' },
      { label: 'Health Emergency (Sri Lanka)', value: '1990', type: 'phone' },
      { label: 'WHO Sri Lanka', value: 'www.who.int/srilanka', link: 'https://www.who.int/srilanka', type: 'url' },
    ],
  },
  {
    icon: Shield,
    color: 'teal',
    title: 'Anti-Trafficking & Protection',
    subtitle: 'Report abuse, trafficking, or exploitation',
    items: [
      { label: 'National Child Protection Authority', value: '+94 112 778 911', type: 'phone' },
      { label: 'Sri Lanka Police — Anti-Human Trafficking', value: '+94 112 326 727', type: 'phone' },
      { label: 'SLBFE Complaint Line', value: '+94 112 864 120', type: 'phone' },
      { label: 'IOM Sri Lanka', value: 'iom.int', link: 'https://www.iom.int', type: 'url' },
    ],
  },
];

const COLOR_MAP: Record<string, { bg: string; icon: string; border: string; badge: string }> = {
  red:    { bg: 'bg-red-50 dark:bg-red-900/10',     icon: 'text-red-600 dark:text-red-400',     border: 'border-red-200 dark:border-red-800',     badge: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/10',   icon: 'text-blue-600 dark:text-blue-400',   border: 'border-blue-200 dark:border-blue-800',   badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/10', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', badge: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/10', icon: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  pink:   { bg: 'bg-pink-50 dark:bg-pink-900/10',   icon: 'text-pink-600 dark:text-pink-400',   border: 'border-pink-200 dark:border-pink-800',   badge: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
  teal:   { bg: 'bg-teal-50 dark:bg-teal-900/10',   icon: 'text-teal-600 dark:text-teal-400',   border: 'border-teal-200 dark:border-teal-800',   badge: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' },
};

function ItemIcon({ type }: { type?: string }) {
  if (type === 'phone') return <Phone className="size-3 flex-shrink-0 text-gray-400" />;
  if (type === 'email') return <Mail className="size-3 flex-shrink-0 text-gray-400" />;
  if (type === 'url')   return <ExternalLink className="size-3 flex-shrink-0 text-gray-400" />;
  return <HelpCircle className="size-3 flex-shrink-0 text-gray-400" />;
}

export default function GovernmentResourcesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Worker Resources — LabourLink';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-400 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-100 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <BookOpen className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Worker Resources</h1>
              <p className="text-amber-100 text-sm mt-1 max-w-xl">
                Official contacts, legal aid, and support services for Sri Lankan overseas workers. Keep these handy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rights Banner */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start gap-4 mb-6">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl flex-shrink-0">
            <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm mb-1">Your Rights as an Overseas Worker</p>
            <p className="text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
              You are entitled to: receive wages on time, work reasonable hours, safe working conditions, and keep your own passport.
              Your employer cannot confiscate your passport, withhold pay, or force you to work without rest. If these rights are violated, contact the SLBFE or your nearest embassy immediately.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Submit a Complaint', icon: FileText, href: '/worker/complaints/new', color: 'bg-amber-600 text-white hover:bg-amber-700' },
            { label: 'My Complaints', icon: AlertTriangle, href: '/worker/complaints', color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700' },
            { label: 'My Profile', icon: Shield, href: '/worker/profile', color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700' },
            { label: 'Dashboard', icon: BookOpen, href: '/worker', color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700' },
          ].map(({ label, icon: Icon, href, color }) => (
            <button
              key={href}
              onClick={() => navigate(href)}
              className={`${color} rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2 transition shadow-sm`}
            >
              <Icon className="size-3.5 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {RESOURCES.map(({ icon: Icon, color, title, subtitle, items }) => {
            const c = COLOR_MAP[color];
            return (
              <div
                key={title}
                className={`${c.bg} border ${c.border} rounded-2xl overflow-hidden`}
              >
                <div className="px-5 py-4 border-b border-current border-opacity-10 flex items-center gap-3">
                  <div className={`${c.badge} p-2 rounded-xl`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{title}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {items.map(item => (
                    <div key={item.label} className="flex items-start justify-between gap-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400 min-w-0 leading-relaxed">{item.label}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <ItemIcon type={item.type} />
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-medium ${c.icon} hover:underline`}
                          >
                            {item.value}
                          </a>
                        ) : item.type === 'phone' ? (
                          <a href={`tel:${item.value.replace(/\s/g, '')}`} className={`text-xs font-medium ${c.icon}`}>
                            {item.value}
                          </a>
                        ) : item.type === 'email' ? (
                          <a href={`mailto:${item.value}`} className={`text-xs font-medium ${c.icon} hover:underline`}>
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          LabourLink is a service of the Sri Lanka Bureau of Foreign Employment · All contacts verified as of May 2026
        </p>
      </div>
    </div>
  );
}
