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


export async function getListaProductos(): Promise<Producto[]> {
  try {
    const res = await fetch("http://localhost:3001/api/detalle-producto");

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


export const activarProductos = async (ids: number[]) => {
  const res = await fetch("/api/productos/activar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) throw new Error("Error al activar productos");
  return await res.json();
};

export const eliminarProductos = async (ids: number[]) => {
  const res = await fetch("/api/productos/eliminar", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) throw new Error("Error al eliminar productos");
  return await res.json();
};

export const transferirProductos = async (ids: number[], ubicacionId: number) => {
  const res = await fetch("/api/productos/transferir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, ubicacionId }),
  });

  if (!res.ok) throw new Error("Error al transferir productos");
  return await res.json();
};
