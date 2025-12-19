import { useQuery } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useAuthStore } from '../store/auth.store';

export const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const { checkAuthStatus } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ['auth', 'check-auth'],
    queryFn: checkAuthStatus,
    retry: false
  });

  if (isLoading) return <>Cargando...</>;

  return children;
};
