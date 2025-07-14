"use client";

import { useEffect, useState } from "react";
import { getUbicacionDetallada } from "@/lib/fetchers/ubicacion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface Props {
  detalleProductoId: number;
}

export default function DetalleUbicacion({ detalleProductoId }: Props) {
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<string>("__ALL__");
  const [ubicacionFiltro, setUbicacionFiltro] = useState<string>("__ALL__");

  useEffect(() => {
    if (!detalleProductoId) return;
    const fetchData = async () => {
      const data = await getUbicacionDetallada(detalleProductoId);
      setUbicaciones(data);
    };
    fetchData();
  }, [detalleProductoId]);

  const tiposUnicos = Array.from(
    new Set(ubicaciones.map((u) => u.tipo_ubicacion))
  ).filter(Boolean);
  const ubicacionesUnicas = Array.from(
    new Set(ubicaciones.map((u) => u.nombre_ubicacion))
  ).filter(Boolean);

  const filtradas = ubicaciones.filter((u) => {
    const coincideTipo =
      tipoFiltro === "__ALL__" || u.tipo_ubicacion === tipoFiltro;
    const coincideUbicacion =
      ubicacionFiltro === "__ALL__" || u.nombre_ubicacion === ubicacionFiltro;
    return coincideTipo && coincideUbicacion;
  });

  // Agrupar por ubicación > estante > posición
  const agrupadas = Object.values(
    filtradas.reduce((acc, u) => {
      const keyUbicacion = `${u.nombre_ubicacion}||${u.tipo_ubicacion}`;
      if (!acc[keyUbicacion]) {
        acc[keyUbicacion] = {
          nombre_ubicacion: u.nombre_ubicacion,
          tipo_ubicacion: u.tipo_ubicacion,
          totalStock: 0,
          estantes: {},
        };
      }

      const estanteKey = u.nombre_contenedor || "Sin estante";
      if (!acc[keyUbicacion].estantes[estanteKey]) {
        acc[keyUbicacion].estantes[estanteKey] = {
          descripcion: u.descripcion_contenedor,
          subtotal: 0,
          posiciones: [],
        };
      }

      acc[keyUbicacion].totalStock += u.cantidad;
      acc[keyUbicacion].estantes[estanteKey].subtotal += u.cantidad;
      acc[keyUbicacion].estantes[estanteKey].posiciones.push({
        fila: u.fila,
        columna: u.columna,
        cantidad: u.cantidad,
      });

      return acc;
    }, {} as Record<string, any>)
  );

  return (
    <TooltipProvider>
      <div>
        <h3 className="text-lg font-semibold mb-4">Ubicaciones físicas registradas</h3>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="space-y-1">
            <Label>Tipo de ubicación</Label>
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">Todos</SelectItem>
                {tiposUnicos.map((tipo, i) => (
                  <SelectItem key={i} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Ubicación</Label>
            <Select value={ubicacionFiltro} onValueChange={setUbicacionFiltro}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todas las ubicaciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">Todas</SelectItem>
                {ubicacionesUnicas.map((ubic, i) => (
                  <SelectItem key={i} value={ubic}>
                    {ubic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tarjetas agrupadas */}
 <ScrollArea className="h-[500px] pr-2">
  {agrupadas.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {agrupadas.map((ubic, i) => (
        <Card
          key={i}
          className="p-4 text-sm border border-gray-300 shadow-sm rounded-lg bg-white max-w-full w-full"
        >
          <CardContent className="p-0 space-y-4">
            {/* Header ubicación */}
            <div className="flex flex-wrap gap-2 text-xs font-medium mb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full cursor-help">
                    {ubic.nombre_ubicacion}
                  </span>
                </TooltipTrigger>
                <TooltipContent>Zona o almacén donde se encuentra el producto</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full cursor-help">
                    {ubic.tipo_ubicacion}
                  </span>
                </TooltipTrigger>
                <TooltipContent>Tipo de ubicación (Ej: Bodega, Punto de venta)</TooltipContent>
              </Tooltip>
            </div>

            <div className="text-sm font-semibold text-gray-800">
              Total stock:{" "}
              <span className="text-amber-700 font-bold">{ubic.totalStock}</span>
            </div>

            {/* Estantes */}
            {Object.entries(ubic.estantes).map(([nombreEstante, est], j) => (
              <div
                key={j}
                className="bg-gray-100 p-3 rounded-md border border-gray-200 space-y-2"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm font-semibold text-gray-900 flex flex-wrap gap-2 cursor-help">
                     🗄️  <span className="text-gray-700">Estante:</span>{" "}
                      <span className="text-black">{nombreEstante}</span> —{" "}
                      <span className="text-amber-700 font-semibold">
                        {est.subtotal} piezas
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Contenedor o agrupación interna</TooltipContent>
                </Tooltip>

                {est.descripcion && (
                  <p className="text-xs italic text-muted-foreground text-gray-500">
                    {est.descripcion}
                  </p>
                )}

                <ul className="text-sm text-gray-700 space-y-1 pl-3">
                  {est.posiciones.map((pos: any, k: number) => (
                    <Tooltip key={k}>
                      <TooltipTrigger asChild>
                        <li className="flex items-center gap-1 cursor-help">
                          <span className="text-red-600">📦</span> F{pos.fila}, C{pos.columna} —{" "}
                          <strong>{pos.cantidad}</strong> piezas
                        </li>
                      </TooltipTrigger>
                      <TooltipContent>
                        Posición exacta en la estructura (Fila, Columna)
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground text-sm mt-4">
      No hay ubicaciones físicas registradas.
    </p>
  )}
</ScrollArea>


      </div>
    </TooltipProvider>
  );
}
