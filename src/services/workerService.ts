import { apiRequest } from '@/hooks/useApi';

export type AgencyListItem = {
  agencyId: string;
  companyName: string;
};

export type ComplaintItem = {
  complaintId: string;
  title: string;
  type: string;
  status: string;
  resolutionNotes?: string | null;
  targetAgencyName?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

export type WorkerProfile = {
  workerId: string;
  userId: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  nationality?: string;
  skills?: string;
  location?: string;
  experience?: number;
  education?: string;
  status?: string;
};

export const workerService = {
  getProfile: async () => apiRequest<WorkerProfile>('/worker/profile'),
  updateProfile: async (payload: Record<string, unknown>) =>
    apiRequest<WorkerProfile>('/worker/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getAgencies: async () => apiRequest<AgencyListItem[]>('/worker/agencies'),
  getComplaints: async () => apiRequest<ComplaintItem[]>('/worker/complaints'),
  getComplaint: async (complaintId: string) => apiRequest(`/worker/complaints/${complaintId}`),
  submitComplaint: async (payload: { type: string; title: string; description: string; attachmentUrl?: string; targetAgencyName?: string }) =>
    apiRequest('/worker/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  respondToComplaint: async (complaintId: string, action: 'satisfied' | 'reopen') =>
    apiRequest(`/worker/complaints/${complaintId}/respond`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    }),
  browseJobs: async (params?: { search?: string; category?: string; location?: string }) => {
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString() : '';
    return apiRequest<WorkerJob[]>(`/worker/jobs${qs}`);
  },
  getJob: async (jobId: string) => apiRequest<WorkerJobDetail>(`/worker/jobs/${jobId}`),
  applyToJob: async (jobId: string, payload: { coverLetter?: string; resumeUrl?: string }) =>
    apiRequest(`/worker/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getApplications: async () => apiRequest<WorkerApplication[]>('/worker/applications'),
};

export type WorkerJob = {
  jobId: string;
  title: string;
  description?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  category?: string;
  employmentType?: string;
  postedDate: string;
  viewCount?: number;
  agency?: { agencyId: string; name: string; logo?: string };
};

export type WorkerJobDetail = {
  jobId: string;
  title: string;
  description: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  category: string;
  employmentType: string;
  viewCount: number;
  postedDate: string;
  deadlineDate?: string;
  applicationCount: number;
  agency: { agencyId: string; name: string; description?: string; logo?: string; website?: string; email?: string; phoneNumber?: string };
};

export type WorkerApplication = {
  applicationId: string;
  jobTitle: string;
  status: string;
  appliedDate: string;
  responseDate?: string;
  agencyName?: string;
};
