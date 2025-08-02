// ✅ lib/fetchers/ventas.ts y productos.ts - APIs limpias, robustas y trazables para un entorno SaaS

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "../api";

// ───────────────────────────────────────────────────────────────
// Interfaces y tipos utilizados
// ───────────────────────────────────────────────────────────────

/**
 * Representa una presentación de producto.
 */
export interface Presentacion {
  presentacion_id: number;
  nombre_presentacion: string;
  cantidad_presentacion: number;
  precio_venta: number;
  stock_actual: number;
}

/**
 * Representa un producto completo con múltiples presentaciones.
 */
export interface Producto {
  detalle_producto_id: number;
  nombre_calculado: string;
  foto_url: string;
  presentaciones: Presentacion[];
}

// ───────────────────────────────────────────────────────────────
// Métodos relacionados con productos
// ───────────────────────────────────────────────────────────────

/**
 * Obtiene los productos disponibles para venta rápida.
 * @returns Lista de productos disponibles
 */
export async function getProductos(): Promise<Producto[]> {
  try {
    return await apiGet("/api/venta/productos", "getProductosVenta");
  } catch (error) {
    console.error("❌ Error en getProductosVenta:", error);
    return [];
  }
}

/**
 * Realiza búsqueda por alias (códigos alternativos o nombre).
 * @param busqueda Término de búsqueda
 * @returns Lista de coincidencias
 */
export async function buscarProductosPorAlias(busqueda: string): Promise<Producto[]> {
  try {
    return await apiGet(`/api/ventas/productos-alias?busqueda=${encodeURIComponent(busqueda)}`, "buscarProductosPorAlias");
  } catch (error) {
    console.error("❌ Error en buscarProductosPorAlias:", error);
    return [];
  }
}

/**
 * Obtiene todos los productos desde la vista general.
 * @returns Lista completa de productos
 */
export async function getListaProductos(): Promise<Producto[]> {
  try {
    return await apiGet("/api/producto", "getListaProductos");
  } catch (error) {
    console.error("❌ Error en getListaProductos:", error);
    return [];
  }
}

/**
 * Activa múltiples productos por ID.
 * @param ids Lista de IDs
 */
export async function activarProductos(ids: number[]) {
  return await apiPost("/api/productos/activar", { ids }, "activarProductos");
}

/**
 * Elimina productos dados sus IDs.
 * @param ids Lista de IDs
 */
export async function eliminarProductos(ids: number[]) {
  return await apiDelete("/api/productos/eliminar", { ids }, "eliminarProductos");
}

/**
 * Transfiere productos a una nueva ubicación.
 * @param ids Lista de productos
 * @param ubicacionId ID destino
 */
export async function transferirProductos(ids: number[], ubicacionId: number) {
  return await apiPost("/api/productos/transferir", { ids, ubicacionId }, "transferirProductos");
}

/**
 * Obtiene productos con stock bajo (críticos).
 * @returns Lista de productos críticos
 */
export async function getProductosCriticos(): Promise<Producto[]> {
  try {
    return await apiGet("/api/producto/criticos", "getProductosCriticos");
  } catch (error) {
    console.error("❌ Error en getProductosCriticos:", error);
    return [];
  }
}

/**
 * Obtiene productos prioritarios para reposición.
 * @returns Lista priorizada por rotación/ventas
 */
export async function getProductosPrioritarios(): Promise<Producto[]> {
  try {
    return await apiGet("/api/producto/prioritarios", "getProductosPrioritarios");
  } catch (error) {
    console.error("❌ Error en getProductosPrioritarios:", error);
    return [];
  }
}

/**
 * Obtiene métricas adicionales de productos para dashboards.
 * @returns Lista con indicadores de rotación y venta
 */
export async function getProductosMetricas(): Promise<Producto[]> {
  try {
    return await apiGet("/api/producto/metricas", "getProductosMetricas");
  } catch (error) {
    console.error("❌ Error en getProductosMetricas:", error);
    return [];
  }
}
