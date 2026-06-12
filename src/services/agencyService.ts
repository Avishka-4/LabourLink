import { apiRequest } from '@/hooks/useApi';

export type AgencyProfile = {
  agencyId: string;
  userId: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  status?: string;
};

export type AgencyStats = {
  totalJobs: number;
  totalApplications: number;
  totalViewCount: number;
  approvedJobs: number;
  draftJobs: number;
};

export type JobAnalyticsSummary = {
  jobId: string;
  title: string;
  status: string;
  applicationCount: number;
  viewCount: number;
  postedDate: string;
};

export type AgencyAnalytics = {
  totalJobs: number;
  publishedJobs: number;
  draftJobs: number;
  closedJobs: number;
  totalApplications: number;
  pendingApplications: number;
  reviewingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  totalViews: number;
  topJobsByApplications: JobAnalyticsSummary[];
  topJobsByViews: JobAnalyticsSummary[];
};

export const agencyService = {
  getProfile: async () => apiRequest<AgencyProfile>('/agency/profile'),
  updateProfile: async (payload: Record<string, unknown>) =>
    apiRequest<AgencyProfile>('/agency/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getStats: async () => apiRequest<AgencyStats>('/agency/statistics'),
  getAnalytics: async () => apiRequest<AgencyAnalytics>('/agency/analytics'),
  getJobs: async () => apiRequest('/agency/jobs'),
  getJob: async (jobId: string) => apiRequest(`/agency/jobs/${jobId}`),
  deleteJob: async (jobId: string) =>
    apiRequest(`/agency/jobs/${jobId}`, { method: 'DELETE' }),
  createJob: async (payload: Record<string, unknown>) =>
    apiRequest('/agency/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  updateJob: async (jobId: string, payload: Record<string, unknown>) =>
    apiRequest(`/agency/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getJobApplications: async (jobId: string) => apiRequest(`/agency/jobs/${jobId}/applications`),
  updateApplicationStatus: async (applicationId: string, payload: Record<string, unknown>) =>
    apiRequest(`/agency/applications/${applicationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getComplaints: async () => apiRequest('/agency/complaints'),
  resolveComplaint: async (complaintId: string, resolutionDescription: string) =>
    apiRequest(`/agency/complaints/${complaintId}/resolve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolutionDescription }),
    }),
  getRating: async () => apiRequest<AgencyRating>('/agency/rating'),
};

export type AgencyRating = {
  averageRating: number;
  totalRatings: number;
  fiveStarCount: number;
  oneStarCount: number;
};
