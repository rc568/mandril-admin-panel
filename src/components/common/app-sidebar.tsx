import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Building2, FileText, Home, Package, Plane, Settings, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home
  },
  {
    title: 'Productos',
    url: '/productos',
    icon: Package
  },
  {
    title: 'Ventas',
    url: '/ventas',
    icon: ShoppingCart
  },
  {
    title: 'Cotización',
    url: '/cotizacion',
    icon: FileText
  },
  {
    title: 'Importaciones',
    url: '/importaciones',
    icon: Plane
  }
];

export function AppSidebar() {
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar className="border-r border-sidebar-border" collapsible="icon">
      <SidebarHeader className="p-2 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="font-bold text-sidebar-foreground">Mandril Importaciones</h2>
            <p className="text-xs text-sidebar-foreground/60">Panel administrativo</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80 text-xs font-medium mb-2">
            MENÚ PRINCIPAL
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      isActive(item.url) && 'bg-sidebar-accent',
                      'hover:bg-sidebar-accent/40 transition-colors'
                    )}
                    tooltip={item.title}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:text-sidebar-primary"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Configuración" className="group-data-[collapsible=icon]:justify-center">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/60 hover:text-sidebar-foreground"
              >
                <Settings className="w-4 h-4" />
                <span className="group-data-[collapsible=icon]:hidden">Configuración</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
