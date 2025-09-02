// app/layout.tsx
"use client";

import "./globals.css";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [openMobile, setOpenMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <html lang="es">
      <body className="flex h-screen">
        <SidebarProvider>
          {/* MÓVIL */}
          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetTrigger asChild>
              <button
                className="fixed top-4 left-4 z-50 p-2 rounded bg-white/90 shadow-md md:hidden print:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent position="left" className="w-64 p-0">
              <AppSidebar collapsed={false} onToggle={() => setOpenMobile(false)} />
            </SheetContent>
          </Sheet>

          {/* DESKTOP */}
  <aside
  className={[
    "hidden md:flex h-full border-r bg-white transition-[width] duration-200",
    "overflow-x-hidden",           // evita desbordes horizontales
    collapsed ? "w-14" : "w-56",   // ancho compacto y contenido exacto
  ].join(" ")}
>
  <AppSidebar
    collapsed={collapsed}
    onToggle={() => setCollapsed(v => !v)}
  />
</aside>

          {/* CONTENIDO */}
          <main className="flex-1 overflow-auto">
            {children}
            <Toaster position="top-right" richColors closeButton />
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
