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
    const res = await fetch("http://localhost:3001/api/producto");

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
export async function getProductosCriticos(): Promise<Producto[]> {
  try {
    const res = await fetch("http://localhost:3001/api/producto/criticos");

    if (!res.ok) throw new Error(`Error ${res.status} al obtener productos críticos`);

    const data = await res.json();

    return Array.isArray(data.data)
      ? data.data.map((p: any) => ({
          ...p,
          id: p.detalle_producto_id ?? p.id,
          nombre_calculado: p.nombre,
          tipoVista: "critico",
          stock: Number(p.stock_actual ?? 0),
          stock_minimo: Number(p.stock_minimo ?? 0),
          precios: [],
          alias: [],
          sku: "",
          precio: 0,
          activo: "activo",
        }))
      : [];
  } catch (error) {
    console.error("❌ Error al obtener productos críticos:", error);
    return [];
  }
}
export async function getProductosPrioritarios(): Promise<Producto[]> {
  try {
    const res = await fetch("http://localhost:3001/api/producto/prioritarios");

    if (!res.ok) throw new Error(`Error ${res.status} al obtener productos prioritarios`);

    const data = await res.json();

    return Array.isArray(data.data?.rows)
      ? data.data.rows.map((p: any) => ({
          ...p,
          id: p.detalle_producto_id ?? p.id,
          nombre_calculado: p.nombre,
          tipoVista: "prioritario",
          stock: Number(p.stock_actual ?? 0),
          stock_minimo: Number(p.stock_minimo_recomendado ?? 0),
          total_vendido: Number(p.total_vendido ?? 0),
          veces_vendido: Number(p.veces_vendido ?? 0),
          rotacion_prom_dias: Number(p.rotacion_prom_dias ?? 0),
          precios: [],
          alias: [],
          sku: "",
          precio: 0,
          activo: "activo",
        }))
      : [];
  } catch (error) {
    console.error("❌ Error al obtener productos prioritarios:", error);
    return [];
  }
}
export async function getProductosMetricas(): Promise<Producto[]> {
  try {
    const res = await fetch("http://localhost:3001/api/producto/metricas");

    if (!res.ok) throw new Error(`Error ${res.status} al obtener métricas`);

    const data = await res.json();

    return Array.isArray(data.data?.rows)
      ? data.data.rows.map((p: any) => ({
          ...p,
          id: p.detalle_producto_id ?? p.id,
          nombre_calculado: p.nombre,
          tipoVista: "metrica",
          stock: Number(p.stock_actual ?? 0),
          stock_minimo: Number(p.stock_minimo_recomendado ?? 0),
          total_vendido: Number(p.total_vendido ?? 0),
          veces_vendido: Number(p.veces_vendido ?? 0),
          rotacion_prom_dias: Number(p.rotacion_prom_dias ?? 0),
          precios: [],
          alias: [],
          sku: "",
          precio: 0,
          activo: "activo",
        }))
      : [];
  } catch (error) {
    console.error("❌ Error al obtener métricas:", error);
    return [];
  }
}
