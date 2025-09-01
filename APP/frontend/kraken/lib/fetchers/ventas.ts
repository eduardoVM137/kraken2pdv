// ✅ lib/fetchers/ventas.ts - API de ventas limpia, robusta y trazable

import { apiGet, apiPost, apiPut, apiPatch } from "../api";

// ───────────────────────────────────────────────────────────────
// Interfaces utilizadas en operaciones relacionadas a ventas
// ───────────────────────────────────────────────────────────────

/**
 * Representa un cliente registrado en el sistema.
 */
export interface Cliente {
  id: number;
  nombre: string;
}

/**
 * Representa un usuario que realiza ventas (empleado).
 */
export interface Usuario {
  id: number;
  nombre_usuario: string;
}

/**
 * Representa un producto disponible para ventas, con estado y categoría.
 */
export interface DetalleProducto {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  categoria_id: number;
  state_id?: number | null;
}

/**
 * Representa un ítem editable en el detalle de una venta.
 */
export interface DetalleUpdate {
  id: number;
  detalle_producto_id: number;
  cantidad: string;
  precio_venta: string;
  descuento: string;
}

/**
 * Representa los campos modificables en una venta ya existente.
 */
export interface VentaUpdate {
  cliente_id?: number | string;
  usuario_id?: number | string;
  fecha?: string;
  total?: string;
  forma_pago?: string;
  estado?: string;
  detalles?: DetalleUpdate[];
}

// ───────────────────────────────────────────────────────────────
// Funciones de comunicación con la API de ventas
// ───────────────────────────────────────────────────────────────

/**
 * Obtiene la lista de productos disponibles para venta.
 * @returns Arreglo de productos listos para venta
 */
export async function getProductos(): Promise<DetalleProducto[]> {
  try {
    return await apiGet("/api/venta/productos", "getProductosVenta");
  } catch (error) {
    console.error("❌ Error en getProductosVenta:", error);
    return [];
  }
}

/**
 * Lista todas las ventas realizadas.
 * @returns Arreglo de ventas
 */
export async function mostrarVentas(): Promise<DetalleProducto[]> {
  try {
    return await apiGet("/api/venta", "mostrarVentas");
  } catch (error) {
    console.error("❌ Error en mostrarVentas:", error);
    return [];
  }
}

/**
 * Busca productos por alias (términos alternos)
 * @param busqueda Texto a buscar (puede ser nombre o código alterno)
 * @returns Productos que coincidan con el término de búsqueda
 */


 // lib/fetchers/ventas.ts
export async function buscarProductosPorAlias(
  busqueda: string,
  opts?: { signal?: AbortSignal }
) {
  try {
    // apiGet ya desenvuelve {data: [...]}
    return await apiGet(
      `/api/venta/productos-alias?busqueda=${encodeURIComponent(busqueda)}`,
      "buscarProductosPorAlias",
      { signal: opts?.signal, soft404: true }
    );
  } catch (error) {
    // Abort: ignora
    if ((error as any)?.name === "AbortError") return [];
    console.error("❌ Error en buscarProductosPorAlias:", error);
    return [];
  }
}

 
export async function crearVenta(payload: any) {
  return await apiPost("/api/venta", payload, "crearVenta");
}

/**
 * Consulta el detalle de una venta específica por ID.
 * @param ventaId ID único de la venta
 * @returns Detalles de la venta
 */
export async function getDetalleVenta(ventaId: number) {
  try {
    return await apiGet(`/api/venta/buscar/${ventaId}`, "getDetalleVenta");
  } catch (error) {
    console.error("❌ Error en getDetalleVenta:", error);
    return [];
  }
}

/**
 * Obtiene la trazabilidad (historial de estados) de una venta.
 * @param ventaId ID de la venta
 * @returns Lista de cambios de estado (detalle_state)
 */
export async function getTrazabilidadVenta(ventaId: number) {
  try {
    return await apiGet(`/api/detalle_state?tabla_afectada=venta&id_tabla=${ventaId}`, "getTrazabilidadVenta");
  } catch (error) {
    console.error("❌ Error en getTrazabilidadVenta:", error);
    return [];
  }
}

/**
 * Actualiza los estados de varias ventas simultáneamente.
 * @param updates Lista de cambios por ID
 * @returns true si la operación fue exitosa
 */
export async function actualizarEstadosVentas(updates: { id: number; estado: string }[]): Promise<boolean> {
  try {
    await apiPatch("/api/venta/estado", updates, "actualizarEstadosVentas");
    return true;
  } catch (error) {
    console.error("❌ Error en actualizarEstadosVentas:", error);
    return false;
  }
}

/**
 * Edita una venta existente (cabecera + detalles).
 * @param ventaId ID de la venta a editar
 * @param data Objeto con cambios a aplicar
 * @returns true si la edición fue exitosa
 */
export async function editarVenta(ventaId: number, data: VentaUpdate): Promise<boolean> {
  try {
    await apiPut(`/api/venta/${ventaId}`, data, "editarVenta");
    return true;
  } catch (error) {
    console.error("❌ Error en editarVenta:", error);
    return false;
  }
}

/**
 * Carga listas de clientes y empleados para uso en el punto de venta.
 * @returns Objeto con arrays de clientes y usuarios
 */
export async function getClientesYEmpleados(): Promise<{ clientes: Cliente[]; usuarios: Usuario[] }> {
  try {
    const clientes = await apiGet("/api/cliente", "getClientesYEmpleados:clientes");
    const usuarios = await apiGet("/api/usuario", "getClientesYEmpleados:usuarios");
    return { clientes, usuarios };
  } catch (error) {
    console.error("❌ Error en getClientesYEmpleados:", error);
    return { clientes: [], usuarios: [] };
  }
}
