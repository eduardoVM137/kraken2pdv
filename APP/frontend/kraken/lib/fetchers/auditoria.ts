// lib/fetchers/auditoria.ts
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const verAuditoriaProducto = async (detalle_producto_id: number) => {
  const res = await fetch(`${API_URL}/api/producto/movimientos/${detalle_producto_id}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error HTTP ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.data;
};
