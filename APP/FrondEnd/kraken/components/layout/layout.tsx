"use client";

import { Sidebar, SidebarContent, SidebarItem, SidebarSeparator } from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar className="h-full border-r bg-background">
      <SidebarContent>
        <SidebarItem href="/dashboard">Dashboard</SidebarItem>
        <SidebarItem href="/productos">Productos</SidebarItem>
        <SidebarItem href="/compras">Compras</SidebarItem>
        <SidebarItem href="/ventas">Ventas</SidebarItem>
        <SidebarSeparator />
        <SidebarItem href="/configuracion">Configuración</SidebarItem>
      </SidebarContent>
    </Sidebar>
  );
}
