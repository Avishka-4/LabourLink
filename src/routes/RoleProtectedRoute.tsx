import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

type UserRole = 'Worker' | 'JobSeeker' | 'RecruitmentAgency' | 'Administrator';

interface RoleProtectedRouteProps {
  children: ReactNode;
  requiredRole: UserRole;
}

export default function RoleProtectedRoute({
  children,
  requiredRole,
}: RoleProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
