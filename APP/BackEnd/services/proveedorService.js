import { db } from "../config/database.js";
import { Proveedor } from "../models/proveedor.js";
import { eq } from "drizzle-orm";

export const mostrarProveedorsService = async () => {
  return await db.select().from(Proveedor);
};

export const insertarProveedorService = async (data) => {
  const [nuevo] = await db.insert(Proveedor).values(data).returning();
  return !!nuevo;
};

export const editarProveedorService = async (id, data) => {
  const [actualizado] = await db.update(Proveedor).set(data).where(eq(Proveedor.id, id)).returning();
  return !!actualizado;
};

export const eliminarProveedorService = async (id) => {
  const eliminado = await db.delete(Proveedor).where(eq(Proveedor.id, id)).returning();
  return eliminado.length > 0;
};