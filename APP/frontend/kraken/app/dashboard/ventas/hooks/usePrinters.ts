// app/dashboard/ventas/hooks/usePrinters.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { inicializarQZTray, listarImpresorasDisponibles } from "@/app/utils/imprimir-pos";

export type TamanoPapel = "58mm" | "80mm";

const STORAGE_KEY = "ventas.printer";
const STORAGE_PANEL = "ventas.printerPanel.collapsed";
const PREFERRED_NAME = "POS-58";

// Predeterminadas habituales de Windows (para mostrar aunque QZ no las devuelva)
const WINDOWS_DEFAULTS = [
  "Microsoft Print to PDF","\\\\MAIN-POS\\POS-58",
  "Microsoft XPS Document Writer",
  "Fax",
  "OneNote (Desktop)",
  "OneNote for Windows 10",
];

export function usePrinters(defaultPaper: TamanoPapel = "58mm") {
  const [impresoras, setImpresoras] = useState<string[]>([]);         // reportadas por QZ
  const [visibles, setVisibles] = useState<string[]>([]);             // QZ + defaults Windows
  const [nombreImpresora, setNombreImpresora] = useState<string>(""); // "" = default Windows
  const [tamanoPapel, setTamanoPapel] = useState<TamanoPapel>(defaultPaper);
  const [cargando, setCargando] = useState(false);
  const [panelColapsado, setPanelColapsado] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_PANEL) === "1"; } catch { return false; }
  });

  const pos58Disponible = useMemo(() => impresoras.includes(PREFERRED_NAME), [impresoras]);
  const seleccionDisponible = useMemo(
    () => !nombreImpresora || impresoras.includes(nombreImpresora),
    [impresoras, nombreImpresora]
  );
  const noVerificadas = useMemo(
    () => WINDOWS_DEFAULTS.filter((n) => !impresoras.includes(n)),
    [impresoras]
  );

  const refresh = useCallback(async () => {
    setCargando(true);
    try {
      await inicializarQZTray();
      const lista = await listarImpresorasDisponibles();
      setImpresoras(lista);
      setVisibles(Array.from(new Set([...lista, ...WINDOWS_DEFAULTS])));

      // preferida guardada
      const saved = localStorage.getItem(STORAGE_KEY) || "";

      if (saved && lista.includes(saved)) {
        setNombreImpresora(saved);
        return;
      }
      if (lista.includes(PREFERRED_NAME)) {
        setNombreImpresora(PREFERRED_NAME);
        localStorage.setItem(STORAGE_KEY, PREFERRED_NAME);
        return;
      }
      if (saved && !lista.includes(saved)) {
        setNombreImpresora(""); // default Windows
        localStorage.setItem(STORAGE_KEY, "");
      }
    } catch (e) {
      console.warn("No fue posible listar impresoras:", e);
      setImpresoras([]);
      setVisibles([...WINDOWS_DEFAULTS]); // al menos muestra defaults
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    if (impresoras.length === 0) {
      const t = setTimeout(refresh, 1500);
      return () => clearTimeout(t);
    }
  }, [impresoras.length, refresh]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, nombreImpresora || ""); } catch {}
  }, [nombreImpresora]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_PANEL, panelColapsado ? "1" : "0"); } catch {}
  }, [panelColapsado]);

  return {
    // datos
    impresoras,        // verificadas por QZ
    visibles,          // QZ + defaults Windows
    noVerificadas,     // solo defaults no reportadas por QZ
    nombreImpresora,
    tamanoPapel,
    cargando,
    panelColapsado,
    // setters
    setNombreImpresora,
    setTamanoPapel,
    setPanelColapsado,
    // flags
    pos58Disponible,
    seleccionDisponible,
    // acciones
    refreshPrinters: refresh,
  } as const;
}
