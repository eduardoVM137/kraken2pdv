// components/ProductoCard.tsx
"use client";
import React, { useEffect, useRef, useState, memo, MouseEvent } from "react";

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

/* ============================ SmartImage ============================ */
const DEFAULT_IMG = "/default-product.jpg";

type SmartImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  boxClassName?: string; // reserva de espacio para evitar saltos
};

/**
 * - Siempre muestra DEFAULT_IMG de inicio (nunca src="").
 * - Cuando entra al viewport, precarga la real y hace swap con fade-in.
 * - Shimmer mientras carga.
 */
const SmartImage = memo(function SmartImage({
  src,
  alt,
  className = "h-full w-auto object-contain",
  boxClassName = "h-28 w-full",
}: SmartImageProps) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [displaySrc, setDisplaySrc] = useState<string>(DEFAULT_IMG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const real = (src && src.trim().length > 0 ? src : null) || null;
    if (!real) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const img = new Image();
        img.decoding = "async";
        img.loading = "eager";
        img.src = real;
        img.onload = () => setDisplaySrc(real);
        img.onerror = () => setDisplaySrc(DEFAULT_IMG);

        io.disconnect();
      },
      { rootMargin: "250px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <div
      ref={boxRef}
      className={`relative ${boxClassName} flex items-center justify-center overflow-hidden rounded-md`}
      style={{ contentVisibility: "auto" as any, containIntrinsicSize: "112px 240px" as any }}
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-muted/60" />}

      <img
        src={displaySrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        // @ts-ignore
        fetchPriority="low"
        className={`${className} transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (displaySrc !== DEFAULT_IMG) setDisplaySrc(DEFAULT_IMG);
          else setLoaded(true);
        }}
      />
    </div>
  );
});
/* ========================== /SmartImage ============================= */

/**
 * Props del componente
 */
interface Props {
  producto: {
    id: number;
    detalle_producto_id: number;
    nombre_calculado: string;
    fotos?: string[];
    precios?: { presentacion_id?: number; precio_venta: string }[];
    presentaciones?: {
      presentacion_id?: number;
      nombre_presentacion: string;
      cantidad_presentacion: number;
    }[];
    inventarios: number[];
    stock_total?: number;
  };
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
 * Tarjeta de producto con menú contextual y tooltips.
 */
function ProductoCard({ producto, onAgregar }: Props) {
  const router = useRouter();

  const [seleccionada, setSeleccionada] = useState(
    producto.presentaciones?.[0] || {
      presentacion_id: undefined,
      nombre_presentacion: "",
      cantidad_presentacion: 1,
    }
  );

  const seleccionarPrecio = (): number => {
    const porPres = producto.precios?.find(
      (p) => p.presentacion_id === seleccionada.presentacion_id
    );
    const base = producto.precios?.find((p) => p.presentacion_id == null);
    return parseFloat(porPres?.precio_venta || base?.precio_venta || "0");
  };

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

  const goEditar = () => {
    router.push(`/dashboard/productos/editar/${producto.detalle_producto_id}`);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          style={{ contentVisibility: "auto" as any, containIntrinsicSize: "300px 250px" as any }}
          className="border rounded-lg p-2 bg-white shadow hover:shadow-md transition-all h-[300px] w-full max-w-[250px] mx-auto flex flex-col justify-between cursor-pointer"
          onClick={(e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest("button")) agregar();
          }}
        >
          {/* Imagen diferida con fallback a default */}
          <div className="flex justify-center items-center">
            <SmartImage
              src={producto.fotos?.[0] || null}
              alt={producto.nombre_calculado ?? "Producto"}
              boxClassName="h-28 w-full"
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
              <p className="text-xs text-muted-foreground">Stock: {producto.stock_total}</p>
            )}
          </div>

          {/* Presentaciones */}
          {!!producto.presentaciones?.length && (
            <TooltipProvider>
              <div
                className="flex gap-1 overflow-x-auto mt-2 px-1"
                onClick={(e: MouseEvent) => e.stopPropagation()}
              >
                {producto.presentaciones.map((p, idx) => (
                  <Tooltip key={p.presentacion_id ?? idx}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          seleccionada.presentacion_id === p.presentacion_id ? "default" : "ghost"
                        }
                        size="sm"
                        className={`border text-[11px] px-2 h-6 min-w-[40px] justify-center rounded-md transition-all
                          ${
                            seleccionada.presentacion_id === p.presentacion_id
                              ? "bg-black text-white border-black"
                              : "bg-muted text-gray-800 hover:border-gray-500"
                          }`}
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

      {/* Menú contextual */}
      <ContextMenuContent align="end">
        <ContextMenuItem onSelect={agregar}>Agregar al carrito</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={goEditar}>Editar producto</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default memo(ProductoCard);
