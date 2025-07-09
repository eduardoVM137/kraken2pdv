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

  const tiposUnicos = Array.from(new Set(ubicaciones.map(u => u.tipo_ubicacion))).filter(Boolean);
  const ubicacionesUnicas = Array.from(new Set(ubicaciones.map(u => u.nombre_ubicacion))).filter(Boolean);

  const filtradas = ubicaciones.filter((u) => {
    const coincideTipo = tipoFiltro === "__ALL__" || u.tipo_ubicacion === tipoFiltro;
    const coincideUbicacion = ubicacionFiltro === "__ALL__" || u.nombre_ubicacion === ubicacionFiltro;
    return coincideTipo && coincideUbicacion;
  });

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

        {/* Grid de tarjetas */}
        <ScrollArea className="h-[500px] pr-2">
          {filtradas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtradas.map((ubi, i) => (
                <Card
                  key={i}
                  className="p-3 text-sm border shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-between"
                >
                  <CardContent className="p-0 space-y-2">
                    <div className="flex flex-wrap gap-1 text-xs font-medium">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                            {ubi.nombre_ubicacion}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>Ubicación</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                            {ubi.tipo_ubicacion}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>Tipo</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                            {ubi.nombre_contenedor}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>Contenedor</TooltipContent>
                      </Tooltip>
                    </div>

                    {ubi.descripcion_contenedor && (
                      <p className="text-xs italic text-muted-foreground">
                        {ubi.descripcion_contenedor}
                      </p>
                    )}

                    <div className="text-xs">
                      <strong>Pos:</strong> F{ubi.fila}, C{ubi.columna}
                    </div>
                    <div className="text-xs">
                      <strong>Stock:</strong> {ubi.cantidad}
                    </div>
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
