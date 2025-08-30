// app/dashboard/ventas/components/search/BuscadorProductos.tsx
"use client";

import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  // Consulta (NO agrega)
  busqueda: string;
  setBusqueda: (value: string) => void;
  setPaginaActual: (value: number) => void;
  buscarPorAlias: boolean;
  setBuscarPorAlias: (value: boolean) => void;
  onSearchEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  // Escáner (SÍ agrega) — opcional para evitar crash si se olvida pasarlo
  onScanEnter?: (args: { code: string; qty: number; raw: string }) => void;
}

/* ---------- Parser: qty*code | code*qty | code ---------- */
function parseQtyCode(rawIn: string): { code: string; qty: number } | null {
  const raw = rawIn.trim();
  if (!raw) return null;
  const parts = raw.split("*").map((s) => s.trim()).filter(Boolean);

  const parseQty = (s: string) => {
    const t = s.replace(",", ".");
    if (!/^(\d+(\.\d*)?|\.\d+)$/.test(t)) return null;
    const v = parseFloat(t);
    return Number.isFinite(v) ? v : null;
  };

  if (parts.length === 2 && parseQty(parts[0]) != null) {
    return { code: parts[1], qty: Math.max(0.01, parseQty(parts[0])!) };
  }
  if (parts.length === 2 && parseQty(parts[1]) != null) {
    return { code: parts[0], qty: Math.max(0.01, parseQty(parts[1])!) };
  }
  return { code: raw, qty: 1 };
}

// …imports y Props iguales…

