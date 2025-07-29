 // app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export const metadata = {
  title: "PDV SaaS",
  description: "Sistema punto de venta inteligente",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
              <Toaster position="top-right" richColors closeButton />

    </html>
  );
}
