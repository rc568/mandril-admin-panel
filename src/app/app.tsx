import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import '../lib/axios/refresh-token.interceptor';
import { queryClient } from '../lib/tanstack-query/query-client';
import { CheckAuthProvider } from '../modules/auth/context/auth-provider';
import { appRouter } from './app-router';

export const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <CheckAuthProvider>
          <RouterProvider router={appRouter} />
        </CheckAuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};
