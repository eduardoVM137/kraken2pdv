// ✅ lib/fetchers/ubicacion.ts - Fetcher modular y documentado para ubicaciones físicas

import { apiGet } from "../api";

/**
 * Representa una ubicación física específica donde se encuentra un producto.
 */
export interface UbicacionDetallada {
  id: number;
  nombre_celda: string;
  nombre_estante: string;
  nombre_ubicacion: string;
  stock: number;
  activo: boolean;
}

/**
 * Obtiene las ubicaciones detalladas en las que está asignado un producto.
 * @param detalleProductoId ID del detalle del producto a consultar
 * @returns Lista de ubicaciones con información estructurada
 */
export async function getUbicacionDetallada(detalleProductoId: number): Promise<UbicacionDetallada[]> {
  try {
    const data = await apiGet(`/api/celda/ubicacion-detallada/${detalleProductoId}`, "getUbicacionDetallada");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Error en getUbicacionDetallada:", error);
    return [];
  }
}
