// app/dashboard/ventas/components/search/BuscadorProductos.tsx
"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  busqueda: string;
  setBusqueda: (value: string) => void;
  setPaginaActual: (value: number) => void;
  buscarPorAlias: boolean;
  setBuscarPorAlias: (value: boolean) => void;
  onSearchEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onScanEnter?: (args: { code: string; qty: number; raw: string }) => void;
}

/* ---------- Parser: qty*code | code*qty | code ---------- */
function parseQtyCode(rawIn: string): { code: string; qty: number } | null {
  const raw = rawIn.trim();
  if (!raw) return null;
  const parts = rawIn
    .trim()
    .split("*")
    .map((s) => s.trim())
    .filter(Boolean);

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
    /* ---------------- Debounce de consulta ---------------- */
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

    /* ----------------------- Refs ------------------------- */
    const consultaRef = useRef<HTMLInputElement>(null);
    const scanRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (typeof ref === "function") ref(consultaRef.current!);
      else if (ref)
        (ref as React.MutableRefObject<HTMLInputElement | null>).current =
          consultaRef.current!;
    }, [ref]);

    /* ------------- Helpers de foco/selección -------------- */
    const focusSelect = (el?: HTMLInputElement | null) => {
      if (!el) return;
      requestAnimationFrame(() => {
        el.focus();
        try {
          el.select();
        } catch {}
      });
    };

    /* ----------------- Tab “chord” UX --------------------- */
    const chordTimeout = useRef<number | null>(null);
    const [chordFrom, setChordFrom] = useState<"consulta" | "scanner" | null>(
      null
    );
    const beginChord = (
      from: "consulta" | "scanner",
      onExpire: () => void
    ) => {
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

    /* -------------- Dedupe rápido de escáner -------------- */
    const lastScanRef = useRef<{ raw: string; t: number }>({ raw: "", t: 0 });
    const processingRef = useRef(false);

    /* ------------------- Handlers ------------------------- */
    const handleConsultaKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        if (k === "s") {
          e.preventDefault();
          resolveChord();
          focusSelect(scanRef.current);
          return;
        }
        if (k === "t") {
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
        beginChord("scanner", () => focusSelect(consultaRef.current));
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

      if (processingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      processingRef.current = true;
      e.preventDefault();
      e.stopPropagation();

      const raw0 = e.currentTarget.value || "";
      const raw = raw0.replace(/[\r\n]+/g, "").trim();

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

      await Promise.resolve(onScanEnter({ code: parsed.code, qty: parsed.qty, raw }));
      focusSelect(scanRef.current);
      setTimeout(() => (processingRef.current = false), 0);
    };

    /* ----------------------- UI --------------------------- */
    return (
      <div className="mb-3">
        {/* Encabezado y switch (compacto) */}
        <div className="flex items-center justify-between gap-3">
          <Label
            htmlFor="consulta"
            className="text-[10px] uppercase tracking-wide text-muted-foreground"
          >
            Buscar (no agrega)
          </Label>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Buscar por</span>
            <div className="flex items-center gap-2 rounded-md border px-2 py-1">
              <span
                className={`text-xs ${
                  !buscarPorAlias ? "font-medium" : "text-muted-foreground"
                }`}
              >
                Nombre
              </span>
              <Switch
                checked={buscarPorAlias}
                onCheckedChange={(v) => {
                  setBuscarPorAlias(v);
                  setPaginaActual(1);
                }}
                aria-label="Alternar búsqueda por alias"
              />
              <span
                className={`text-xs ${
                  buscarPorAlias ? "font-medium" : "text-muted-foreground"
                }`}
              >
                Alias
              </span>
            </div>
          </div>
        </div>

        {/* Fila de controles alineados al fondo */}
        <div className="mt-1 grid grid-cols-1 md:grid-cols-[1fr_minmax(230px,280px)_auto] gap-2 items-end">
          {/* Consulta */}
          <div className="flex flex-col gap-1">
            <Input
              id="consulta"
              ref={consultaRef}
              placeholder={buscarPorAlias ? "Alias… (Enter)" : "Nombre… (Enter)"}
              className="h-10"
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              onKeyDown={handleConsultaKey}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Caja de búsqueda (no agrega)"
            />
          </div>

          {/* Escáner */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="scanner"
              className="text-[10px] uppercase tracking-wide text-muted-foreground"
            >
              Escáner (agrega)
            </Label>
            <Input
              id="scanner"
              ref={scanRef}
              placeholder="5*COD · COD*0.5 · COD"
              className="h-10 text-sm"
              onKeyDown={handleScannerKey}
              aria-label="Caja de escaneo (agrega)"
            />
          </div>

          {/* Botón foco escáner */}
          <div className="flex md:justify-end">
            <Button
              className="h-10 w-full md:w-auto"
              variant="outline"
              onClick={() => focusSelect(scanRef.current)}
              title="Ir al escáner"
            >
              Ir al Escáner
            </Button>
          </div>
        </div>

        {/* Ayuda corta y no intrusiva */}
        <div className="mt-1 text-[11px] text-muted-foreground">
          Atajos: Tab cambia · Ctrl+/ → Escáner
        </div>
      </div>
    );
  }
);

BuscadorProductos.displayName = "BuscadorProductos";
export default BuscadorProductos;
