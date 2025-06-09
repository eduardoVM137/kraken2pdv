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
    const res = await fetch("http://localhost:3001/api/ventas/productos");

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

export async function getProducto() {
  const res = await fetch("http://localhost:3001/api/detalle-producto/147"); // o como tengas tu backend
  const json = await res.json();
  return json.data || [];
}
