import { useMemo } from 'react';
import type { AuthState } from '@/types';

export function useAuth(): AuthState {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  return useMemo(
    () => ({
      isAuthenticated: token !== null,
      token,
      role: role as AuthState['role'],
    }),
    [token, role]
  );
}
