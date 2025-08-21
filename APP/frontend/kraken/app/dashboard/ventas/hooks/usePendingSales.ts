

// hooks/usePendingSales.ts — manejar ventas pendientes
// ===================================================
import { useEffect, useState } from "react";
import { VentaPendiente, ProductoVenta } from "../types/venta";


export function usePendingSales() {
const [ventasPendientes, setVentasPendientes] = useState<VentaPendiente[]>([]);


// Carga inicial
useEffect(() => {
const stored = localStorage.getItem("ventasPendientes");
if (stored) {
try { setVentasPendientes(JSON.parse(stored)); }
catch { localStorage.removeItem("ventasPendientes"); }
}
}, []);


const guardar = (venta: ProductoVenta[], cliente: string, vendedor: string, descuento: number) => {
const nueva: VentaPendiente = {
id: Date.now().toString(),
cliente, vendedor, descuento, productos: venta,
timestamp: new Date().toLocaleString(),
};
const arr = [...ventasPendientes, nueva];
setVentasPendientes(arr);
localStorage.setItem("ventasPendientes", JSON.stringify(arr));
};


const eliminar = (id: string) => {
const filtradas = ventasPendientes.filter(v => v.id !== id);
setVentasPendientes(filtradas);
localStorage.setItem("ventasPendientes", JSON.stringify(filtradas));
};


const limpiarTodo = () => {
setVentasPendientes([]);
localStorage.removeItem("ventasPendientes");
};


return { ventasPendientes, guardar, eliminar, limpiarTodo } as const;
}