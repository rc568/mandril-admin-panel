import { AppLayout } from '@/components/layout/app-layout';
import { AuthLayout } from '@/components/layout/auth-layout';
import { AuthenticatedRoute, NotAuthenticatedRoute } from '@/components/routes/protected-routes';
import { LoginPage } from '@/modules/auth/pages/login-page';
import { DashboardPage } from '@/modules/dashboard/pages/dashboard-page';
import { OrderUpdatePage } from '@/modules/orders/pages/order-update-page';
import { OrderListPage } from '@/modules/orders/pages/order-list-page';
import { ProductCreatePage, ProductEditPage, ProductListPage } from '@/modules/products/pages';

import { createBrowserRouter, Navigate } from 'react-router';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthenticatedRoute>
        <AppLayout />
      </AuthenticatedRoute>
    ),
    children: [
      { index: true, Component: DashboardPage },
      {
        path: 'productos',
        children: [
          { index: true, Component: ProductListPage },
          { path: 'editar/:id', Component: ProductEditPage },
          { path: 'crear', Component: ProductCreatePage }
        ]
      },
      {
        path: 'ventas',
        children: [
          { index: true, Component: OrderListPage },
          { path: 'editar/:id', Component: OrderUpdatePage }
        ]
      }
    ]
  },
  {
    path: '/auth/login',
    element: (
      <NotAuthenticatedRoute>
        <AuthLayout />
      </NotAuthenticatedRoute>
    ),
    children: [{ index: true, Component: LoginPage }]
  },
  { path: '*', element: <Navigate to="/" /> }
]);
