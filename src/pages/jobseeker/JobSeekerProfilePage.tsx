import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  ArrowLeft, User, MapPin, Briefcase,
  GraduationCap, Globe, Save, Loader2, Star, FileText,
} from 'lucide-react';
import { jobSeekerService, type JobSeekerProfile } from '@/services/jobSeekerService';

export default function JobSeekerProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    location: '',
    education: '',
    qualifications: '',
    languages: '',
    resume: '',
  });

  useEffect(() => {
    document.title = 'My Profile — LabourLink';
    jobSeekerService.getProfile()
      .then(p => {
        setProfile(p);
        setForm({
          fullName: p.fullName ?? '',
          email: p.email ?? '',
          location: p.location ?? '',
          education: p.education ?? '',
          qualifications: p.qualifications ?? '',
          languages: p.languages ?? '',
          resume: p.resume ?? '',
        });
      })
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const [firstName, ...rest] = form.fullName.trim().split(/\s+/);
      const lastName = rest.join(' ');
      await jobSeekerService.updateProfile({
        firstName: firstName || form.fullName.trim(),
        lastName,
        email: form.email,
        location: form.location,
        education: form.education,
        qualifications: form.qualifications,
        languages: form.languages,
        resume: form.resume,
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const initials = form.fullName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'JS';

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition';

  const Section = ({ icon: Icon, title, children }: { icon: typeof User; title: string; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
          <Icon className="size-4 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-100 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <div className="flex items-center gap-5">
            <div className="size-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shadow-lg border border-white/30">
              {loading ? '…' : initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {loading ? 'Loading…' : (form.fullName || 'Job Seeker Profile')}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Star className="size-3.5 text-purple-200" />
                <span className="text-purple-100 text-sm">
                  {profile?.location ? profile.location : 'Job Seeker Portal'}
                </span>
              </div>
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
            <Section icon={User} title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Full Name</label>
                  <input type="text" value={form.fullName} onChange={field('fullName')} className={inputCls} placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1.5"><Globe className="size-3" /> Email Address</span>
                  </label>
                  <input type="email" value={form.email} onChange={field('email')} className={inputCls} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1.5"><MapPin className="size-3" /> Location</span>
                  </label>
                  <input type="text" value={form.location} onChange={field('location')} className={inputCls} placeholder="City, Country" />
                </div>
              </div>
            </Section>

            <Section icon={GraduationCap} title="Education & Qualifications">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Education Level</label>
                  <input type="text" value={form.education} onChange={field('education')} className={inputCls} placeholder="e.g. Degree, Diploma, Secondary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Qualification / Field of Study</label>
                  <input type="text" value={form.qualifications} onChange={field('qualifications')} className={inputCls} placeholder="e.g. BSc Computer Science" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    Languages <span className="font-normal text-gray-400">(comma-separated)</span>
                  </label>
                  <input type="text" value={form.languages} onChange={field('languages')} className={inputCls} placeholder="e.g. Sinhala, English, Tamil" />
                  {form.languages && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.languages.split(',').map(l => l.trim()).filter(Boolean).map(l => (
                        <span key={l} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full font-medium">
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Section>

            <Section icon={Briefcase} title="Career Details">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1.5"><FileText className="size-3" /> Resume / CV URL</span>
                  </label>
                  <input type="url" value={form.resume} onChange={field('resume')} className={inputCls} placeholder="https://your-resume-link.com" />
                  {form.resume && (
                    <a href={form.resume} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline mt-1 inline-block">
                      View current resume →
                    </a>
                  )}
                </div>
              </div>
            </Section>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm"
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