import { apiRequest } from '@/hooks/useApi';
import type { AuthRole } from '@/types/auth.types';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ROLE_KEY = 'userRole';
const USER_ID_KEY = 'userId';

type LoginResponse = {
  userId: string;
  token: string;
  refreshToken: string;
  role: AuthRole;
  expiresIn: number;
};

type RegisterResponse = {
  userId: string;
  email: string;
  message: string;
};

type MessageResponse = {
  message: string;
};

type RefreshResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
};

function setAuthSession(response: LoginResponse): void {
  localStorage.setItem(TOKEN_KEY, response.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  localStorage.setItem(ROLE_KEY, response.role);
  localStorage.setItem(USER_ID_KEY, response.userId);
}

function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export const authService = {
  register: async (payload: {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    role: AuthRole;
    phoneNumber?: string;
  }) => {
    return apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      skipAuth: true,
      skipRefresh: true,
    });
  },
  login: async (email: string, password: string) => {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      skipAuth: true,
      skipRefresh: true,
    });

    setAuthSession(response);
    return response;
  },
  forgotPassword: async (email: string) => {
    return apiRequest<MessageResponse>('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      skipAuth: true,
      skipRefresh: true,
    });
  },
  resetPassword: async (payload: {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    return apiRequest<MessageResponse>('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      skipAuth: true,
      skipRefresh: true,
    });
  },
  refresh: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    const response = await apiRequest<RefreshResponse>('/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      skipAuth: true,
      skipRefresh: true,
    });

    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    return response;
  },
  logout: async () => {
    const response = await apiRequest<MessageResponse>('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: localStorage.getItem(USER_ID_KEY) }),
    });

    clearAuthSession();
    return response;
  },
  clearSession: () => {
    clearAuthSession();
  },
};
