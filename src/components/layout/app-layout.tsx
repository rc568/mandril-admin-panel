import { useAuthStore } from '@/modules/auth/store/auth.store';
import { Outlet } from 'react-router';
import { AppSidebar } from '../common/app-sidebar';
import { Button } from '../ui/button';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';

export const AppLayout = () => {
  const { logout } = useAuthStore();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {/* TODO HEADER  */}
          <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-6">
            <div className="flex h-14 items-center justify-between mx-auto">
              <SidebarTrigger />
              <Button variant="outline" onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
