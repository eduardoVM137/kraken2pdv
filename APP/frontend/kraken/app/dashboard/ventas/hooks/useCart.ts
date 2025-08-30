// ==========================================
// hooks/useCart.ts — Estado del carrito con persistencia robusta
// ==========================================
import { useEffect, useRef, useState } from "react";
import { ProductoVenta } from "../types/venta";
import { calcularSubtotal, calcularTotal } from "../utils/totals";

// Clave y versión para persistencia en localStorage
const STORAGE_KEY = "ventaDraft.v2";
const STORAGE_VERSION = 1;

type DraftData = {
  v: number;
  venta: ProductoVenta[];
  descuento: number;
  pagos: { metodo: string; monto: number }[];
  updatedAt: number;
};

export function useCart() {
  const [venta, setVenta] = useState<ProductoVenta[]>([]);
  const [descuento, setDescuento] = useState(0); // descuento general
  const [pagos, setPagos] = useState<{ metodo: string; monto: number }[]>([]);

  // ----------- Carga inicial desde localStorage -----------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as DraftData;
      if (!parsed || parsed.v !== STORAGE_VERSION) return;

      setVenta(parsed.venta ?? []);
      setDescuento(parsed.descuento ?? 0);
      setPagos(parsed.pagos ?? []);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ----------- Guardado automático con debounce -----------
  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        const data: DraftData = {
          v: STORAGE_VERSION,
          venta,
          descuento,
          pagos,
          updatedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // almacenamiento lleno o bloqueado
      }
    }, 200);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [venta, descuento, pagos]);

  // ----------- API del carrito -----------
  const round3 = (n: number) => Math.round(n * 1000) / 1000;

const agregarProducto = (p: ProductoVenta) => {
  setVenta((prev) => {
    const idx = prev.findIndex(
      (x) => x.id === p.id && x.presentacion_id === p.presentacion_id
    );
    if (idx >= 0) {
      const copia = [...prev];
      const curr = Number(copia[idx].cantidad ?? 0);
      const add  = Number(p.cantidad ?? 0);
      copia[idx].cantidad = round3(curr + add);
      return copia;
    }
    return [...prev, p];
  });
};

  const limpiar = () => {
    setVenta([]);
    setPagos([]);
    setDescuento(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const subtotal = calcularSubtotal(venta);
  const total = calcularTotal(venta, descuento);

  return {
    venta,
    setVenta,
    agregarProducto,
    limpiar,
    descuento,
    setDescuento,
    pagos,
    setPagos,
    subtotal,
    total,
  } as const;
}
