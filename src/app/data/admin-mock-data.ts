export interface JobPostingSubmission {
  id: string;
  agencyName: string;
  agencyId: string;
  jobTitle: string;
  location: string;
  salary: string;
  positions: number;
  requirements: string[];
  description: string;
  paymentSlipUrl: string;
  paymentAmount: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedDate?: string;
  rejectionReason?: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'warning' | 'info' | 'announcement';
  createdBy: string;
  createdDate: string;
  expiryDate: string;
  targetAudience: 'all' | 'workers' | 'jobseekers' | 'agencies';
  isActive: boolean;
  emailSent: boolean;
}

export interface AdminComplaint {
  id: string;
  workerId: string;
  workerName: string;
  workerNationality: string;
  agencyId: string;
  agencyName: string;
  complaintToAgency: string;
  agencyResponse?: string;
  agencyResponseDate?: string;
  escalatedReason: string;
  escalatedDate: string;
  type: 'payment' | 'health' | 'workplace' | 'accommodation' | 'contract' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved';
  assignedTo?: string;
  resolution?: string;
  resolvedDate?: string;
}

export const mockJobSubmissions: JobPostingSubmission[] = [
  {
    id: 'JP001',
    agencyName: 'Prime Employment Agency',
    agencyId: 'AG001',
    jobTitle: 'Senior Accountant',
    location: 'Dubai Marina',
    salary: '$2,500 - $3,000/month',
    positions: 3,
    requirements: ['Bachelor\'s degree in Accounting', '5+ years experience', 'CPA certification'],
    description: 'Looking for experienced accountants to join our client\'s finance team.',
    paymentSlipUrl: 'payment-slip-001.pdf',
    paymentAmount: 500,
    submittedDate: '2026-03-15',
    status: 'pending',
  },
  {
    id: 'JP002',
    agencyName: 'Global Staffing Solutions',
    agencyId: 'AG002',
    jobTitle: 'Construction Supervisor',
    location: 'Sharjah',
    salary: '$3,000 - $4,000/month',
    positions: 2,
    requirements: ['10+ years construction experience', 'Valid UAE driving license', 'Safety certification'],
    description: 'Supervise construction projects and manage teams.',
    paymentSlipUrl: 'payment-slip-002.pdf',
    paymentAmount: 500,
    submittedDate: '2026-03-14',
    status: 'pending',
  },
  {
    id: 'JP003',
    agencyName: 'Elite Workforce Agency',
    agencyId: 'AG003',
    jobTitle: 'Hospitality Manager',
    location: 'Abu Dhabi',
    salary: '$3,500 - $4,500/month',
    positions: 1,
    requirements: ['Hospitality degree', '8+ years in hotel management', 'Excellent English'],
    description: 'Manage hotel operations and guest services.',
    paymentSlipUrl: 'payment-slip-003.pdf',
    paymentAmount: 500,
    submittedDate: '2026-03-13',
    status: 'approved',
    reviewedBy: 'Admin 001',
    reviewedDate: '2026-03-14',
  },
  {
    id: 'JP004',
    agencyName: 'Prime Employment Agency',
    agencyId: 'AG001',
    jobTitle: 'Retail Sales Associate',
    location: 'Dubai Mall',
    salary: '$1,200 - $1,500/month',
    positions: 10,
    requirements: ['High school diploma', 'Customer service skills', 'Arabic language preferred'],
    description: 'Assist customers and manage retail operations.',
    paymentSlipUrl: 'payment-slip-004.pdf',
    paymentAmount: 500,
    submittedDate: '2026-03-12',
    status: 'rejected',
    reviewedBy: 'Admin 001',
    reviewedDate: '2026-03-13',
    rejectionReason: 'Incomplete payment verification - amount mismatch',
  },
  {
    id: 'JP005',
    agencyName: 'TechStaff Recruitment',
    agencyId: 'AG005',
    jobTitle: 'Software Developer',
    location: 'Dubai Internet City',
    salary: '$4,000 - $6,000/month',
    positions: 5,
    requirements: ['Bachelor\'s in Computer Science', '3+ years JavaScript/React', 'Portfolio required'],
    description: 'Develop and maintain web applications for various clients.',
    paymentSlipUrl: 'payment-slip-005.pdf',
    paymentAmount: 500,
    submittedDate: '2026-03-16',
    status: 'pending',
  },
];

