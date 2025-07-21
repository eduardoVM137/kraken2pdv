// lib/fetchers/ventas.ts
export interface Cliente { id: number; nombre: string; /* …otros campos…*/ }
export interface Usuario { id: number; nombre_usuario: string; /* …otros campos…*/ }
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
    if (!res.ok) throw new Error(`Error ${res.status} al obtener productos`);
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    return [];
  }
}

export async function mostrarVentas(): Promise<DetalleProducto[]> {
  try {
    const res = await fetch("http://localhost:3001/api/venta");
    if (!res.ok) throw new Error(`Error ${res.status} al obtener ventas`);
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error);
    return [];
  }
}

export async function buscarProductosPorAlias(busqueda: string): Promise<DetalleProducto[]> {
  const res = await fetch(`http://localhost:3001/api/venta/productos-alias?busqueda=${encodeURIComponent(busqueda)}`);
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

export async function crearVenta(payload: any) {
  const res = await fetch("http://localhost:3001/api/venta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear la venta");
  return (await res.json()).data;
}

export async function getDetalleVenta(ventaId: number) {
  const res = await fetch(`http://localhost:3001/api/venta/buscar/${ventaId}`);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener detalle`);
  const json = await res.json();
  const d = json.data;
  if (Array.isArray(d)) return d;
  return d ? [d] : [];
}

export async function getTrazabilidadVenta(ventaId: number) {
  const res = await fetch(`http://localhost:3001/api/detalle_state?tabla_afectada=venta&id_tabla=${ventaId}`);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener trazabilidad`);
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

export async function actualizarEstadosVentas(
  updates: { id: number; estado: string }[]
): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:3001/api/venta/estado", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`Error ${res.status} al actualizar estados`);
    return true;
  } catch (e) {
    console.error("❌ Error al actualizar estados:", e);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 📌 NUEVA FUNCIÓN: editar una venta (cabecera + detalles)
// ─────────────────────────────────────────────────────────────────────────────

export interface DetalleUpdate {
  id: number;                 // corresponde a DetalleVenta.id
  detalle_producto_id: number;
  cantidad: string;
  precio_venta: string;
  descuento: string;
}

export interface VentaUpdate {
  cliente_id?: number | string;
  usuario_id?: number | string;
  fecha?: string;             // "YYYY-MM-DD"
  total?: string;
  forma_pago?: string;
  estado?: string;
  detalles?: DetalleUpdate[];
}

/**
 * Llama a PUT /api/venta/:id para editar tanto la cabecera
 * como las líneas de detalle de una venta.
 */
export async function editarVenta(
  ventaId: number,
  data: VentaUpdate
): Promise<boolean> {
  try {
    const res = await fetch(`http://localhost:3001/api/venta/${ventaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error("editarVenta:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("❌ Error en editarVenta:", err);
    return false;
  }
}
export async function getClientesYEmpleados(): Promise<{
  clientes: Cliente[];
  usuarios: Usuario[];
}> {
  const [cliRes, usuRes] = await Promise.all([
    fetch("http://localhost:3001/api/cliente"),
    fetch("http://localhost:3001/api/usuario"),
  ]);
  if (!cliRes.ok || !usuRes.ok) throw new Error("Error al cargar clientes/empleados");
  const cliJson = await cliRes.json();
  const usuJson = await usuRes.json();
  return {
    clientes: Array.isArray(cliJson.data) ? cliJson.data : [],
    usuarios: Array.isArray(usuJson.data) ? usuJson.data : [],
  };
}