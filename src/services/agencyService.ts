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

export const agencyService = {
  getProfile: async () => apiRequest<AgencyProfile>('/agency/profile'),
  updateProfile: async (payload: Record<string, unknown>) =>
    apiRequest<AgencyProfile>('/agency/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getStats: async () => apiRequest<AgencyStats>('/agency/statistics'),
  getJobs: async () => apiRequest('/agency/jobs'),
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
};
