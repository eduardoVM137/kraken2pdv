// lib/fetchers/productos.ts
export interface Presentacion {
  presentacion_id: number;
  nombre_presentacion: string;
  cantidad_presentacion: number;
  precio_venta: number;
  stock_actual: number;
}

export interface Producto {
  detalle_producto_id: number;
  nombre_calculado: string;
  foto_url: string;
  presentaciones: Presentacion[];
}

export async function getProductos(): Promise<Producto[]> {
  try {
    const res = await fetch("http://localhost:3001/api/venta/productos");

    if (!res.ok) {
      throw new Error(`Error ${res.status} al obtener productos`);
    }

    const data = await res.json();

    if (Array.isArray(data.data)) {
      return data.data;
    }

    console.error("❌ Respuesta inesperada:", data);
    return [];
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    return [];
  }
}
