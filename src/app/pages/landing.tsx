import { Building2, Briefcase, Users, Shield, MapPin, AlertTriangle, Phone, Mail, MapPinned, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router';
import { AdCarousel } from '../components/ad-carousel';
import { ThemeLanguageToggle } from '../components/theme-language-toggle';

export function LandingPage() {
  const navigate = useNavigate();

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
                <p className="text-xs text-gray-600 dark:text-gray-400">Migrant Worker Management Platform</p>
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
            Connecting Government, Agencies, and Workers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A comprehensive platform to ensure worker welfare, streamline agency operations,
            and enable effective government oversight of migrant workers.
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
            <div className="flex flex-col items-center text-center">
              <div className="bg-emerald-100 p-4 rounded-full mb-4">
                <Briefcase className="size-12 text-emerald-600" />
              </div>
              <h3 className="mb-2">Agency Portal</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Manage workers, post job opportunities, and communicate with government
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Access Dashboard</Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-amber-500"
                onClick={() => navigate('/login/worker')}>
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <Users className="size-12 text-amber-600" />
              </div>
              <h3 className="mb-2">Existing Workers</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Submit complaints, browse job opportunities, and access support services
              </p>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">Access Dashboard</Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-purple-500"
                onClick={() => navigate('/login/jobseeker')}>
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Briefcase className="size-12 text-purple-600" />
              </div>
              <h3 className="mb-2">Job Seekers</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Browse and apply for job opportunities, track your applications
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Access Dashboard</Button>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-8 dark:bg-gray-800 dark:shadow-gray-900">
          <h3 className="text-center mb-8">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="bg-blue-100 p-3 rounded-lg h-fit">
                <AlertTriangle className="size-6 text-blue-600" />
              </div>
              <div>
                <h4 className="mb-1">Complaint Management</h4>
                <p className="text-gray-600 dark:text-gray-400">Workers can report payment, health, workplace, and infrastructure issues</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-purple-100 p-3 rounded-lg h-fit">
                <Bell className="size-6 text-purple-600" />
              </div>
              <div>
                <h4 className="mb-1">Real-time Updates & Notifications</h4>
                <p className="text-gray-600 dark:text-gray-400">Instant alerts and reporting notifications for workers and agencies</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-green-100 p-3 rounded-lg h-fit">
                <Shield className="size-6 text-green-600" />
              </div>
              <div>
                <h4 className="mb-1">Agency Monitoring</h4>
                <p className="text-gray-600 dark:text-gray-400">Government oversight of agency performance and compliance</p>
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
                <h4 className="dark:text-white">LabourLink</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connecting workers, agencies, and government to ensure welfare and rights of migrant workers through streamlined services and oversight.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="mb-4 dark:text-white">Contact Us</h4>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <Phone className="size-4 mt-1 flex-shrink-0" />
                  <div>
                    <p>Hotline: +94-11-LABOUR</p>
                    <p>Office: +94-11-234-5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="size-4 mt-1 flex-shrink-0" />
                  <div>
                    <p>support@labourlink.gov.lk</p>
                    <p>complaints@labourlink.gov.lk</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPinned className="size-4 mt-1 flex-shrink-0" />
                  <p>
                    Ministry of Labour & Foreign Employment<br />
                    Colombo, Sri Lanka
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 dark:text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">About Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">Worker Rights</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">Agency Registration</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">Support Services</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">FAQs</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">Contact Support</a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 dark:text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">Data Protection</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">Cookie Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">Accessibility</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">Disclaimer</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2026 LabourLink. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Available 24/7</span>
                <span>•</span>
                <span>Emergency: +94-800-HELP</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}