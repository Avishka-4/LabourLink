export type AuthRole = 'Worker' | 'JobSeeker' | 'RecruitmentAgency' | 'Administrator';

export interface AuthState {
  isAuthenticated: boolean;
  token?: string | null;
  role?: AuthRole | null;
}
