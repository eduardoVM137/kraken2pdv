

// ==========================================================
// types/venta.ts — Tipos centrales usados en todos los módulos
// ==========================================================
export interface ProductoVenta {
id: number;
nombre: string;
precio: number;
cantidad: number;
descuento?: number; // descuento en monto fijo por línea
descuentoRaw?: string; // entrada textual ("5" | "10%")
iva?: number; // porcentaje IVA 0-100
presentacion_id?: number;
inventarios?: number[]; // ids de inventario ligados
}


export interface Pago {
metodo: string;
monto: number;
}


export interface VentaPendiente {
id: string;
cliente: string;
vendedor: string;
descuento: number; // descuento general
productos: ProductoVenta[];
timestamp: string;
}