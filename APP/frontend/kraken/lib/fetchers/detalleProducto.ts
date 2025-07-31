// lib/fetchers/detalleProducto.ts

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
  
  export async function getDetalleProductos(): Promise<DetalleProducto[]> {
    try {
      const res = await fetch("http://localhost:3001/api/detalle-producto");
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error("❌ Error al obtener detalle de productos:", error);S
      return [];
    }
  }
  