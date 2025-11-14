import { AppLayout } from '@/components/layout/app-layout';
import { DashboardPage } from '@/modules/dashboard/pages/dashboard-page';
import { ProductListPage } from '@/modules/products';
import { createBrowserRouter } from 'react-router';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'products', Component: ProductListPage }
    ]
  }
]);
