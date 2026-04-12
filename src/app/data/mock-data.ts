export interface Worker {
  id: string;
  name: string;
  nationality: string;
  agency: string;
  workplace: string;
  position: string;
  status: 'active' | 'inactive' | 'alert';
  location: { lat: number; lng: number };
  salary: number;
  joinDate: string;
}

export interface Complaint {
  id: string;
  workerId: string;
  workerName: string;
  type: 'payment' | 'health' | 'workplace' | 'infrastructure' | 'other';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  agency: string;
}

export interface Agency {
  id: string;
  name: string;
  license: string;
  rating: number;
  totalWorkers: number;
  activeComplaints: number;
  status: 'good' | 'warning' | 'suspended';
  contact: string;
  email: string;
  sltdaRegistration: string;
  businessRegistrationNumber: string;
  freePostsRemaining: number;
  totalPostsMade: number;
  registrationDate: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  agency: string;
  agencyId: string;
  location: string;
  salary: string;
  requirements: string[];
  description: string;
  posted: string;
  positions: number;
}

export interface Alert {
  id: string;
  type: 'disaster' | 'weather' | 'security' | 'health';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedArea: string;
  affectedWorkers: number;
  date: string;
}

export const mockWorkers: Worker[] = [
  {
    id: 'W001',
    name: 'Rajesh Kumar',
    nationality: 'India',
    agency: 'Global Workforce Solutions',
    workplace: 'City Construction Site A',
    position: 'Construction Worker',
    status: 'active',
    location: { lat: 25.276987, lng: 55.296249 },
    salary: 1800,
    joinDate: '2023-06-15',
  },
  {
    id: 'W002',
    name: 'Maria Santos',
    nationality: 'Philippines',
    agency: 'Prime Employment Agency',
    workplace: 'Grand Hotel Downtown',
    position: 'Housekeeping Staff',
    status: 'active',
    location: { lat: 25.197197, lng: 55.274376 },
    salary: 1500,
    joinDate: '2023-08-20',
  },
  {
    id: 'W003',
    name: 'Ahmed Hassan',
    nationality: 'Egypt',
    agency: 'Global Workforce Solutions',
    workplace: 'Industrial Zone B',
    position: 'Factory Worker',
    status: 'alert',
    location: { lat: 25.185, lng: 55.265 },
    salary: 1600,
    joinDate: '2023-05-10',
  },
  {
    id: 'W004',
    name: 'Nguyen Van',
    nationality: 'Vietnam',
    agency: 'Eastern Manpower',
    workplace: 'Tech Park Office',
    position: 'IT Support',
    status: 'active',
    location: { lat: 25.22, lng: 55.28 },
    salary: 2200,
    joinDate: '2024-01-05',
  },
  {
    id: 'W005',
    name: 'Sarah Johnson',
    nationality: 'Kenya',
    agency: 'Prime Employment Agency',
    workplace: 'Medical Center',
    position: 'Nurse',
    status: 'active',
    location: { lat: 25.25, lng: 55.32 },
    salary: 2800,
    joinDate: '2023-09-12',
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: 'C001',
    workerId: 'W001',
    workerName: 'Rajesh Kumar',
    type: 'payment',
    title: 'Delayed Salary Payment',
    description: 'Salary for the month of February has not been received. Agency promised payment within 5 days.',
    status: 'in-progress',
    priority: 'high',
    date: '2026-03-10',
    agency: 'Global Workforce Solutions',
  },
  {
    id: 'C002',
    workerId: 'W003',
    workerName: 'Ahmed Hassan',
    type: 'workplace',
    title: 'Unsafe Working Conditions',
    description: 'Factory equipment is outdated and poses safety risks. No proper safety gear provided.',
    status: 'pending',
    priority: 'critical',
    date: '2026-03-12',
    agency: 'Global Workforce Solutions',
  },
  {
    id: 'C003',
    workerId: 'W002',
    workerName: 'Maria Santos',
    type: 'health',
    title: 'Need Medical Attention',
    description: 'Experiencing back pain due to long working hours. Requesting medical checkup.',
    status: 'resolved',
    priority: 'medium',
    date: '2026-03-05',
    agency: 'Prime Employment Agency',
  },
  {
    id: 'C004',
    workerId: 'W004',
    workerName: 'Nguyen Van',
    type: 'infrastructure',
    title: 'Poor Accommodation Facilities',
    description: 'Worker accommodation lacks proper ventilation and sanitation facilities.',
    status: 'pending',
    priority: 'high',
    date: '2026-03-13',
    agency: 'Eastern Manpower',
  },
  {
    id: 'C005',
    workerId: 'W001',
    workerName: 'Rajesh Kumar',
    type: 'other',
    title: 'Work Visa Renewal Issue',
    description: 'Agency has not initiated visa renewal process despite multiple reminders.',
    status: 'in-progress',
    priority: 'high',
    date: '2026-03-08',
    agency: 'Global Workforce Solutions',
  },
];

