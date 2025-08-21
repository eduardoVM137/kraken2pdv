



// ==========================================
// utils/totals.ts — funciones puras de cálculo
// ==========================================
import { ProductoVenta } from "../types/venta";


/** Subtotal de una línea (aplicando descuento por producto + IVA) */
export function calcularSubtotalLinea(item: ProductoVenta): number {
const desc = item.descuento ?? 0;
const base = item.precio * item.cantidad - desc;
const ivaPct = item.iva ?? 0;
const tax = (base * ivaPct) / 100;
return base + tax;
}


/** Total parcial (suma de líneas) sin descuento general */
export function calcularSubtotal(items: ProductoVenta[]): number {
return items.reduce((sum, it) => sum + calcularSubtotalLinea(it), 0);
}


/** Total final aplicando descuento general */
export function calcularTotal(items: ProductoVenta[], descuentoGeneral: number): number {
const subtotal = calcularSubtotal(items);
return Math.max(0, subtotal - (descuentoGeneral || 0));
}


/** Totales auxiliares */
export function metrics(items: ProductoVenta[]) {
const totalItems = items.reduce((s, it) => s + it.cantidad, 0);
const totalUnicos = items.length;
const totalParcial = items.reduce((s, it) => s + it.precio * it.cantidad, 0);
return { totalItems, totalUnicos, totalParcial };
}