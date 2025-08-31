// app/dashboard/ventas/components/products/GridProducto.tsx
"use client";

import React, { useDeferredValue, useMemo } from "react";
import ProductoCard from "./ProductoCard";
import PaginacionProductos from "./PaginacionProductos";

type Producto = {
  detalle_producto_id: number | string;
  nombre_calculado: string;
  fotos?: string[];
  precios?: { precio_venta: string | number; presentacion_id?: number | null }[];
  // ...otros campos que uses en ProductoCard
};

interface Props {
  productos: Producto[];
  onAgregar: (p: Producto) => void;

  // Estado de búsqueda
  busqueda: string;
  buscarPorAlias: boolean;

  // Paginación
  paginaActual: number;
  setPaginaActual: (n: number) => void;
  productosPorPagina?: number;

  // UI/estado
  isSearching?: boolean;

  // Orden opcional
  orden?: "nombre" | "precio";
}

export default function GridProducto({
  productos,
  onAgregar,
  busqueda,
  buscarPorAlias,
  paginaActual,
  setPaginaActual,
  productosPorPagina = 24,
  isSearching = false,
  orden = "nombre",
}: Props) {
  // “Suaviza” las entradas para no bloquear la UI mientras cambian
  const deferredBusqueda = useDeferredValue(busqueda);
  const deferredProductos = useDeferredValue(productos);

  // Collator (más rápido y consistente que llamar localeCompare en cada render)
  const collator = useMemo(
    () => new Intl.Collator("es", { numeric: true, sensitivity: "base" }),
    []
  );

  // Filtrado sólo cuando NO es alias (cuando es alias, ya llega filtrado desde el servidor)
  const filtrados = useMemo(() => {
    let list = deferredProductos;

    if (!buscarPorAlias && deferredBusqueda.trim()) {
      const lc = deferredBusqueda.trim().toLowerCase();
      list = list.filter((p) =>
        (p.nombre_calculado || "").toLowerCase().includes(lc)
      );
    }

    // Orden barato
    if (orden === "nombre") {
      list = [...list].sort((a, b) =>
        collator.compare(a.nombre_calculado ?? "", b.nombre_calculado ?? "")
      );
    } else {
      // precio: usa el primer precio (ajústalo si tu UI muestra otro)
      list = [...list].sort((a, b) => {
        const pa = Number(a.precios?.[0]?.precio_venta ?? 0);
        const pb = Number(b.precios?.[0]?.precio_venta ?? 0);
        return pa - pb;
      });
    }

    return list;
  }, [deferredProductos, deferredBusqueda, buscarPorAlias, orden, collator]);

  // Lista “deferida” para que la paginación/render no se sienta brusca
  const smoothList = useDeferredValue(filtrados);

  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(smoothList.length / productosPorPagina));
  const pageStart = (paginaActual - 1) * productosPorPagina;
  const pageEnd = paginaActual * productosPorPagina;
  const pageItems = smoothList.slice(pageStart, pageEnd);

  // Si se cambia el término y la página queda fuera de rango, vuelve a 1 (defensivo)
  if (paginaActual > totalPaginas && totalPaginas > 0) {
    setTimeout(() => setPaginaActual(1), 0);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Encabezado compacto con contador */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {isSearching ? "Buscando…" : `${smoothList.length} resultado(s)`}
        </div>

        <PaginacionProductos
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onChange={(p) => setPaginaActual(p)}
        />
      </div>

      {/* Grid de tarjetas o skeletons */}
      {pageItems.length === 0 && !isSearching ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground rounded-md border">
          Sin resultados
        </div>
      ) : (
        <div className="grid gap-4 pb-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {(isSearching ? Array.from({ length: Math.min(productosPorPagina, 12) }) : pageItems).map(
            (p, i) =>
              isSearching ? (
                <div
                  key={`sk-${i}`}
                  className="h-[300px] w-full max-w-[260px] mx-auto rounded-lg border bg-white shadow-sm animate-pulse"
                />
              ) : (
                <ProductoCard
                  key={String((p as Producto).detalle_producto_id ?? i)}
                  producto={p as Producto}
                  onAgregar={() => onAgregar(p as Producto)}
                />
              )
          )}
        </div>
      )}

      {/* Paginación al pie (opcional) */}
      <div className="flex items-center justify-end">
        <PaginacionProductos
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onChange={(p) => setPaginaActual(p)}
        />
      </div>
    </div>
  );
}
