import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface Props {
  producto: any;
  onAgregar: (p: {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    presentacion_id?: number;
  }) => void;
}

export default function ProductoCard({ producto, onAgregar }: Props) {
  const [seleccionada, setSeleccionada] = useState(
    producto.presentaciones?.[0] ?? {
      cantidad_presentacion: 1,
      nombre_presentacion: "",
      presentacion_id: undefined,
    }
  );

  const seleccionarPrecio = () => {
    if (!producto.precios?.length) return 0;
    const conPresentacion = producto.precios.find(
      (p: any) => p.presentacion_id === seleccionada.presentacion_id
    );
    const sinPresentacion = producto.precios.find(
      (p: any) => p.presentacion_id == null
    );
    return parseFloat(conPresentacion?.precio_venta || sinPresentacion?.precio_venta || 0);
  };

  const agregar = () => {
    const cantidad = seleccionada?.cantidad_presentacion || 1;
    const nombre = seleccionada?.presentacion_id
      ? `${producto.nombre_calculado} (${seleccionada.nombre_presentacion} x${cantidad})`
      : producto.nombre_calculado;

    onAgregar({
      id: producto.detalle_producto_id,
      nombre,
      precio: seleccionarPrecio(),
      cantidad,
      presentacion_id: seleccionada.presentacion_id,
    });
  };

  return (
    <div
      className="border rounded-lg p-3 bg-white shadow flex flex-col justify-between cursor-pointer hover:ring-2 ring-blue-500 transition-all h-[260px] w-[230px]"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("button")) agregar();
      }}
    >
      {/* Imagen generosa */}
      <div className="flex justify-center items-center">
        <img
          src={producto.fotos?.[0] || "/default-product.jpg"}
          alt={producto.nombre_calculado}
          className="h-28 w-28 object-contain"
        />
      </div>

      {/* Información */}
      <div className="flex flex-col items-center mt-1 text-sm">
        <h3 className="font-semibold text-center text-[14px] leading-tight line-clamp-2">
          {producto.nombre_calculado}
        </h3>
        <p className="text-[14px] mt-1">
          Precio: <strong>${seleccionarPrecio().toFixed(2)}</strong>
        </p>
        <p className="text-[12px] text-muted-foreground">Stock: {producto.stock_total}</p>
      </div>

      {/* Presentaciones (tamaño ideal) */}
      <TooltipProvider>
        <div className="flex gap-1 overflow-x-auto mt-2 px-1">
          {producto.presentaciones?.map((p: any) => (
            <Tooltip key={p.presentacion_id}>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    seleccionada.presentacion_id === p.presentacion_id
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="text-[11px] px-3 py-1 h-7 min-w-[75px] truncate"
                  onClick={(e) => {
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
    </div>
  );
}
