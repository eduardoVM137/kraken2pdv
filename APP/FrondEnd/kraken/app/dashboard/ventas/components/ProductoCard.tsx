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
    id:               number;
    nombre:           string;
    precio:           number;
    cantidad:         number;
    presentacion_id?: number;
    inventarios:      number[];    // <–– añadimos el array
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
    const cantidad = seleccionada.cantidad_presentacion || 1;
    const nombre   = seleccionada.presentacion_id
      ? `${producto.nombre_calculado} (${seleccionada.nombre_presentacion} x${cantidad})`
      : producto.nombre_calculado;

    onAgregar({
      id:               producto.detalle_producto_id,
      nombre,
      precio:           seleccionarPrecio(),
      cantidad,
      presentacion_id:  seleccionada.presentacion_id,
      inventarios:      producto.inventarios,  // <–– aquí
    });
  };
  return (
    <div
      className="border rounded-lg p-2 bg-white shadow hover:shadow-md transition-all h-[300px] w-full max-w-[250px] mx-auto flex flex-col justify-between cursor-pointer"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("button")) agregar();
      }}
    >
      {/* Imagen más grande */}
      <div className="flex justify-center items-center h-28">
        <img
          src={producto.fotos?.[0] || "/default-product.jpg"}
          alt={producto.nombre_calculado}
          className="h-full w-auto object-contain"
        />
      </div>

      {/* Info */}
      <div className="flex-grow flex flex-col justify-center text-center mt-1 px-1">
        <h3 className="font-medium text-sm line-clamp-2 leading-tight mb-[2px]">
          {producto.nombre_calculado}
        </h3>
        <p className="text-green-700 font-semibold text-sm mb-[2px]">
          ${seleccionarPrecio().toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground mb-0">
          Stock: {producto.stock_total}
        </p>
      </div>

      {/* Presentaciones */}
      {producto.presentaciones?.length > 0 && (
        <TooltipProvider>
          <div className="flex gap-1 overflow-x-auto mt-[4px] px-1">
            {producto.presentaciones.map((p: any) => (
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
      )}
    </div>
  );
}
