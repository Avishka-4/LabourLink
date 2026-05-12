import { apiRequest } from '@/hooks/useApi';
import type { JobDetailResponse, JobSearchResponse } from '@/types/api.types';

export const jobService = {
  list: async (query?: { search?: string; page?: number; pageSize?: number }) => {
    const params = new URLSearchParams();
    if (query?.search) params.set('search', query.search);
    if (query?.page) params.set('page', query.page.toString());
    if (query?.pageSize) params.set('pageSize', query.pageSize.toString());

    const suffix = params.toString();
    const path = suffix ? `/jobs?${suffix}` : '/jobs';
    return apiRequest<JobSearchResponse[]>(path, { skipAuth: true });
  },
  getById: async (jobId: string) => apiRequest<JobDetailResponse>(`/jobs/${jobId}`, { skipAuth: true }),
};
