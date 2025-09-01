// app/dashboard/ventas/components/settings/PrinterSelector.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { XCircle, CheckCircle } from "lucide-react";

type Props = {
  impresoras: string[];
  cargando?: boolean;
  nombreImpresora: string;                 // "" => default Windows
  setNombreImpresora: (n: string) => void;
  tamanoPapel: "58mm" | "80mm";
  setTamanoPapel: (t: "58mm" | "80mm") => void;
  refreshPrinters: () => void;
  pos58Disponible?: boolean;
  seleccionDisponible?: boolean;
};

export default function PrinterSelector({
  impresoras, cargando,
  nombreImpresora, setNombreImpresora,
  tamanoPapel, setTamanoPapel,
  refreshPrinters,
  pos58Disponible = false,
  seleccionDisponible = true,
}: Props) {
  const mostrarNoDisponible = nombreImpresora && !seleccionDisponible;

  return (
    <div className="flex flex-col gap-3 p-3 border rounded-md bg-white">
      <div className="flex items-center gap-2">
        <Label className="w-28">Impresora:</Label>
        <Select
          value={nombreImpresora || "DEFAULT"}
          onValueChange={(v) => setNombreImpresora(v === "DEFAULT" ? "" : v)}
        >
          <SelectTrigger className="min-w-[260px]">
            <SelectValue placeholder="Default de Windows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DEFAULT">Default de Windows</SelectItem>
            {mostrarNoDisponible && (
              <SelectItem value={nombreImpresora} disabled>
                {nombreImpresora} (no disponible)
              </SelectItem>
            )}
            {impresoras.map((n) => (
              <SelectItem key={n} value={n}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={refreshPrinters} disabled={!!cargando}>
          {cargando ? "Buscando..." : "Actualizar"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Label className="w-28">Papel:</Label>
        <Select value={tamanoPapel} onValueChange={(v: "58mm" | "80mm") => setTamanoPapel(v)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="58mm">58mm</SelectItem>
            <SelectItem value="80mm">80mm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estado de preferidas */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          {pos58Disponible ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span>POS-58: {pos58Disponible ? "disponible" : "no disponible"}</span>
        </div>

        {nombreImpresora ? (
          <div className="flex items-center gap-1">
            {seleccionDisponible ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span>
              Seleccionada: {nombreImpresora}{" "}
              {!seleccionDisponible && <Badge variant="destructive">no disponible</Badge>}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Usando default de Windows</span>
          </div>
        )}
      </div>

      {/* Lista visible de impresoras detectadas */}
      <div className="text-xs text-muted-foreground">
        Detectadas ({impresoras.length}):{" "}
        {impresoras.length
          ? impresoras.map((n) => <Badge key={n} className="mr-1 mb-1">{n}</Badge>)
          : "— ninguna —"}
      </div>
    </div>
  );
}
