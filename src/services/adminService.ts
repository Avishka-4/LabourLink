import { apiRequest } from '@/hooks/useApi';
import type { NewsResponse } from '@/types/api.types';

export type AdminStats = {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalComplaints: number;
  pendingVerifications: number;
  pendingApprovals: number;
};

export const adminService = {
  getStats: async () => apiRequest<AdminStats>('/admin/statistics'),
  getUsers: async () => apiRequest('/admin/users'),
  getUser: async (userId: string) => apiRequest(`/admin/users/${userId}`),
  updateUserStatus: async (userId: string, payload: Record<string, unknown>) =>
    apiRequest(`/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getPendingVerifications: async () => apiRequest('/admin/verifications'),
  reviewVerification: async (verificationId: string, payload: Record<string, unknown>) =>
    apiRequest(`/admin/verifications/${verificationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getPendingJobs: async () => apiRequest('/admin/jobs/pending'),
  reviewJob: async (jobId: string, payload: Record<string, unknown>) =>
    apiRequest(`/admin/jobs/${jobId}/approval`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getComplaints: async () => apiRequest('/admin/complaints'),
  assignComplaint: async (complaintId: string, payload: Record<string, unknown>) =>
    apiRequest(`/admin/complaints/${complaintId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  updateComplaintStatus: async (complaintId: string, payload: Record<string, unknown>) =>
    apiRequest(`/admin/complaints/${complaintId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  listNews: async () => apiRequest<NewsResponse[]>('/admin/news'),
  createNews: async (payload: Record<string, unknown>) =>
    apiRequest('/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  updateNews: async (newsId: string, payload: Record<string, unknown>) =>
    apiRequest(`/admin/news/${newsId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  publishNews: async (newsId: string, payload: Record<string, unknown>) =>
    apiRequest(`/admin/news/${newsId}/publish`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  getAuditLogs: async () => apiRequest('/admin/audit-logs'),
};
