import { Building2, Briefcase, Users, Shield, MapPin, AlertTriangle, Phone, Mail, MapPinned, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router';
import { AdCarousel } from '../components/ad-carousel';
import { ThemeLanguageToggle } from '../components/theme-language-toggle';
import { useLanguage } from '../contexts/language-context';

export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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