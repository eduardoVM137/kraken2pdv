
// components/GridProducto.tsx
"use client";

import { useMemo, useState }    from "react";
import ProductoCard             from "./ProductoCard";
import PaginacionProductos      from "./PaginacionProductos";
import { Button }               from "@/components/ui/button";
import { ScrollArea }           from "@/components/ui/scroll-area";

interface Props {
  productos: any[];
  onAgregar: (p: any) => void;
  busqueda: string;
  paginaActual: number;
  setPaginaActual: (n: number) => void;
  productosPorPagina?: number;
  buscarPorAlias?: boolean;
}

export default function GridProducto({
  productos,
  onAgregar,
  busqueda,
  paginaActual,
  setPaginaActual,
  productosPorPagina = 15,
  buscarPorAlias = false,
}: Props) {

  /* ────── orden ────── */
  const [orden, setOrden] = useState<"nombre" | "precio">("nombre");

  /* ────── filtro + orden ────── */
const filtrados = useMemo(() => {
  let res = [...productos];

  // Solo filtramos por nombre si no es búsqueda por alias
  if (!buscarPorAlias && busqueda.trim()) {
    res = res.filter((p) =>
      p.nombre_calculado?.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  // En ambos modos (nombre o alias), sí podemos ordenar
  res.sort((a, b) =>
    orden === "nombre"
      ? a.nombre_calculado.localeCompare(b.nombre_calculado)
      : Number(a.precios?.[0]?.precio_venta ?? 0) -
        Number(b.precios?.[0]?.precio_venta ?? 0)
  );

  return res;
}, [productos, busqueda, orden, buscarPorAlias]);


  /* ────── paginación ────── */
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / productosPorPagina));
  const pageItems    = filtrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina,
  );

  /* ────── render ────── */
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* controles */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">Ordenar por:</span>
          <Button
            variant={orden === "nombre" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrden("nombre")}
          >
            Nombre
          </Button>
          <Button
            variant={orden === "precio" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrden("precio")}
          >
            Precio
          </Button>
        </div>

        <PaginacionProductos
          totalPaginas={totalPaginas}
          paginaActual={paginaActual}
          setPaginaActual={setPaginaActual}
        />
      </div>

      {/* grid con scroll vertical */}
      <ScrollArea className="flex-1 min-h-0 pr-2 overflow-x-hidden">
        {pageItems.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Sin resultados
          </div>
        ) : (
          <div
            className="grid gap-4 pb-4
                       [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]"
          >
            {pageItems.map((p) => (
              <ProductoCard
                key={p.detalle_producto_id}
                producto={p}
                onAgregar={onAgregar}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
