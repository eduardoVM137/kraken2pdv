import { db } from "../config/database.js";
import { DetalleProducto } from "../models/detalle_producto.js";
import { eq } from "drizzle-orm";

// 🔹 Insertar
export const insertarDetalleProductoService = async (data) => {
  try {
    const [insertado] = await db.insert(DetalleProducto).values(data).returning();
    return insertado ?? null;
  } catch (error) {
    console.error("Error al insertar detalle_producto:", error);
    throw new Error("No se pudo insertar el detalle del producto");
  }
};

// 🔹 Editar
export const editarDetalleProductoService = async (id, data) => {
  try {
    const [actualizado] = await db
      .update(DetalleProducto)
      .set(data)
      .where(eq(DetalleProducto.id, id))
      .returning();
    return actualizado ?? null;
  } catch (error) {
    console.error("Error al editar detalle_producto:", error);
    throw new Error("No se pudo editar el detalle del producto");
  }
};

// 🔹 Eliminar
export const eliminarDetalleProductoService = async (id) => {
  try {
    const eliminado = await db
      .delete(DetalleProducto)
      .where(eq(DetalleProducto.id, id))
      .returning();
    return eliminado.length > 0;
  } catch (error) {
    console.error("Error al eliminar detalle_producto:", error);
    throw new Error("No se pudo eliminar el detalle del producto");
  }
};

// 🔹 Mostrar todos
export const mostrarDetalleProductosService = async () => {
  return await db.select().from(DetalleProducto);
};

// 🔹 Buscar por ID
export const buscarDetalleProductoIdService = async (id) => {
  const [detalle] = await db
    .select()
    .from(DetalleProducto)
    .where(eq(DetalleProducto.id, id))
    .limit(1);
  return detalle ?? null;
};

export const insertarDetalleProductoServiceTx = async (tx, data) => {
  const [insertado] = await tx.insert(DetalleProducto).values(data).returning();
  return insertado;
};
