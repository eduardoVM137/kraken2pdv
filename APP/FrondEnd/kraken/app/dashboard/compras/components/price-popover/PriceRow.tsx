"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { classNames } from "./utils";

/* ---------- Tipos ---------- */
type Price = {
  precio_id: number;
  precio_venta: number;
  precio_costo: number;
  ubicacion_nombre: string;
  ubicacion_fisica_id: number;
};

interface Props {
  pr: Price;
  costoUnitNuevo: number;

  value: number;
  onChange: (n: number) => void;

  piezasAsignadas: number;
  piezasRestantes: number;
  setPiezasLoc: (n: number) => void;

  abierto: boolean;
  toggle: () => void;

  resaltado?: boolean;
}

/* ───────────────────────────────────────────── */
export default function PriceRow({
  pr,
  costoUnitNuevo,
  value,
  onChange,
  piezasAsignadas,
  piezasRestantes,
  setPiezasLoc,
  abierto,
  toggle,
  resaltado = false,
}: Props) {
  const costoRef = Math.max(costoUnitNuevo, pr.precio_costo);
  const costoCamb = Math.abs(costoUnitNuevo - pr.precio_costo) > 1e-2;

  const pill =
    pr.precio_venta < costoRef - 1e-3
      ? "bg-red-50 text-red-800 border-red-300"
      : costoCamb
      ? "bg-yellow-50 text-yellow-800 border-yellow-300"
      : "bg-green-50 text-green-800 border-green-300";

  const margenPct = ((value - costoRef) / costoRef) * 100;
  const margenColor = margenPct <= 0 ? "text-red-600" : "text-green-600";

  const handlePiecesChange = (raw: string) => {
    const n = Math.floor(Number(raw));
    if (isNaN(n)) return;
    const clamped = Math.max(0, Math.min(n, piezasRestantes));
    setPiezasLoc(clamped);
  };

  const handle100 = () => {
    setPiezasLoc(piezasRestantes);
  };

  return (
    <div className="space-y-1">
      {/* ── Pastilla ── */}
      <button
        onClick={toggle}
        className={classNames(
          "inline-flex items-center px-3 py-1 border rounded-full text-xs font-medium transition-colors",
          pill,
          abierto && "ring-2 ring-sky-400",
          resaltado && "ring-2 ring-indigo-500"
        )}
      >
        {pr.ubicacion_nombre} — {pr.precio_venta.toFixed(0)} /{" "}
        {pr.precio_costo.toFixed(0)}
      </button>

      {/* ── Panel ── */}
      {abierto && (
        <div className="bg-muted/10 border rounded p-3 space-y-2">
          {/* Título e input */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{pr.ubicacion_nombre}</span>
            <div className="flex flex-col items-end">
              <Input
                type="number"
                className={`h-7 w-24 text-right ${
                  value < costoRef - 1e-3 ? "border-red-500" : ""
                }`}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              />
              <p className={`text-[10px] ${margenColor}`}>
                Margen: {margenPct.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Precios */}
          <p className="text-[11px]">
            Venta actual: <b>{pr.precio_venta.toFixed(2)}</b>
          </p>
          <p
            className={classNames(
              "text-[11px]",
              Math.abs(pr.precio_costo - costoUnitNuevo) < 1e-2
                ? "text-green-600"
                : pr.precio_costo < costoUnitNuevo
                ? "text-red-600"
                : "text-yellow-600"
            )}
          >
            Costo ant.: {pr.precio_costo.toFixed(2)} | Costo nue.:{" "}
            {costoUnitNuevo.toFixed(2)}
          </p>

          {/* Distribución */}
          <div className="text-[11px] pt-1">
            Piezas a enviar:
            <div className="mt-1 flex items-center gap-1">
              <Input
                type="number"
                min={0}
                className={classNames(
                  "h-6 w-20 text-right",
                  piezasAsignadas > piezasRestantes ? "border-red-500" : ""
                )}
                value={piezasAsignadas}
                onChange={(e) => handlePiecesChange(e.target.value)}
              />
              <Button
                variant="ghost"
                size="xs"
                className="px-1"
                disabled={piezasRestantes === 0}
                onClick={handle100}
              >
                100%
              </Button>
              <span className="ml-2 text-muted-foreground">
                libre: {piezasRestantes}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
