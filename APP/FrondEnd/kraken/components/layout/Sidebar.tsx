"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ShoppingCart,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard/ventas", label: "Ventas", icon: <ShoppingCart size={18} /> },
  { href: "/dashboard/productos", label: "Productos", icon: <Package size={18} /> },
  { href: "/dashboard/detalle-producto", label: "Detalle producto", icon: <LayoutGrid size={18} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "transition-all duration-300 h-screen border-r bg-white shadow-sm flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <span className={cn("font-bold text-lg", collapsed && "hidden")}>PDV</span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 text-sm transition",
              pathname.startsWith(link.href) ? "bg-gray-200 font-medium" : "",
              collapsed && "justify-center"
            )}
          >
            {link.icon}
            {!collapsed && link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
