// lib/fetchers/ventas.ts

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

export async function mostrarVentas(): Promise<DetalleProducto[]> {
  try {
    const res = await fetch("http://localhost:3001/api/venta");

    if (!res.ok) {
      throw new Error(`Error ${res.status} al obtener ventas`);
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

export async function crearVenta(payload: any) {
  const res = await fetch("http://localhost:3001/api/venta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear la venta");
  return (await res.json()).data;
}


//trazabilidad--mover a state y detalle state y revisar detalle venta(si no va en fecher detalle venta)
// lib/fetchers/ventas.ts
export async function getDetalleVenta(ventaId: number) {
  const res = await fetch(`http://localhost:3001/api/detalle-venta/${ventaId}`);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener detalle`);
  const json = await res.json();
  const d = json.data;
  if (Array.isArray(d)) return d;
  if (d) return [d];
  return [];
}
/** obtiene el historial (trazabilidad) de estados de una venta */
export async function getTrazabilidadVenta(ventaId: number) {
  const res = await fetch(`http://localhost:3001/api/detalle_state?tabla_afectada=venta&id_tabla=${ventaId}`);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener trazabilidad`);
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}
