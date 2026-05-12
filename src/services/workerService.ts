import { apiRequest } from '@/hooks/useApi';

export type ComplaintItem = {
  complaintId: string;
  title: string;
  status: string;
  createdAt: string;
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
  getComplaints: async () => apiRequest<ComplaintItem[]>('/worker/complaints'),
  getComplaint: async (complaintId: string) => apiRequest(`/worker/complaints/${complaintId}`),
  submitComplaint: async (payload: { type: string; title: string; description: string; attachmentUrl?: string }) =>
    apiRequest('/worker/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
};
