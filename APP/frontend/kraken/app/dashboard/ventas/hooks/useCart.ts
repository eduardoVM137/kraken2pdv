



// ==========================================
// hooks/useCart.ts — Estado del carrito y helpers
// ==========================================
import { useEffect, useRef, useState } from "react";
import { ProductoVenta } from "../types/venta";
import { calcularSubtotal, calcularTotal } from "../utils/totals";


export function useCart() {
const [venta, setVenta] = useState<ProductoVenta[]>([]);
const [descuento, setDescuento] = useState(0); // descuento general
const [pagos, setPagos] = useState<{ metodo: string; monto: number }[]>([]);


// Autoguardado de borrador
useEffect(() => {
const draft = localStorage.getItem("ventaDraft");
if (draft) {
try { setVenta(JSON.parse(draft)); } catch { localStorage.removeItem("ventaDraft"); }
}
}, []);
useEffect(() => {
localStorage.setItem("ventaDraft", JSON.stringify(venta));
}, [venta]);


const agregarProducto = (p: ProductoVenta) => {
setVenta(prev => {
const idx = prev.findIndex(x => x.id === p.id && x.presentacion_id === p.presentacion_id);
if (idx >= 0) {
const copia = [...prev];
copia[idx].cantidad += p.cantidad;
return copia;
}
return [...prev, p];
});
};


const limpiar = () => { setVenta([]); setPagos([]); };


const subtotal = calcularSubtotal(venta);
const total = calcularTotal(venta, descuento);


return {
venta, setVenta, agregarProducto, limpiar,
descuento, setDescuento,
pagos, setPagos,
subtotal, total,
} as const;
}

