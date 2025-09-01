// app/dashboard/ventas/components/settings/PrinterPanel.tsx
"use client";

import { Settings, XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

type Props = {
  visibles: string[];
  verificadas: string[];
  noVerificadas: string[];
  nombreImpresora: string;      // "" = default Windows
  setNombreImpresora: (v: string) => void;
  tamanoPapel: "58mm" | "80mm";
  setTamanoPapel: (v: "58mm" | "80mm") => void;
  cargando?: boolean;
  pos58Disponible?: boolean;
  seleccionDisponible?: boolean;
  panelColapsado: boolean;
  setPanelColapsado: (b: boolean) => void;
  refreshPrinters: () => void;
};

export default function PrinterPanel(props: Props) {
  const {
    visibles, verificadas, noVerificadas,
    nombreImpresora, setNombreImpresora,
    tamanoPapel, setTamanoPapel,
    cargando, pos58Disponible = false,
    seleccionDisponible = true,
    panelColapsado, setPanelColapsado,
    refreshPrinters,
  } = props;

  // Evita mismatch SSR/CSR
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const btnTitle = mounted ? (panelColapsado ? "Mostrar opciones" : "Ocultar opciones") : undefined;

  return (
    <div className="border-b">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          {!seleccionDisponible && !!nombreImpresora && (
            <Badge variant="destructive" className="ml-2">selección no disponible</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPanelColapsado(!panelColapsado)}
          title={btnTitle}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Cuerpo: solo renderiza después de montar */}
      {mounted && !panelColapsado && (
        <div className="p-3 pt-0 space-y-3">
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
                {visibles.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                    {!verificadas.includes(n) && " (no verificada)"}
                  </SelectItem>
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

          {/* Estado */}
          <div className="flex items-center gap-4 text-sm">
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

          {/* Listas */}
          <div className="text-xs text-muted-foreground">
            Detectadas por QZ ({verificadas.length}):{" "}
            {verificadas.length
              ? verificadas.map((n) => <Badge key={n} className="mr-1 mb-1">{n}</Badge>)
              : "— ninguna —"}
          </div>
          {noVerificadas.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Predeterminadas de Windows (no verificadas) ({noVerificadas.length}):{" "}
              {noVerificadas.map((n) => <Badge key={n} variant="outline" className="mr-1 mb-1">{n}</Badge>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
