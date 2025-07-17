// lib/fetchers/productos.ts

export interface DetalleProducto {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  categoria_id: number;
  state_id?: number | null;
}

export async function getProductos(): Promise<DetalleProducto[]> {
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

// 🔍 NUEVA FUNCIÓN: buscar por alias
 
export async function buscarProductosPorAlias(busqueda: string): Promise<DetalleProducto[]> {
  const res = await fetch(`http://localhost:3001/api/venta/productos-alias?busqueda=${encodeURIComponent(busqueda)}`);
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}