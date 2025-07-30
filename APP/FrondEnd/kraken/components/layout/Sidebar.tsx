"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  HomeIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BoxIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Fragment } from "react";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
}

const MENU: MenuItem[] = [
  { href: "/dashboard/ventas",        label: "Ventas",        icon: HomeIcon },
  { href: "/dashboard/compras",       label: "Compras",       icon: ShoppingCartIcon },
  { href: "/dashboard/corte-caja",    label: "Corte Caja",    icon: CreditCardIcon },
  { href: "/dashboard/productos",     label: "Productos",     icon: BoxIcon },
  { href: "/dashboard/configuracion", label: "Configuración", icon: SettingsIcon, group: "settings" },
];

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* — HEADER: Logo y flecha interna — */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        {!collapsed && (
          <span className="text-xl font-bold tracking-tight">
            Ferre Hogar
          </span>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Abrir menú" : "Cerrar menú"}
          className="p-1 rounded hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* — MENÚ — */}
      <SidebarContent className="flex-1 px-2 py-4">
        <SidebarMenu>
          {MENU.map(({ href, label, icon: Icon }, idx) => {
            const active   = pathname === href;
            const sepBefore= MENU[idx].group === "settings";

            return (
              <Fragment key={href}>
                {sepBefore && <SidebarSeparator className="my-2" />}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={href}
                      title={collapsed ? label : undefined}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                        ${active
                          ? "bg-gray-800 text-white"
                          : "text-gray-700 hover:bg-gray-100"}
                      `}
                    >
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      <span
                        className={`flex-1 transition-opacity duration-200 ${
                          collapsed ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        {label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* — FOOTER: Perfil — */}
      <div className="px-2 pb-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/perfil"
                title={collapsed ? "Mi perfil" : undefined}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <SettingsIcon className="w-6 h-6 flex-shrink-0" />
                <span
                  className={`transition-opacity duration-200 ${
                    collapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Mi perfil
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  );
}
