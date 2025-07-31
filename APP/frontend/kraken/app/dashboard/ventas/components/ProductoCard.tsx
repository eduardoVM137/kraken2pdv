// components/ProductoCard.tsx
"use client";

import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

/**
 * Props for ProductoCard component
 */
interface Props {
  producto: {
    /** Identificador principal para rutas de edición */
    id: number;
    /** Identificador de detalle para agregar al carrito */
    detalle_producto_id: number;
    /** Nombre calculado completo del producto */
    nombre_calculado: string;
    /** URLs de imágenes (primera utilizada como miniatura) */
    fotos?: string[];
    /** Lista de precios por presentación */
    precios?: { presentacion_id?: number; precio_venta: string }[];
    /** Opciones de presentaciones disponibles */
    presentaciones?: {
      presentacion_id?: number;
      nombre_presentacion: string;
      cantidad_presentacion: number;
    }[];
    /** Arrays de inventario asociados */
    inventarios: number[];
    /** Stock total si aplica */
    stock_total?: number;
  };
  /** Función callback al agregar producto al carrito */
  onAgregar: (item: {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    presentacion_id?: number;
    inventarios: number[];
  }) => void;
}

/**
 * Componente de tarjeta para mostrar un producto,
 * con menú contextual para acciones y soporte de tooltips.
 */
export default function ProductoCard({ producto, onAgregar }: Props) {
  const router = useRouter();

  // Estado local: presentación seleccionada inicialmente
  const [seleccionada, setSeleccionada] = useState(
    producto.presentaciones?.[0] || {
      presentacion_id: undefined,
      nombre_presentacion: "",
      cantidad_presentacion: 1,
    }
  );

  /**
   * Devuelve el precio numérico de la presentación seleccionada,
   * o precio base si no hay correspondencia.
   */
  const seleccionarPrecio = (): number => {
    const porPres = producto.precios?.find(
      (p) => p.presentacion_id === seleccionada.presentacion_id
    );
    const base = producto.precios?.find((p) => p.presentacion_id == null);
    return parseFloat(porPres?.precio_venta || base?.precio_venta || "0");
  };

  /**
   * Callback para agregar el producto al carrito,
   * construyendo el nombre y cantidad con la presentación.
   */
  const agregar = () => {
    const cantidad = seleccionada.cantidad_presentacion || 1;
    const nombre = seleccionada.presentacion_id
      ? `${producto.nombre_calculado} (${seleccionada.nombre_presentacion}) x${cantidad}`
      : producto.nombre_calculado;

    onAgregar({
      id: producto.detalle_producto_id,
      nombre,
      precio: seleccionarPrecio(),
      cantidad,
      presentacion_id: seleccionada.presentacion_id,
      inventarios: producto.inventarios,
    });
  };

  /**
   * Navega a la página de edición dentro del dashboard
   */
  const goEditar = () => {
    router.push(`/dashboard/productos/editar/${producto.detalle_producto_id}`);
  };

  return (
    <ContextMenu>
      {/* El trigger engloba toda la tarjeta */}
      <ContextMenuTrigger asChild>
        <div
          className="border rounded-lg p-2 bg-white shadow hover:shadow-md transition-all h-[300px] w-full max-w-[250px] mx-auto flex flex-col justify-between cursor-pointer"
          onClick={(e: MouseEvent) => {
            // Click general en tarjeta agrega al carrito
            if (!(e.target as HTMLElement).closest("button")) {
              agregar();
            }
          }}
        >
          {/* Imagen del producto */}
          <div className="flex justify-center items-center h-28">
            <img
              src={producto.fotos?.[0] || "/default-product.jpg"}
              alt={producto.nombre_calculado}
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Nombre, precio y stock */}
          <div className="flex-grow flex flex-col justify-center text-center mt-1 px-1">
            <h3 className="font-medium text-sm line-clamp-2 mb-1">
              {producto.nombre_calculado}
            </h3>
            <p className="text-green-700 font-semibold text-sm mb-1">
              ${seleccionarPrecio().toFixed(2)}
            </p>
            {producto.stock_total != null && (
              <p className="text-xs text-muted-foreground">
                Stock: {producto.stock_total}
              </p>
            )}
          </div>

          {/* Selector de presentaciones con tooltip, y captura de click para evitar propagar */}
          {producto.presentaciones && (
            <TooltipProvider>
              <div
                className="flex gap-1 overflow-x-auto mt-2 px-1"
                onClick={(e: MouseEvent) => e.stopPropagation()}
              >
                {producto.presentaciones.map((p) => (
                  <Tooltip key={p.presentacion_id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          seleccionada.presentacion_id === p.presentacion_id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="text-[10px] px-2 py-0.5 h-6 truncate"
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          setSeleccionada(p);
                        }}
                      >
                        {p.nombre_presentacion}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{p.nombre_presentacion}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          )}
        </div>
      </ContextMenuTrigger>

      {/* Menu contextual con acciones */}
      <ContextMenuContent align="end">
        <ContextMenuItem onSelect={agregar}>
          Agregar al carrito
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={goEditar}>
          Editar producto
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