const BuscadorProductos = forwardRef<HTMLInputElement, Props>(
  (
    {
      busqueda,
      setBusqueda,
      setPaginaActual,
      buscarPorAlias,
      setBuscarPorAlias,
      onSearchEnter,
      onScanEnter,
    },
    ref
  ) => {
    // ----- Debounce de consulta (igual que ya tienes) -----
    const [localQ, setLocalQ] = useState(busqueda);
    useEffect(() => setLocalQ(busqueda), [busqueda]);
    useEffect(() => {
      const t = setTimeout(() => {
        if (localQ === busqueda) return;
        if (localQ.length === 0 || localQ.length >= 2) {
          setBusqueda(localQ);
          setPaginaActual(1);
        }
      }, 250);
      return () => clearTimeout(t);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localQ]);

    // ----- Refs -----
    const consultaRef = useRef<HTMLInputElement>(null);
    const scanRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (typeof ref === "function") ref(consultaRef.current!);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = consultaRef.current!;
    }, [ref]);

    // Helper: enfocar + seleccionar
    const focusSelect = (el?: HTMLInputElement | null) => {
      if (!el) return;
      requestAnimationFrame(() => {
        el.focus();
        try { el.select(); } catch {}
      });
    };

    // ----- “Tab chord” -----
    const chordTimeout = useRef<number | null>(null);
    const [chordFrom, setChordFrom] = useState<"consulta" | "scanner" | null>(null);
    const beginChord = (from: "consulta" | "scanner", onExpire: () => void) => {
      setChordFrom(from);
      if (chordTimeout.current) window.clearTimeout(chordTimeout.current);
      chordTimeout.current = window.setTimeout(() => {
        setChordFrom(null);
        onExpire();
      }, 500);
    };
    const resolveChord = () => {
      if (chordTimeout.current) window.clearTimeout(chordTimeout.current);
      setChordFrom(null);
    };

    // ----- Deduplicador de escaneo (evita CR+LF doble Enter) -----
    const lastScanRef = useRef<{ raw: string; t: number }>({ raw: "", t: 0 });
    const processingRef = useRef(false);

    // ----- Handlers -----
    const handleConsultaKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Ctrl/Cmd + / => escáner
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        focusSelect(scanRef.current);
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        beginChord("consulta", () => {
          setBuscarPorAlias((v) => !v);
          setPaginaActual(1);
        });
        return;
      }
      if (chordFrom === "consulta") {
        const k = e.key.toLowerCase();
        if (k === "s") { // Tab + s => escáner
          e.preventDefault();
          resolveChord();
          focusSelect(scanRef.current);
          return;
        }
        if (k === "t") { // Tab + t => alternar tipo
          e.preventDefault();
          resolveChord();
          setBuscarPorAlias((v) => !v);
          setPaginaActual(1);
          return;
        }
        resolveChord();
      }

      if (e.key === "Enter") {
        setBusqueda(localQ);
        setPaginaActual(1);
      }
      onSearchEnter(e);
    };




 const handleScannerKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Tab") {
    e.preventDefault();
    beginChord("scanner", () => focusSelect(consultaRef.current)); // Tab simple => a consulta (seleccionado)
    return;
  }
  if (chordFrom === "scanner") {
    const k = e.key.toLowerCase();
    if (k === "c") {
      e.preventDefault();
      resolveChord();
      focusSelect(consultaRef.current);
      return;
    }
    resolveChord();
  }

  if (e.key !== "Enter") return;

  // Bloqueo de re-entrada + limpieza + stop bubbling
  if (processingRef.current) { e.preventDefault(); e.stopPropagation(); return; }
  processingRef.current = true;
  e.preventDefault();
  e.stopPropagation();

  // Algunos lectores envían CR/LF -> límpialos
  const raw0 = (e.currentTarget.value || "");
  const raw = raw0.replace(/[\r\n]+/g, "").trim();

  // Dedupe local por raw en 350ms
  const now = Date.now();
  if (raw === lastScanRef.current.raw && now - lastScanRef.current.t < 350) {
    processingRef.current = false;
    focusSelect(scanRef.current);
    return;
  }
  lastScanRef.current = { raw, t: now };

  const parsed = parseQtyCode(raw);
  if (!parsed || typeof onScanEnter !== "function") {
    processingRef.current = false;
    focusSelect(scanRef.current);
    return;
  }

  // Permite handlers async
  await Promise.resolve(onScanEnter({ code: parsed.code, qty: parsed.qty, raw }));

  // Mantener foco en escáner y seleccionar TODO para el siguiente código
  focusSelect(scanRef.current);

  // Libera el candado (siguiente tick)
  setTimeout(() => { processingRef.current = false; }, 0);
};

    return (
      <div className="flex flex-wrap items-end gap-2 mb-4">
        {/* Consulta + switch */}
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center justify-between">
            <Label htmlFor="consulta" className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Consulta (no agrega)
            </Label>
            <div className="flex items-center gap-2">
              <Label className="text-[11px]">Nombre</Label>
              <Switch
                checked={buscarPorAlias}
                onCheckedChange={(v) => { setBuscarPorAlias(v); setPaginaActual(1); }}
                aria-label="Alternar búsqueda por Alias"
              />
              <Label className="text-[11px]">Alias</Label>
            </div>
          </div>

          <Input
            id="consulta"
            ref={consultaRef}
            placeholder="Buscar producto…"
            className="mt-1"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            onKeyDown={handleConsultaKey}
            onFocus={(e) => e.currentTarget.select()}   // ← al llegar desde escáner queda seleccionado
          />
          <div className="mt-1 text-[11px] text-muted-foreground">
            {`Buscando por: ${buscarPorAlias ? "Alias" : "Nombre"} · Tab alterna · Tab+S → Escáner`}
          </div>
        </div>

        {/* Escáner (agregar) */}
        <div className="w-[170px]">
          <Label htmlFor="scanner" className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Escáner (agregar)
          </Label>
          <Input
            id="scanner"
            ref={scanRef}
            placeholder="5*COD | COD*0.5"
            className="mt-1 h-9 text-sm"
            onKeyDown={handleScannerKey}
          />
        </div>

        <Button className="h-9" variant="outline" onClick={() => focusSelect(scanRef.current)}>
          Escáner
        </Button>
      </div>
    );
  }
);

BuscadorProductos.displayName = "BuscadorProductos";
export default BuscadorProductos;