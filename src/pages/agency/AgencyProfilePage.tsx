import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  ArrowLeft, Building2, Mail, Phone, MapPin,
  Globe, Save, Loader2, CheckCircle, Clock,
} from 'lucide-react';
import { agencyService, type AgencyProfile } from '@/services/agencyService';

export default function AgencyProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AgencyProfile | null>(null);
  const [form, setForm] = useState({
    name: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  });

  useEffect(() => {
    document.title = 'Agency Profile — LabourLink';
    agencyService.getProfile()
      .then(p => {
        setProfile(p);
        setForm({
          name: p.name ?? '',
          website: p.website ?? '',
          contactEmail: p.contactEmail ?? '',
          contactPhone: p.contactPhone ?? '',
          address: p.address ?? '',
        });
      })
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await agencyService.updateProfile({
        name: form.name,
        website: form.website,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        address: form.address,
        businessAddress: form.address,
      });
      toast.success('Agency profile updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const initials = form.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AG';

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition';

  const statusBadge = profile?.status?.toLowerCase() === 'approved'
    ? { cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: CheckCircle, label: 'Verified Agency' }
    : { cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', icon: Clock, label: `Status: ${profile?.status ?? 'Pending'}` };

  const Section = ({ icon: Icon, title, children }: { icon: typeof Building2; title: string; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
          <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-100 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <div className="flex items-center gap-5">
            <div className="size-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shadow-lg border border-white/30">
              {loading ? '…' : initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {loading ? 'Loading…' : (form.name || 'Agency Profile')}
              </h1>
              {profile && (
                <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium mt-2 ${statusBadge.cls}`}>
                  <statusBadge.icon className="size-3" />
                  {statusBadge.label}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-5">
        {loading ? (
          [1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse border border-gray-100 dark:border-gray-700">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-5" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(j => <div key={j} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
              </div>
            </div>
          ))
        ) : (
          <>
            <Section icon={Building2} title="Agency Information">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Agency / Company Name</label>
                  <input type="text" value={form.name} onChange={field('name')} className={inputCls} placeholder="Your company name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1.5"><Globe className="size-3" /> Website</span>
                  </label>
                  <input type="url" value={form.website} onChange={field('website')} className={inputCls} placeholder="https://yourwebsite.com" />
                </div>
              </div>
            </Section>

            <Section icon={Mail} title="Contact Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1.5"><Mail className="size-3" /> Contact Email</span>
                  </label>
                  <input type="email" value={form.contactEmail} onChange={field('contactEmail')} className={inputCls} placeholder="contact@agency.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1.5"><Phone className="size-3" /> Contact Phone</span>
                  </label>
                  <input type="tel" value={form.contactPhone} onChange={field('contactPhone')} className={inputCls} placeholder="+94 11 234 5678" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1.5"><MapPin className="size-3" /> Business Address</span>
                  </label>
                  <input type="text" value={form.address} onChange={field('address')} className={inputCls} placeholder="Street, City, District" />
                </div>
              </div>
            </Section>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              {saving
                ? <><Loader2 className="size-4 animate-spin" /> Saving…</>
                : <><Save className="size-4" /> Save Changes</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
