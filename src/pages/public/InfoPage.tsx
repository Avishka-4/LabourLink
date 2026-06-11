import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Users, Shield, Building2, HeartHandshake, HelpCircle, Phone, Lock, FileText, Database, Cookie, Eye, AlertTriangle, ChevronRight } from 'lucide-react';

const sections = [
  { id: 'about', label: 'About Us', icon: Users },
  { id: 'worker-rights', label: 'Worker Rights', icon: Shield },
  { id: 'agency-registration', label: 'Agency Registration', icon: Building2 },
  { id: 'support-services', label: 'Support Services', icon: HeartHandshake },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'contact-support', label: 'Contact Support', icon: Phone },
  { id: 'privacy-policy', label: 'Privacy Policy', icon: Lock },
  { id: 'terms-of-service', label: 'Terms of Service', icon: FileText },
  { id: 'data-protection', label: 'Data Protection', icon: Database },
  { id: 'cookie-policy', label: 'Cookie Policy', icon: Cookie },
  { id: 'accessibility', label: 'Accessibility', icon: Eye },
  { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle },
];

export default function InfoPage() {
  const location = useLocation();

  useEffect(() => {
    document.title = 'LabourLink - Information';
  }, []);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Users className="size-6 text-white" />
            </div>
            <span className="font-bold text-indigo-900 dark:text-white text-lg">LabourLink</span>
          </Link>
          <Link
            to="/"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <ChevronRight className="size-4 rotate-180" /> Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-8">
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 px-2">
              Jump to Section
            </p>
            <nav className="space-y-1">
              {sections.map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
                >
                  <Icon className="size-4 flex-shrink-0" />
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-12">

          {/* About Us */}
          <section id="about" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
                <Users className="size-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Us</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                <strong className="text-gray-800 dark:text-gray-200">LabourLink</strong> is a government-backed digital platform developed under the Ministry of Labour &amp; Foreign Employment of Sri Lanka. Our mission is to safeguard migrant workers, streamline recruitment agency operations, and deliver transparent government oversight through modern technology.
              </p>
              <p>
                We connect three key stakeholders — <strong className="text-gray-800 dark:text-gray-200">migrant workers</strong>, <strong className="text-gray-800 dark:text-gray-200">licensed recruitment agencies</strong>, and <strong className="text-gray-800 dark:text-gray-200">government administrators</strong> — on a single, secure platform. Workers can submit complaints, access support, and track their employment status. Agencies can manage job postings, communicate with government, and handle applicants. Administrators oversee compliance, approve agencies, and protect worker welfare.
              </p>
              <p>
                Established to address the challenges faced by Sri Lanka's large migrant worker community, LabourLink is committed to fair labour practices, data-driven governance, and accessible public services for all.
              </p>
            </div>
          </section>

          {/* Worker Rights */}
          <section id="worker-rights" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-lg">
                <Shield className="size-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Worker Rights</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>Every migrant worker registered through LabourLink is entitled to the following fundamental rights:</p>
              <ul className="space-y-3">
                {[
                  ['Right to Safe Working Conditions', 'You have the right to work in an environment free from physical, psychological, and health hazards.'],
                  ['Right to Fair Wages', 'You are entitled to receive wages as agreed in your employment contract, paid on time and in full.'],
                  ['Right to Submit Complaints', 'You may file a complaint against your employer or recruitment agency at any time through the LabourLink portal.'],
                  ['Right to Legal Representation', 'You have access to government-approved legal advisors and can seek assistance for labour disputes.'],
                  ['Right to Freedom from Exploitation', 'Forced labour, human trafficking, and exploitation are strictly prohibited and criminal offences.'],
                  ['Right to Return Home', 'In cases of abuse or contract violation, LabourLink facilitates repatriation assistance and emergency support.'],
                ].map(([title, desc]) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-1 flex-shrink-0 size-2 rounded-full bg-emerald-500"></span>
                    <div>
                      <strong className="text-gray-800 dark:text-gray-200">{title}:</strong> {desc}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-sm bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                To report a rights violation, please use the <strong>Submit Complaint</strong> feature in your worker dashboard or call our hotline at <strong>+94742330023</strong>.
              </p>
            </div>
          </section>

          {/* Agency Registration */}
          <section id="agency-registration" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg">
                <Building2 className="size-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Agency Registration</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>Recruitment agencies must be registered and licensed through LabourLink to operate legally. Registration ensures accountability, protects workers, and maintains the integrity of Sri Lanka's labour export sector.</p>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Eligibility Requirements</h3>
              <ul className="space-y-2">
                {[
                  'Valid business registration from the Registrar of Companies',
                  'Sri Lanka Bureau of Foreign Employment (SLBFE) licence',
                  'No outstanding legal proceedings or regulatory violations',
                  'Designated compliance officer with training certification',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <ChevronRight className="size-4 mt-0.5 flex-shrink-0 text-amber-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Registration Steps</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {[
                  'Create an agency account at /register/agency',
                  'Upload required documents (business registration, SLBFE licence)',
                  'Submit for government review (approval takes 5–10 business days)',
                  'Upon approval, access the full Agency Dashboard',
                ].map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p>For registration queries, contact <strong>agencies@labourlink.gov.lk</strong>.</p>
            </div>
          </section>

          {/* Support Services */}
          <section id="support-services" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg">
                <HeartHandshake className="size-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support Services</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>LabourLink provides comprehensive support services to protect and assist migrant workers throughout their employment journey:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['24/7 Hotline', 'Round-the-clock phone support for emergencies and urgent assistance at +94742330023.'],
                  ['Legal Aid', 'Free legal consultations for workers facing contract violations, unpaid wages, or abuse.'],
                  ['Repatriation Assistance', 'Emergency travel and financial support for workers who need to return home.'],
                  ['Counselling Services', 'Psychological support and counselling for workers experiencing trauma or distress.'],
                  ['Language Support', 'Platform and services available in Sinhala, Tamil, and English.'],
                  ['Document Assistance', 'Help with lost documents, embassy contacts, and replacement certificates.'],
                ].map(([title, desc]) => (
                  <div key={title} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">{title}</h4>
                    <p className="text-sm">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section id="faqs" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
                <HelpCircle className="size-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-5 text-gray-600 dark:text-gray-400">
              {[
                ['How do I register as a worker?', 'Visit /register/worker, fill in your personal details, upload required documents, and submit. Your profile will be reviewed and activated within 2–3 business days.'],
                ['Can I use LabourLink if I am already overseas?', 'Yes. LabourLink is accessible from anywhere in the world. You can submit complaints, view job listings, and contact support from abroad.'],
                ['What documents are required for agency registration?', 'You need a valid business registration certificate and an active SLBFE licence. Additional documents may be requested during verification.'],
                ['How long does complaint resolution take?', 'Initial acknowledgement is within 24 hours. Resolution timelines vary: minor complaints are typically resolved within 7 days; complex cases may take up to 30 days.'],
                ['Is my personal information secure?', 'Yes. All data is encrypted and stored in compliance with Sri Lanka\'s data protection regulations. We never sell or share your data with unauthorised third parties.'],
                ['How do I reset my password?', 'Click "Forgot Password" on the login page and follow the instructions sent to your registered email address.'],
                ['Can agencies see my personal details?', 'Agencies can only view profiles of workers who have applied to their job listings. Your contact details are protected and only shared with your consent.'],
              ].map(([q, a]) => (
                <div key={q} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{q}</h4>
                  <p className="text-sm">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Support */}
          <section id="contact-support" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-100 dark:bg-teal-900/40 p-2 rounded-lg">
                <Phone className="size-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Support</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 text-gray-600 dark:text-gray-400">
              {[
                { title: 'Hotline (24/7)', detail: '+94742330023', sub: 'For emergencies and urgent issues' },
                { title: 'Office Phone', detail: '+94742330023', sub: 'Monday–Friday, 8:30 AM – 4:30 PM' },
                { title: 'General Support', detail: 'support@labourlink.gov.lk', sub: 'Responses within 2 business days' },
                { title: 'Complaints', detail: 'complaints@labourlink.gov.lk', sub: 'Dedicated complaints mailbox' },
                { title: 'Agency Enquiries', detail: 'agencies@labourlink.gov.lk', sub: 'Registration and compliance queries' },
                { title: 'Office Address', detail: 'Ministry of Labour & Foreign Employment', sub: 'Colombo, Sri Lanka' },
              ].map(({ title, detail, sub }) => (
                <div key={title} className="flex gap-3">
                  <div className="mt-1 size-2 rounded-full bg-teal-500 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{title}</p>
                    <p className="text-sm">{detail}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy Policy */}
          <section id="privacy-policy" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
                <Lock className="size-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
              <p><strong className="text-gray-800 dark:text-gray-200">Last updated: January 2026</strong></p>
              <p>LabourLink ("we", "us", "our") is committed to protecting your privacy. This policy explains what data we collect, why we collect it, and how it is used.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Information We Collect</h3>
              <p>We collect personal information you provide during registration (name, NIC, contact details, employment history), data generated through platform use (complaints, applications, messages), and technical data (device type, IP address, browser) for security and analytics.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">How We Use Your Information</h3>
              <p>Your data is used to operate the platform, verify identities, process complaints and job applications, communicate with you about your account, and comply with legal obligations. We do not sell your data to third parties.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Data Sharing</h3>
              <p>Data may be shared with relevant government ministries for regulatory purposes, with recruitment agencies to the extent required for job applications (with your consent), and with law enforcement where legally required.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Your Rights</h3>
              <p>You have the right to access, correct, or request deletion of your personal data by contacting support@labourlink.gov.lk.</p>
            </div>
          </section>

          {/* Terms of Service */}
          <section id="terms-of-service" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-100 dark:bg-rose-900/40 p-2 rounded-lg">
                <FileText className="size-6 text-rose-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Terms of Service</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
              <p><strong className="text-gray-800 dark:text-gray-200">Last updated: January 2026</strong></p>
              <p>By accessing and using LabourLink, you agree to be bound by these Terms of Service. Please read them carefully.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Acceptable Use</h3>
              <p>You agree not to misuse the platform, submit false information, impersonate another person, attempt to gain unauthorised access to any account or system, or use the platform for any unlawful purpose.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Account Responsibility</h3>
              <p>You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. Report any unauthorised access immediately to our support team.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Content</h3>
              <p>You retain ownership of content you submit (complaints, documents). By submitting content, you grant LabourLink a non-exclusive licence to use it solely for platform operations and compliance purposes.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Termination</h3>
              <p>We reserve the right to suspend or terminate accounts that violate these terms, with or without notice, depending on the severity of the violation.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Governing Law</h3>
              <p>These terms are governed by the laws of Sri Lanka. Disputes shall be subject to the jurisdiction of Sri Lankan courts.</p>
            </div>
          </section>

          {/* Data Protection */}
          <section id="data-protection" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-cyan-100 dark:bg-cyan-900/40 p-2 rounded-lg">
                <Database className="size-6 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Protection</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
              <p>LabourLink processes personal data in compliance with the Sri Lanka Personal Data Protection Act No. 9 of 2022 and applicable international standards.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Security Measures</h3>
              <ul className="space-y-1">
                {[
                  'All data is encrypted in transit (TLS 1.3) and at rest (AES-256)',
                  'Role-based access controls limit who can view sensitive data',
                  'Regular security audits and penetration testing',
                  'Multi-factor authentication available for all accounts',
                  'Audit logs track all access to personal records',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <ChevronRight className="size-4 mt-0.5 flex-shrink-0 text-cyan-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Data Retention</h3>
              <p>Personal data is retained for as long as your account is active and for a period of 7 years thereafter for legal and audit purposes, unless a shorter period is required by law.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Data Breach Notification</h3>
              <p>In the event of a data breach affecting your personal information, we will notify you within 72 hours of becoming aware of the breach, as required by applicable law.</p>
            </div>
          </section>

          {/* Cookie Policy */}
          <section id="cookie-policy" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded-lg">
                <Cookie className="size-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cookie Policy</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
              <p>LabourLink uses cookies to ensure the platform functions correctly and to improve your experience.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Types of Cookies We Use</h3>
              <div className="space-y-3">
                {[
                  ['Essential Cookies', 'Required for the platform to work. These include session cookies for keeping you logged in and CSRF protection tokens. These cannot be disabled.'],
                  ['Preference Cookies', 'Store your settings such as selected language and theme (dark/light mode). These improve your experience on return visits.'],
                  ['Analytics Cookies', 'Help us understand how users interact with the platform so we can improve it. All analytics data is anonymised.'],
                ].map(([title, desc]) => (
                  <div key={title} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-100 dark:border-orange-800">
                    <p className="font-semibold text-orange-800 dark:text-orange-300">{title}</p>
                    <p className="mt-1">{desc}</p>
                  </div>
                ))}
              </div>
              <p>You can control non-essential cookies through your browser settings. Disabling cookies may affect some platform functionality.</p>
            </div>
          </section>

          {/* Accessibility */}
          <section id="accessibility" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-violet-100 dark:bg-violet-900/40 p-2 rounded-lg">
                <Eye className="size-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Accessibility</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
              <p>LabourLink is committed to ensuring digital accessibility for people with disabilities. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Our Accessibility Features</h3>
              <ul className="space-y-2">
                {[
                  'Full keyboard navigation support across all pages',
                  'Screen reader compatibility (ARIA labels and roles)',
                  'High-contrast and dark mode support',
                  'Scalable text — the interface respects browser font size settings',
                  'Multilingual support: English, Sinhala, and Tamil',
                  'Descriptive alt text on all meaningful images and icons',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <ChevronRight className="size-4 mt-0.5 flex-shrink-0 text-violet-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Report an Accessibility Issue</h3>
              <p>If you encounter an accessibility barrier on LabourLink, please contact us at <strong>support@labourlink.gov.lk</strong> with the subject line "Accessibility Issue". We aim to respond within 5 business days.</p>
            </div>
          </section>

          {/* Disclaimer */}
          <section id="disclaimer" className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded-lg">
                <AlertTriangle className="size-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Disclaimer</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
              <p>The information provided on LabourLink is for general informational and operational purposes only. While we strive to keep all content accurate and up to date, we make no representations or warranties of any kind about the completeness, accuracy, or reliability of the information.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">No Legal Advice</h3>
              <p>Content on this platform does not constitute legal advice. For specific legal guidance, please consult a qualified legal professional or contact the Ministry of Labour &amp; Foreign Employment directly.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Third-Party Links</h3>
              <p>LabourLink may contain links to external websites for reference. We have no control over the content or privacy practices of those sites and accept no responsibility for them.</p>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Limitation of Liability</h3>
              <p>To the fullest extent permitted by law, LabourLink and the Ministry of Labour &amp; Foreign Employment shall not be liable for any indirect, incidental, or consequential damages arising from your use of this platform.</p>
              <p className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                If you believe information on this platform is inaccurate or outdated, please notify us at <strong>support@labourlink.gov.lk</strong> so we can investigate and correct it promptly.
              </p>
            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2026 LabourLink · Ministry of Labour &amp; Foreign Employment, Sri Lanka</p>
          <Link to="/" className="mt-2 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}