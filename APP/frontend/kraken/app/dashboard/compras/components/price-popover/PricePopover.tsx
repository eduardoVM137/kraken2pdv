"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PriceRow from "./PriceRow";
import useToggle from "@/hooks/useToggle";

// Tipado
export type Price = {
  precio_id: number;
  producto_ubicacion_id: number;
  precio_venta: number;
  precio_costo: number;
  ubicacion_nombre: string;
};

interface Props {
  rowId: string;
  priceList: Price[];
  piezasTot: number;
  costoUnitNuevo: number;
  preciosEditados: Record<number, number>;
  setPreciosEditados: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  distrib: Record<string, Record<number, number>>;
  setDistrib: React.Dispatch<React.SetStateAction<Record<string, Record<number, number>>>>;
}

export default function PricePopover({
  rowId,
  priceList,
  piezasTot,
  costoUnitNuevo,
  preciosEditados,
  setPreciosEditados,
  distrib,
  setDistrib,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { map: showMap, toggle, isActive } = useToggle<number>();
  const [tempPrices, setTempPrices] = useState<Record<number, number>>({});
  const [tempDistrib, setTempDistrib] = useState<Record<number, number>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResumen, setShowResumen] = useState(false);

  const asignadas = Object.values(distrib[rowId] ?? {}).reduce((a, b) => a + b, 0);
  const libres = piezasTot - asignadas;

  const visibles = useMemo(() =>
    priceList.filter(p =>
      p.ubicacion_nombre.toLowerCase().includes(search.toLowerCase())
    ), [search, priceList]);

  useEffect(() => {
    if (open) {
      const basePrices: Record<number, number> = {};
      priceList.forEach(pr => {
        basePrices[pr.precio_id] = preciosEditados[pr.precio_id] ?? pr.precio_venta;
      });
      setTempPrices(basePrices);
      setTempDistrib({ ...(distrib[rowId] ?? {}) });
      setHasChanges(false);
    }
  }, [open]);

  const handleSave = () => {
    setPreciosEditados(prev => ({ ...prev, ...tempPrices }));
    setDistrib(prev => ({ ...prev, [rowId]: tempDistrib }));
    setOpen(false);
  };

  const handleClose = () => {
    if (hasChanges) setShowConfirm(true);
    else setOpen(false);
  };

  const handleRestablecer = () => {
    const basePrices: Record<number, number> = {};
    priceList.forEach(pr => {
      basePrices[pr.precio_id] = pr.precio_venta;
    });
    setTempPrices(basePrices);
    setTempDistrib({ ...(distrib[rowId] ?? {}) });
    setHasChanges(false);
  };

const repartirEquitativo = () => {
  const seleccionadas = visibles.filter(pr =>
    showMap[rowId]?.includes(pr.precio_id)
  );
  if (!seleccionadas.length) return;

  const total = piezasTot;
  const base = Math.floor(total / seleccionadas.length);
  let sobrante = total % seleccionadas.length;

  const nuevaDistrib: Record<number, number> = {};

  seleccionadas.forEach(pr => {
    const extra = sobrante > 0 ? 1 : 0;
    nuevaDistrib[pr.producto_ubicacion_id] = base + extra;
    if (sobrante > 0) sobrante--;
  });

  setTempDistrib(nuevaDistrib);
  setHasChanges(true);
};


  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-32 text-xs">
          Editar precios
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">Editor de precios</DialogTitle>
        <p className="sr-only">Edita precios de venta y piezas a distribuir.</p>

        <div className="flex flex-col h-full">
          <div className="p-4 space-y-2 shrink-0 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-sm font-semibold">
                Costo unit. nuevo: <span className="text-primary font-bold">S/ {costoUnitNuevo.toFixed(2)}</span>
              </span>
              <span className="text-xs text-red-600">
                Asignadas: {Object.values(tempDistrib).reduce((a, b) => a + b, 0)} / {piezasTot} pz
              </span>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                placeholder="Buscar ubicación…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8"
              />
              <Button variant="outline" size="sm" onClick={repartirEquitativo}>
                ⚖ Repartir equitativo
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!showMap[rowId]?.length}
                onClick={() => {
                  const edit = { ...tempPrices };
                  priceList.forEach(pr => {
                    if (!(showMap[rowId] ?? []).includes(pr.precio_id)) return;
                    const base = pr.precio_venta + (costoUnitNuevo - pr.precio_costo);
                    const piso = Math.ceil(Math.max(costoUnitNuevo, pr.precio_costo)) + 1;
                    edit[pr.precio_id] = Math.max(+base.toFixed(2), piso);
                  });
                  setTempPrices(edit);
                  setHasChanges(true);
                }}
              >
                ⇄ Costo
              </Button>
              <Input
                placeholder="% / $"
                disabled={!showMap[rowId]?.length}
                className="h-6 w-16 text-right"
                onKeyDown={e => {
                  if (e.key !== "Enter") return;
                  const raw = e.currentTarget.value.trim();
                  if (!raw) return;
                  const pct = raw.includes("%");
                  const delta = parseFloat(raw.replace(/%/g, "")) || 0;
                  if (!delta) return;
                  const edit = { ...tempPrices };
                  priceList.forEach(pr => {
                    if (!(showMap[rowId] ?? []).includes(pr.precio_id)) return;
                    const base = edit[pr.precio_id] ?? pr.precio_venta;
                    const nuevo = pct
                      ? +(base * (1 + delta / 100)).toFixed(2)
                      : +(base + delta).toFixed(2);
                    edit[pr.precio_id] = nuevo;
                  });
                  setTempPrices(edit);
                  setHasChanges(true);
                  (e.target as HTMLInputElement).value = "";
                }}
              />
              <Button variant="ghost" size="sm" onClick={() => setShowResumen(true)}>
                📋 Resumen
              </Button>
            </div>
          </div>

          <div className="px-4 py-2 space-y-3 grow overflow-y-auto max-h-[55vh]">
            {visibles.map(pr => {
              const locId = pr.producto_ubicacion_id;
              const piezasLoc = tempDistrib[locId] ?? 0;
              const libresRow = piezasTot - Object.values(tempDistrib).reduce((a, b) => a + b, 0);
              const nuevo = tempPrices[pr.precio_id] ?? pr.precio_venta;
              const tieneCambios = nuevo !== pr.precio_venta || piezasLoc > 0;

              return (
                <PriceRow
                  key={locId}
                  pr={pr}
                  costoUnitNuevo={costoUnitNuevo}
                  abierto={isActive(rowId, pr.precio_id)}
                  toggle={() => toggle(rowId, pr.precio_id)}
                  value={nuevo}
                  onChange={n => {
                    setTempPrices(prev => ({ ...prev, [pr.precio_id]: n }));
                    setHasChanges(true);
                  }}
                  piezasAsignadas={piezasLoc}
                  piezasRestantes={libresRow + piezasLoc}
                  setPiezasLoc={n => {
                    setTempDistrib(prev => ({ ...prev, [locId]: n }));
                    setHasChanges(true);
                  }}
                  resaltado={tieneCambios}
                />
              );
            })}
          </div>

          <div className="p-4 border-t shrink-0 flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              Acciones sobre {showMap[rowId]?.length ?? 0} precio(s)
            </span>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={handleRestablecer}>Restablecer</Button>
              <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
              <Button onClick={handleSave} disabled={!hasChanges}>Guardar</Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Confirmación de salida */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm w-[90vw]">
          <DialogTitle>Salir sin guardar</DialogTitle>
          <div className="text-sm space-y-3">
            <p>Hay cambios sin guardar. ¿Deseas guardarlos antes de salir?</p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => { setShowConfirm(false); setOpen(false); }}>
                Salir sin guardar
              </Button>
              <Button onClick={() => { handleSave(); setShowConfirm(false); }}>
                Guardar y salir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal resumen */}
      <Dialog open={showResumen} onOpenChange={setShowResumen}>
        <DialogContent className="max-w-xl">
          <DialogTitle>Resumen de cambios</DialogTitle>
          <div className="text-sm max-h-[60vh] overflow-y-auto">
            <table className="w-full text-sm border mt-4">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="text-left p-1">Ubicación</th>
                  <th className="text-right p-1">Precio ant.</th>
                  <th className="text-right p-1">Precio nuevo</th>
                  <th className="text-right p-1">Piezas</th>
                </tr>
              </thead>
              <tbody>
                {priceList.map(pr => {
                  const nuevo = tempPrices[pr.precio_id] ?? pr.precio_venta;
                  const piezas = tempDistrib[pr.producto_ubicacion_id] ?? 0;
                  const huboCambio = nuevo !== pr.precio_venta || piezas > 0;
                  if (!huboCambio) return null;
                  return (
                    <tr key={pr.precio_id} className="border-b">
                      <td className="p-1">{pr.ubicacion_nombre}</td>
                      <td className="p-1 text-right">{pr.precio_venta.toFixed(2)}</td>
                      <td className="p-1 text-right">{nuevo.toFixed(2)}</td>
                      <td className="p-1 text-right">{piezas}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
