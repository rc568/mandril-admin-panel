import { AppLayout } from '@/components/layout/app-layout';
import { DashboardPage } from '@/modules/dashboard/pages/dashboard-page';
import { OrdersPage } from '@/modules/orders/orders-page';
import { ProductListPage } from '@/modules/products';
import { createBrowserRouter, Navigate } from 'react-router';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'productos', Component: ProductListPage },
      { path: 'ventas', Component: OrdersPage }
    ]
  },
  { path: '*', element: <Navigate to="/" /> }
]);