export const mockAgencies: Agency[] = [
  {
    id: 'A001',
    name: 'Global Workforce Solutions',
    license: 'GWS-2023-001',
    rating: 3.5,
    totalWorkers: 450,
    activeComplaints: 12,
    status: 'good',
    contact: '+94-11-234-5678',
    email: 'info@globalworkforce.lk',
    sltdaRegistration: 'SLTDA/TA/2023/001234',
    businessRegistrationNumber: 'BR-2023-12345',
    freePostsRemaining: 3,
    totalPostsMade: 7,
    registrationDate: '2023-01-15',
  },
  {
    id: 'A002',
    name: 'Prime Employment Agency',
    license: 'PEA-2023-002',
    rating: 4.8,
    totalWorkers: 320,
    activeComplaints: 3,
    status: 'good',
    contact: '+94-11-345-6789',
    email: 'contact@primeemployment.lk',
    sltdaRegistration: 'SLTDA/TA/2023/002345',
    businessRegistrationNumber: 'BR-2023-23456',
    freePostsRemaining: 10,
    totalPostsMade: 0,
    registrationDate: '2023-02-20',
  },
  {
    id: 'A003',
    name: 'Eastern Manpower',
    license: 'EM-2022-003',
    rating: 2.8,
    totalWorkers: 280,
    activeComplaints: 25,
    status: 'warning',
    contact: '+94-11-456-7890',
    email: 'support@easternmanpower.lk',
    sltdaRegistration: 'SLTDA/TA/2022/003456',
    businessRegistrationNumber: 'BR-2022-34567',
    freePostsRemaining: 0,
    totalPostsMade: 24,
    registrationDate: '2022-06-10',
  },
  {
    id: 'A004',
    name: 'Pacific Recruitment Services',
    license: 'PRS-2024-004',
    rating: 4.5,
    totalWorkers: 520,
    activeComplaints: 5,
    status: 'good',
    contact: '+94-11-567-8901',
    email: 'info@pacificrecruitment.lk',
    sltdaRegistration: 'SLTDA/TA/2024/004567',
    businessRegistrationNumber: 'BR-2024-45678',
    freePostsRemaining: 8,
    totalPostsMade: 2,
    registrationDate: '2024-01-05',
  },
  {
    id: 'A005',
    name: 'Elite Workforce Agency',
    license: 'EWA-2023-005',
    rating: 4.2,
    totalWorkers: 380,
    activeComplaints: 7,
    status: 'good',
    contact: '+94-11-678-9012',
    email: 'contact@eliteworkforce.lk',
    sltdaRegistration: 'SLTDA/TA/2023/005678',
    businessRegistrationNumber: 'BR-2023-56789',
    freePostsRemaining: 5,
    totalPostsMade: 5,
    registrationDate: '2023-04-12',
  },
];

export const mockJobOpportunities: JobOpportunity[] = [
  {
    id: 'J001',
    title: 'Construction Supervisor',
    agency: 'Global Workforce Solutions',
    agencyId: 'A001',
    location: 'Dubai Marina Construction Project',
    salary: '$2,500 - $3,000/month',
    requirements: ['5+ years experience', 'Valid trade certificate', 'English proficiency'],
    description: 'Supervise construction activities and ensure safety compliance on site.',
    posted: '2026-03-10',
    positions: 3,
  },
  {
    id: 'J002',
    title: 'Hotel Staff',
    agency: 'Prime Employment Agency',
    agencyId: 'A002',
    location: 'Luxury Resort - Palm Jumeirah',
    salary: '$1,800 - $2,200/month',
    requirements: ['Hospitality experience', 'Customer service skills', 'English & Arabic'],
    description: 'Join our team at a 5-star resort. Multiple positions available.',
    posted: '2026-03-11',
    positions: 10,
  },
  {
    id: 'J003',
    title: 'Warehouse Manager',
    agency: 'Eastern Manpower',
    agencyId: 'A003',
    location: 'Jebel Ali Free Zone',
    salary: '$2,800 - $3,500/month',
    requirements: ['Logistics experience', 'Team management', 'Computer skills'],
    description: 'Manage warehouse operations and inventory control.',
    posted: '2026-03-09',
    positions: 2,
  },
  {
    id: 'J004',
    title: 'Electrician',
    agency: 'Global Workforce Solutions',
    agencyId: 'A001',
    location: 'Multiple locations',
    salary: '$2,000 - $2,500/month',
    requirements: ['Certified electrician', '3+ years experience', 'Safety trained'],
    description: 'Electrical installation and maintenance for residential and commercial projects.',
    posted: '2026-03-12',
    positions: 5,
  },
  {
    id: 'J005',
    title: 'Healthcare Assistant',
    agency: 'Prime Employment Agency',
    agencyId: 'A002',
    location: 'Medical Center - Al Barsha',
    salary: '$2,200 - $2,600/month',
    requirements: ['Healthcare certification', 'Patient care experience', 'English proficiency'],
    description: 'Assist medical staff in patient care and administrative duties.',
    posted: '2026-03-08',
    positions: 4,
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'AL001',
    type: 'weather',
    severity: 'high',
    title: 'Extreme Heat Warning',
    description: 'Temperatures expected to exceed 45°C. Outdoor work should be limited during peak hours.',
    affectedArea: 'Industrial Zone B',
    affectedWorkers: 85,
    date: '2026-03-14',
  },
  {
    id: 'AL002',
    type: 'security',
    severity: 'medium',
    title: 'Area Access Restriction',
    description: 'Construction site temporarily closed for safety inspection.',
    affectedArea: 'City Construction Site A',
    affectedWorkers: 42,
    date: '2026-03-13',
  },
];

export const dashboardStats = {
  government: {
    totalWorkers: 1050,
    activeComplaints: 12,
    totalAgencies: 15,
    goodAgencies: 12,
    criticalAlerts: 2,
  },
};