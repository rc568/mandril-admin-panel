import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '../../modules/auth/store/auth.store';

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();

  if (authStatus === 'checking') return null;
  if (authStatus === 'non-authenticated') return <Navigate to={'/auth/login'} replace />;

  return children;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();

  if (authStatus === 'checking') return null;
  if (authStatus === 'authenticated') return <Navigate to={'/'} replace />;

  return children;
};
