// ✅ lib/fetchers/auditoria.ts 
import { apiGet } from "../api";

/**
 * Representa un registro de trazabilidad de estado asociado a una tabla.
 */
export interface DetalleState {
  id: number;
  id_tabla: number;
  tabla_afectada: string;
  estado: string;
  usuario_id: number;
  fecha: string; // ISO format
  comentarios?: string;
}

/**
 * Obtiene el historial de estados de una venta (o cualquier otra tabla rastreada).
 * @param tabla "venta", "compra", etc.
 * @param id ID del registro a consultar
 * @returns Lista de registros de estado ordenados por fecha
 */
export async function getTrazabilidad(tabla: string, id: number): Promise<DetalleState[]> {
  try {
    const data = await apiGet(`/api/detalle_state?tabla_afectada=${tabla}&id_tabla=${id}`, "getTrazabilidad");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Error en getTrazabilidad:", error);
    return [];
  }
}
/**
 * Obtiene el historial de auditoría de un producto.
 * @param detalleProductoId ID del producto
 */
export async function verAuditoriaProducto(detalleProductoId: number): Promise<DetalleState[]> {
  try {
    const data = await apiGet(`/api/detalle_state?tabla_afectada=detalle_producto&id_tabla=${detalleProductoId}`, "verAuditoriaProducto");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Error en verAuditoriaProducto:", error);
    return [];
  }
}
