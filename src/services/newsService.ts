import { apiRequest } from '@/hooks/useApi';
import type { NewsResponse } from '@/types/api.types';

export const newsService = {
  listPublic: async () => apiRequest<NewsResponse[]>('/news', { skipAuth: true }),
};
