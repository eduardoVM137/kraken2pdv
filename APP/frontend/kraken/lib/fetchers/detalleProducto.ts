 // ✅ lib/fetchers/detalleProducto.ts - Fetcher limpio y documentado para detalles de producto

import { apiGet } from "../api";

/**
 * Representa un detalle de producto individual, con relación a atributos, marca y unidad.
 */
export interface DetalleProducto {
  id: number;
  producto_id: number;
  marca_id: string;
  medida: string;
  unidad_medida: string;
  descripcion?: string;
  nombre_calculado: string;
  activo: boolean;
  atributo_id: number | null;
  state_id: number | null;
}

/**
 * Obtiene todos los detalles de producto disponibles desde la API.
 * @returns Lista de detalles de productos activos y registrados
 */
export async function getDetalleProductos(): Promise<DetalleProducto[]> {
  try {
    const data = await apiGet("/api/detalle-producto", "getDetalleProductos");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Error en getDetalleProductos:", error);
    return [];
  }
}
