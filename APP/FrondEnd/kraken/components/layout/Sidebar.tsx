// components/layout/Sidebar.tsx
"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarProvider,
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

interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
}

const MENU: MenuItem[] = [
  { href: "/dashboard/ventas",      label: "Ventas",     icon: HomeIcon      },
  { href: "/dashboard/compras",     label: "Compras",    icon: ShoppingCartIcon },
  { href: "/dashboard/corte-caja",  label: "Corte Caja", icon: CreditCardIcon  },
  { href: "/dashboard/productos",   label: "Productos",  icon: BoxIcon       },
  { href: "/dashboard/configuracion", label: "Configuración", icon: SettingsIcon, group: "settings" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <Sidebar
     style={{ "--sidebar-width": collapsed ? "4rem" : "16rem" }}
        className={`
          flex-shrink-0
          w-[var(--sidebar-width)]
          flex flex-col h-full bg-white border-r shadow-sm
          transition-[width] duration-200 ease-in-out
          p-0
        `}
      >
        {/* — Logo + toggle — */}
   <div className="px-3 py-4">

      
        <button
     onClick={() => setCollapsed(!collapsed)}
     className="flex items-center justify-between w-full p-1 rounded hover:bg-gray-100"

     aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
   >
     {!collapsed && (
       <span className="text-xl font-bold tracking-tight">
         Ferre Hogar   
       </span>
     )}
     {collapsed
       ? <ChevronRightIcon className="w-5 h-5 text-gray-600" />
       : <ChevronLeftIcon  className="w-5 h-5 text-gray-600" />
     }
   </button>
        </div>
        {/* — Menú centrado verticalmente — */}
        <SidebarContent className="flex-1 flex flex-col justify-center px-2">
          <SidebarMenu>
            {MENU.map(({ href, label, icon: Icon }, idx) => {
              const active = pathname === href;
              const sepBefore = MENU[idx].group === "settings";

              return (
                <Fragment key={href}>
                  {sepBefore && <SidebarSeparator className="my-2 border-gray-200" />}

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href={href}
                        title={collapsed ? label : undefined}
                        className={`
                          group flex items-center gap-3
                          px-3 py-2 my-1 rounded-lg transition-colors
                          text-base font-medium
                          ${active
                            ? "bg-gray-800 text-white"
                            : "text-gray-700 hover:bg-gray-100"}
                        `}
                      >
                        <Icon
                          className={`
                            w-6 h-6 flex-shrink-0
                            ${active ? "text-black" : "text-gray-500 group-hover:text-gray-700"}
                          `}
                        />
                        <span
                          className={`
                            flex-1 transition-opacity duration-200
                            ${collapsed ? "opacity-0" : "opacity-100"}
                          `}
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

        {/* — Footer opcional — */}
        <div className="px-2 pb-4 border-t border-gray-200">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/dashboard/perfil"
                  title={collapsed ? "Mi perfil" : undefined}
                  className={`
                    group flex items-center gap-3
                    px-3 py-2 mt-2 rounded-lg transition-colors
                    text-base font-medium text-gray-700 hover:bg-gray-100
                  `}
                >
                  <SettingsIcon className="w-6 h-6 flex-shrink-0 text-gray-500 group-hover:text-gray-700" />
                  <span
                    className={`
                      transition-opacity duration-200
                      ${collapsed ? "opacity-0" : "opacity-100"}
                    `}
                  >
                    Mi perfil
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}