export const mockEmergencyAlerts: EmergencyAlert[] = [
  {
    id: 'EA001',
    title: 'Cyclone Warning - Northern Regions',
    message: 'A tropical cyclone is expected to affect northern coastal areas. All workers in construction sites should evacuate to safe zones. Emergency shelters are available at designated locations.',
    type: 'emergency',
    createdBy: 'Admin 001',
    createdDate: '2026-03-16',
    expiryDate: '2026-03-20',
    targetAudience: 'all',
    isActive: true,
    emailSent: true,
  },
  {
    id: 'EA002',
    title: 'Health Advisory - Heat Wave',
    message: 'Extreme heat conditions expected for the next 5 days. Employers must provide adequate water and rest breaks. Workers should avoid outdoor activities during peak hours (12 PM - 3 PM).',
    type: 'warning',
    createdBy: 'Admin 002',
    createdDate: '2026-03-15',
    expiryDate: '2026-03-22',
    targetAudience: 'workers',
    isActive: true,
    emailSent: true,
  },
  {
    id: 'EA003',
    title: 'New Labor Rights Workshop',
    message: 'Free workshops on worker rights and labor laws will be conducted on March 25th. Register through your agencies or at local labor offices.',
    type: 'announcement',
    createdBy: 'Admin 001',
    createdDate: '2026-03-14',
    expiryDate: '2026-03-25',
    targetAudience: 'workers',
    isActive: true,
    emailSent: true,
  },
  {
    id: 'EA004',
    title: 'COVID-19 Vaccination Drive',
    message: 'Free vaccination program for all migrant workers. Visit nearest health centers with your work permit. Vaccines available: Pfizer, Moderna, and Sinovac.',
    type: 'info',
    createdBy: 'Admin 003',
    createdDate: '2026-03-10',
    expiryDate: '2026-04-10',
    targetAudience: 'all',
    isActive: true,
    emailSent: true,
  },
];

export const mockAdminComplaints: AdminComplaint[] = [
  {
    id: 'AC001',
    workerId: 'W002',
    workerName: 'Maria Santos',
    workerNationality: 'Philippines',
    agencyId: 'AG001',
    agencyName: 'Prime Employment Agency',
    complaintToAgency: 'Salary not paid for the last 2 months. Repeated requests to agency ignored.',
    escalatedReason: 'No response from agency after 15 days. Need immediate assistance as unable to send money home.',
    escalatedDate: '2026-03-15',
    type: 'payment',
    priority: 'critical',
    status: 'investigating',
    assignedTo: 'Inspector 001',
  },
  {
    id: 'AC002',
    workerId: 'W005',
    workerName: 'Kumar Patel',
    workerNationality: 'India',
    agencyId: 'AG002',
    agencyName: 'Global Staffing Solutions',
    complaintToAgency: 'Accommodation has no proper ventilation and 15 people sharing one room.',
    agencyResponse: 'We will arrange better accommodation within 2 weeks.',
    agencyResponseDate: '2026-03-10',
    escalatedReason: '3 weeks passed but no action taken. Conditions getting worse with heat.',
    escalatedDate: '2026-03-14',
    type: 'accommodation',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 'AC003',
    workerId: 'W008',
    workerName: 'Chen Wei',
    workerNationality: 'China',
    agencyId: 'AG003',
    agencyName: 'Elite Workforce Agency',
    complaintToAgency: 'Working 14 hours per day without overtime pay. Contract says 8 hours.',
    agencyResponse: 'Overtime is voluntary and will be compensated in next month salary.',
    agencyResponseDate: '2026-03-08',
    escalatedReason: 'Did not receive overtime pay as promised. Being forced to work extra hours.',
    escalatedDate: '2026-03-12',
    type: 'contract',
    priority: 'high',
    status: 'investigating',
    assignedTo: 'Inspector 002',
  },
];

export interface AdminStats {
  totalJobSubmissions: number;
  pendingApprovals: number;
  approvedToday: number;
  rejectedToday: number;
  totalAgencies: number;
  activeWorkers: number;
  pendingComplaints: number;
  resolvedComplaints: number;
}

export const adminDashboardStats: AdminStats = {
  totalJobSubmissions: 145,
  pendingApprovals: 12,
  approvedToday: 8,
  rejectedToday: 2,
  totalAgencies: 24,
  activeWorkers: 3542,
  pendingComplaints: 15,
  resolvedComplaints: 234,
};