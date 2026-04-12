import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'si' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Common
    'welcome': 'Welcome',
    'login': 'Login',
    'logout': 'Logout',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'search': 'Search',
    'filter': 'Filter',
    'save': 'Save',
    'edit': 'Edit',
    'delete': 'Delete',
    'view': 'View',
    'apply': 'Apply',
    'approve': 'Approve',
    'reject': 'Reject',
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    
    // Portal Names
    'agency_portal': 'Agency Portal',
    'worker_portal': 'Existing Workers',
    'jobseeker_portal': 'Job Seekers',
    'admin_portal': 'Admin Portal',
    
    // Complaints
    'submit_complaint': 'Submit Complaint',
    'my_complaints': 'My Complaints',
    'complaint_to_agency': 'Complaint to Agency',
    'escalate_to_admin': 'Escalate to Admin',
    'complaint_type': 'Complaint Type',
    'complaint_description': 'Description',
    
    // Jobs
    'browse_jobs': 'Browse Jobs',
    'post_job': 'Post Job',
    'job_title': 'Job Title',
    'location': 'Location',
    'salary': 'Salary',
    'positions': 'Positions',
    'free_posts_remaining': 'Free Posts Remaining',
    
    // Alerts
    'emergency_alerts': 'Emergency Alerts',
    'create_alert': 'Create Alert',
    'alert_title': 'Alert Title',
    'alert_message': 'Alert Message',
    'send_notification': 'Send Notification',
  },
  si: {
    // Common
    'welcome': 'ස්වාගතයි',
    'login': 'පිවිසෙන්න',
    'logout': 'ඉවත් වන්න',
    'submit': 'ඉදිරිපත් කරන්න',
    'cancel': 'අවලංගු කරන්න',
    'search': 'සොයන්න',
    'filter': 'පෙරහන',
    'save': 'සුරකින්න',
    'edit': 'සංස්කරණය',
    'delete': 'මකන්න',
    'view': 'බලන්න',
    'apply': 'අයදුම් කරන්න',
    'approve': 'අනුමත කරන්න',
    'reject': 'ප්‍රතික්ෂේප කරන්න',
    'pending': 'අපේක්ෂිත',
    'approved': 'අනුමත',
    'rejected': 'ප්‍රතික්ෂේප',
    
    // Portal Names
    'agency_portal': 'නියෝජිතායතන පෝටලය',
    'worker_portal': 'වත්මන් සේවකයින්',
    'jobseeker_portal': 'රැකියා සොයන්නන්',
    'admin_portal': 'පරිපාලක පෝටලය',
    
    // Complaints
    'submit_complaint': 'පැමිණිල්ලක් ඉදිරිපත් කරන්න',
    'my_complaints': 'මගේ පැමිණිලි',
    'complaint_to_agency': 'නියෝජිතායතනයට පැමිණිල්ල',
    'escalate_to_admin': 'පරිපාලකයාට යොමු කරන්න',
    'complaint_type': 'පැමිණිලි වර්ගය',
    'complaint_description': 'විස්තරය',
    
    // Jobs
    'browse_jobs': 'රැකියා බලන්න',
    'post_job': 'රැකියාවක් පළ කරන්න',
    'job_title': 'රැකියා නාමය',
    'location': 'ස්ථානය',
    'salary': 'වැටුප',
    'positions': 'තනතුරු',
    'free_posts_remaining': 'ඉතිරි නොමිලේ පළ කිරීම්',
    
    // Alerts
    'emergency_alerts': 'හදිසි ඇඟවීම්',
    'create_alert': 'ඇඟවීමක් සාදන්න',
    'alert_title': 'ඇඟවීම් මාතෘකාව',
    'alert_message': 'ඇඟවීම් පණිවිඩය',
    'send_notification': 'දැනුම්දීම යවන්න',
  },
  ta: {
    // Common
    'welcome': 'வரவேற்கிறோம்',
    'login': 'உள்நுழைக',
    'logout': 'வெளியேறு',
    'submit': 'சமர்ப்பிக்கவும்',
    'cancel': 'ரத்துசெய்',
    'search': 'தேடு',
    'filter': 'வடிகட்டி',
    'save': 'சேமி',
    'edit': 'திருத்து',
    'delete': 'நீக்கு',
    'view': 'பார்க்க',
    'apply': 'விண்ணப்பிக்கவும்',
    'approve': 'அனுமதி',
    'reject': 'நிராகரி',
    'pending': 'நிலுவையில்',
    'approved': 'அனுமதிக்கப்பட்டது',
    'rejected': 'நிராகரிக்கப்பட்டது',
    
    // Portal Names
    'agency_portal': 'நிறுவன போர்ட்டல்',
    'worker_portal': 'தற்போதைய பணியாளர்கள்',
    'jobseeker_portal': 'வேலை தேடுபவர்கள்',
    'admin_portal': 'நிர்வாக போர்ட்டல்',
    
    // Complaints
    'submit_complaint': 'புகார் சமர்ப்பிக்கவும்',
    'my_complaints': 'எனது புகார்கள்',
    'complaint_to_agency': 'நிறுவனத்திற்கு புகார்',
    'escalate_to_admin': 'நிர்வாகத்திற்கு அனுப்பு',
    'complaint_type': 'புகார் வகை',
    'complaint_description': 'விளக்கம்',
    
    // Jobs
    'browse_jobs': 'வேலைகளை பார்க்கவும்',
    'post_job': 'வேலை பதிவிடு',
    'job_title': 'வேலை தலைப்பு',
    'location': 'இடம்',
    'salary': 'சம்பளம்',
    'positions': 'பதவிகள்',
    'free_posts_remaining': 'இலவச பதிவுகள் மீதமுள்ளன',
    
    // Alerts
    'emergency_alerts': 'அவசர எச்சரிக்கைகள்',
    'create_alert': 'எச்சரிக்கை உருவாக்கு',
    'alert_title': 'எச்சரிக்கை தலைப்பு',
    'alert_message': 'எச்சரிக்கை செய்தி',
    'send_notification': 'அறிவிப்பை அனுப்பு',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'en';
  });

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
