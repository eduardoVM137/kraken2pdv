import { db } from "../config/database.js";
import { Ingreso } from "../models/ingreso.js";
import { eq } from "drizzle-orm";

export const mostrarIngresosService = async () => {
  return await db.select().from(Ingreso);
};

export const insertarIngresoService = async (data) => {
  const [nuevo] = await db.insert(Ingreso).values(data).returning();
  return !!nuevo;
};

export const editarIngresoService = async (id, data) => {
  const [actualizado] = await db.update(Ingreso).set(data).where(eq(Ingreso.id, id)).returning();
  return !!actualizado;
};

export const eliminarIngresoService = async (id) => {
  const eliminado = await db.delete(Ingreso).where(eq(Ingreso.id, id)).returning();
  return eliminado.length > 0;
};