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
  const [open, setOpen] = useState(false);

  return (
    <html lang="es">
      <body className="flex h-screen">
        <SidebarProvider>

          {/* — MOBILE: trigger + drawer — */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="fixed top-4 left-4 z-50 p-2 rounded bg-white/90 shadow-md md:hidden">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent position="left" className="w-64 p-0">
              <AppSidebar />
            </SheetContent>
          </Sheet>

  
 {/*— desktop sidebar —*/}
 <div className="hidden md:block">
   <AppSidebar />
 </div>
          {/* — MAIN CONTENT — */}
          <main className="flex-1 overflow-auto">
            {children}
            <Toaster position="top-right" richColors closeButton />
          </main>

        </SidebarProvider>
      </body>
    </html>
  );
}
