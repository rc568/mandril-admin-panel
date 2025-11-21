import { AppLayout } from '@/components/layout/app-layout';
import { DashboardPage } from '@/modules/dashboard/pages/dashboard-page';
import { OrderListPage } from '@/modules/orders/pages/order-list-page';
import { ProductListPage } from '@/modules/products';
import { createBrowserRouter, Navigate } from 'react-router';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'productos', Component: ProductListPage },
      { path: 'ventas', Component: OrderListPage }
    ]
  },
  { path: '*', element: <Navigate to="/" /> }
]);
