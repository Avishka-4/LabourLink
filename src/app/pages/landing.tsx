import { Building2, Briefcase, Users, Shield, MapPin, AlertTriangle, Phone, Mail, MapPinned, Bell, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { AdCarousel } from '../components/ad-carousel';
import { ThemeLanguageToggle } from '../components/theme-language-toggle';
import { useLanguage } from '../contexts/language-context';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://labourlink-backend-env.eba-fjpwzbyr.ap-south-1.elasticbeanstalk.com/api';

export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const updateContact = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    if (contactErrors[field]) setContactErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validateContact = () => {
    const e: Record<string, string> = {};
    if (!contactForm.name.trim()) e.name = 'Your name is required';
    if (!contactForm.email.trim()) e.email = 'Your email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) e.email = 'Enter a valid email address';
    if (!contactForm.message.trim()) e.message = 'Please write your message';
    else if (contactForm.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact();
    if (Object.keys(errs).length > 0) { setContactErrors(errs); return; }
    setContactErrors({});
    setContactLoading(true);
    setContactError(null);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setContactSent(true);
    } catch {
      setContactError('Unable to send your message right now. Please try again later.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Users className="size-8 text-white" />
              </div>
              <div>
                <h1 className="dark:text-white text-indigo-900">LabourLink</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('home_platform_tagline')}</p>
              </div>
            </div>
            <ThemeLanguageToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-indigo-900 dark:text-indigo-400">
            {t('home_hero_title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('home_hero_description')}
          </p>
        </div>

        {/* Advertisement Carousel */}
        <div className="mb-16">
          <AdCarousel />
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-emerald-500"
                onClick={() => navigate('/login/agency')}>
            <div className="flex h-full flex-col items-center text-center">
              <div className="bg-emerald-100 p-4 rounded-full mb-4">
                <Briefcase className="size-12 text-emerald-600" />
              </div>
              <h3 className="mb-2">{t('agency_portal')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1 min-h-[4rem]">
                {t('home_agency_card_desc')}
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-auto">{t('home_access_dashboard')}</Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-amber-500"
                onClick={() => navigate('/login/worker')}>
            <div className="flex h-full flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <Users className="size-12 text-amber-600" />
              </div>
              <h3 className="mb-2">{t('worker_portal')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1 min-h-[4rem]">
                {t('home_worker_card_desc')}
              </p>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 mt-auto">{t('home_access_dashboard')}</Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-purple-500"
                onClick={() => navigate('/login/jobseeker')}>
            <div className="flex h-full flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Briefcase className="size-12 text-purple-600" />
              </div>
              <h3 className="mb-2">{t('jobseeker_portal')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1 min-h-[4rem]">
                {t('home_jobseeker_card_desc')}
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-auto">{t('home_access_dashboard')}</Button>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-8 dark:bg-gray-800 dark:shadow-gray-900">
          <h3 className="text-center mb-8">{t('home_key_features')}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="bg-blue-100 p-3 rounded-lg h-fit">
                <AlertTriangle className="size-6 text-blue-600" />
              </div>
              <div>
                <h4 className="mb-1">{t('home_feature_complaints_title')}</h4>
                <p className="text-gray-600 dark:text-gray-400">{t('home_feature_complaints_desc')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-purple-100 p-3 rounded-lg h-fit">
                <Bell className="size-6 text-purple-600" />
              </div>
              <div>
                <h4 className="mb-1">{t('home_feature_updates_title')}</h4>
                <p className="text-gray-600 dark:text-gray-400">{t('home_feature_updates_desc')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-green-100 p-3 rounded-lg h-fit">
                <Shield className="size-6 text-green-600" />
              </div>
              <div>
                <h4 className="mb-1">{t('home_feature_agency_title')}</h4>
                <p className="text-gray-600 dark:text-gray-400">{t('home_feature_agency_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Section */}
      <section className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Section header — matches Features heading style */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <MessageSquare className="size-4" />
              Contact Us
            </div>
            <h3 className="text-indigo-900 dark:text-indigo-300 mb-3">Have a question or need support?</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Whether it's guidance on worker rights, a technical issue, or a general enquiry — we read every message and reply within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Left: Contact info cards */}
            <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-5 flex items-start gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-800 p-2.5 rounded-xl shrink-0">
                  <Phone className="size-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">Hotline</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+94 742 330 023</p>
                  <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">Mon – Fri, 8 am – 6 pm</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-5 flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-800 p-2.5 rounded-xl shrink-0">
                  <Mail className="size-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">support@labourlink.gov.lk</p>
                  <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">We reply within 24 hours</p>
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl p-5 flex items-start gap-4">
                <div className="bg-purple-100 dark:bg-purple-800 p-2.5 rounded-xl shrink-0">
                  <MapPinned className="size-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">Office</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ministry of Labour</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Colombo 05, Sri Lanka</p>
                </div>
              </div>
            </div>

            {/* Right: Form — spans 2 cols */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
                {contactSent ? (
                  <div className="flex flex-col items-center text-center py-10">
                    <div className="size-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-5">
                      <CheckCircle className="size-10 text-emerald-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                      Thank you for reaching out. We'll get back to you at <strong className="text-gray-700 dark:text-gray-300">{contactForm.email}</strong> within 24 hours.
                    </p>
                    <button
                      onClick={() => { setContactSent(false); setContactForm({ name: '', email: '', subject: '', message: '' }); }}
                      className="mt-6 inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold transition"
                    >
                      <Send className="size-3.5" /> Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} noValidate className="space-y-6">

                    {contactError && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-base text-red-600 dark:text-red-400 flex items-start gap-2">
                        <AlertTriangle className="size-5 shrink-0 mt-0.5" />
                        {contactError}
                      </div>
                    )}

                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="c-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="c-name"
                          type="text"
                          value={contactForm.name}
                          onChange={e => updateContact('name', e.target.value)}
                          placeholder="Full name"
                          autoComplete="name"
                          className={`w-full px-4 py-3 rounded-xl border text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                            contactErrors.name
                              ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
                              : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600'
                          }`}
                        />
                        {contactErrors.name && (
                          <p className="text-sm text-red-500 mt-2 flex items-center gap-1.5">
                            <span className="size-4 rounded-full bg-red-500 text-white inline-flex items-center justify-center text-[10px] font-bold shrink-0">!</span>
                            {contactErrors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="c-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="c-email"
                          type="email"
                          value={contactForm.email}
                          onChange={e => updateContact('email', e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className={`w-full px-4 py-3 rounded-xl border text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                            contactErrors.email
                              ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
                              : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600'
                          }`}
                        />
                        {contactErrors.email && (
                          <p className="text-sm text-red-500 mt-2 flex items-center gap-1.5">
                            <span className="size-4 rounded-full bg-red-500 text-white inline-flex items-center justify-center text-[10px] font-bold shrink-0">!</span>
                            {contactErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Topic quick-select chips */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Topic <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Worker Rights', 'Salary Issue', 'Agency Complaint', 'Job Posting', 'Technical Help', 'Other'].map(topic => (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => updateContact('subject', contactForm.subject === topic ? '' : topic)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                              contactForm.subject === topic
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                      {contactForm.subject && !['Worker Rights', 'Salary Issue', 'Agency Complaint', 'Job Posting', 'Technical Help', 'Other'].includes(contactForm.subject) && (
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">Custom topic: "{contactForm.subject}"</p>
                      )}
                    </div>

                    {/* Custom subject if they want to type */}
                    <div>
                      <label htmlFor="c-subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Custom Subject <span className="text-gray-400 font-normal">(or pick a topic above)</span>
                      </label>
                      <input
                        id="c-subject"
                        type="text"
                        value={contactForm.subject}
                        onChange={e => updateContact('subject', e.target.value)}
                        placeholder="e.g., Unpaid wages for March 2026"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 hover:border-indigo-300 dark:hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="c-message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-sm transition-colors ${contactForm.message.length > 1800 ? 'text-amber-500' : 'text-gray-400'}`}>
                          {contactForm.message.length}/2000
                        </span>
                      </div>
                      <textarea
                        id="c-message"
                        value={contactForm.message}
                        onChange={e => updateContact('message', e.target.value)}
                        placeholder="Describe your question or concern in detail. The more specific you are, the faster we can help…"
                        rows={6}
                        maxLength={2000}
                        className={`w-full px-4 py-3 rounded-xl border text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none ${
                          contactErrors.message
                            ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
                            : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600'
                        }`}
                      />
                      {contactErrors.message && (
                        <p className="text-sm text-red-500 mt-2 flex items-center gap-1.5">
                          <span className="size-4 rounded-full bg-red-500 text-white inline-flex items-center justify-center text-[10px] font-bold shrink-0">!</span>
                          {contactErrors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 text-white font-semibold text-base py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
                    >
                      {contactLoading ? (
                        <>
                          <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending your message…
                        </>
                      ) : (
                        <>
                          <Send className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white mt-16 border-t dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-600 p-1.5 rounded">
                  <Users className="size-5 text-white" />
                </div>
                <h4 className="dark:text-white">{t('home_about_title')}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('home_about_desc')}
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="mb-4 dark:text-white">{t('home_contact_title')}</h4>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <Phone className="size-4 mt-1 flex-shrink-0" />
                  <div>
                    <p>{t('home_hotline_label')}: +94742330023</p>
                    <p>{t('home_office_label')}: +94742330023</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="size-4 mt-1 flex-shrink-0" />
                  <div>
                    <p>{t('home_support_email')}</p>
                    <p>{t('home_complaints_email')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPinned className="size-4 mt-1 flex-shrink-0" />
                  <p>
                    {t('home_ministry_address').split('\n').map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 dark:text-white">{t('home_quick_links_title')}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="/info#about" className="hover:text-indigo-600 transition">{t('home_about_link')}</a>
                </li>
                <li>
                  <a href="/info#worker-rights" className="hover:text-indigo-600 transition">{t('home_worker_rights_link')}</a>
                </li>
                <li>
                  <a href="/info#agency-registration" className="hover:text-indigo-600 transition">{t('home_agency_registration_link')}</a>
                </li>
                <li>
                  <a href="/info#support-services" className="hover:text-indigo-600 transition">{t('home_support_services_link')}</a>
                </li>
                <li>
                  <a href="/info#faqs" className="hover:text-indigo-600 transition">{t('home_faqs_link')}</a>
                </li>
                <li>
                  <a href="/info#contact-support" className="hover:text-indigo-600 transition">{t('home_contact_support_link')}</a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 dark:text-white">{t('home_legal_title')}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="/info#privacy-policy" className="hover:text-indigo-600 transition">{t('home_privacy_link')}</a>
                </li>
                <li>
                  <a href="/info#terms-of-service" className="hover:text-indigo-600 transition">{t('home_terms_link')}</a>
                </li>
                <li>
                  <a href="/info#data-protection" className="hover:text-indigo-600 transition">{t('home_data_protection_link')}</a>
                </li>
                <li>
                  <a href="/info#cookie-policy" className="hover:text-indigo-600 transition">{t('home_cookie_policy_link')}</a>
                </li>
                <li>
                  <a href="/info#accessibility" className="hover:text-indigo-600 transition">{t('home_accessibility_link')}</a>
                </li>
                <li>
                  <a href="/info#disclaimer" className="hover:text-indigo-600 transition">{t('home_disclaimer_link')}</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('home_rights_reserved')}</p>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{t('home_available')}</span>
                <span>•</span>
                <span>{t('home_emergency')}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}