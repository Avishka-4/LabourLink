import { apiRequest } from '@/hooks/useApi';

export type AdminStatistics = {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalComplaints: number;
  pendingVerifications: number;
  pendingApprovals: number;
};

export type PendingVerification = {
  id: string;
  name: string;
  email: string;
  submittedAt: string;
};

export type NewsItem = {
  newsId: string;
  title: string;
  content: string;
  category: string;
  priority: number;
  imageUrl?: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
};

export const adminService = {
  getStatistics: async () =>
    apiRequest<AdminStatistics>('/admin/statistics'),

  getPendingVerifications: async () =>
    apiRequest<PendingVerification[]>('/admin/verifications'),

  reviewVerification: async (
    verificationId: string,
    isApproved: boolean,
    rejectionReason?: string
  ) =>
    apiRequest<{ message: string }>(`/admin/verifications/${verificationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved, rejectionReason }),
    }),

  getNews: async () =>
    apiRequest<NewsItem[]>('/admin/news'),

  createNews: async (payload: {
    title: string;
    content: string;
    category: string;
    priority: number;
    imageUrl?: string;
  }) =>
    apiRequest<NewsItem>('/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  publishNews: async (newsId: string) =>
    apiRequest<NewsItem>(`/admin/news/${newsId}/publish`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publishNow: true }),
    }),
};
