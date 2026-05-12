import { apiRequest } from '@/hooks/useApi';
import type { JobApplicationListResponse, JobSearchResponse, SavedJobResponse } from '@/types/api.types';

export type JobSeekerProfile = {
  jobSeekerId: string;
  userId: string;
  fullName?: string;
  email?: string;
  education?: string;
  qualifications?: string;
  languages?: string;
  location?: string;
  resume?: string;
};

export const jobSeekerService = {
  getProfile: async () => apiRequest<JobSeekerProfile>('/jobseeker/profile'),
  updateProfile: async (payload: Record<string, unknown>) =>
    apiRequest<JobSeekerProfile>('/jobseeker/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  searchJobs: async (query?: { search?: string }) =>
    apiRequest<JobSearchResponse[]>(`/jobseeker/jobs${query?.search ? `?search=${encodeURIComponent(query.search)}` : ''}`),
  getApplications: async () => apiRequest<JobApplicationListResponse[]>('/jobseeker/applications'),
  applyToJob: async (jobId: string, payload: { coverLetter?: string; resumeUrl?: string }) =>
    apiRequest(`/jobseeker/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  saveJob: async (jobId: string) =>
    apiRequest('/jobseeker/saved-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    }),
  getSavedJobs: async () => apiRequest<SavedJobResponse[]>('/jobseeker/saved-jobs'),
};
