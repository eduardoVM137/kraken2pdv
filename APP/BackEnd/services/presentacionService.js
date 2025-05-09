import { db } from "../config/database.js";
import { Presentacion } from "../models/presentacion.js";
import { eq } from "drizzle-orm";

export const mostrarPresentacionesService = async () => {
  return await db.select().from(Presentacion);
};

export const insertarPresentacionService = async (data) => {
  const [nueva] = await db.insert(Presentacion).values(data).returning();
  return !!nueva;
};

export const editarPresentacionService = async (id, data) => {
  const [actualizado] = await db.update(Presentacion).set(data).where(eq(Presentacion.id, id)).returning();
  return !!actualizado;
};

export const eliminarPresentacionService = async (id) => {
  const eliminado = await db.delete(Presentacion).where(eq(Presentacion.id, id)).returning();
  return eliminado.length > 0;
};

// Insertar una presentación usando una transacción
export const insertarPresentacionServiceTx = async (tx, presentacionData) => {
  if (!presentacionData || typeof presentacionData !== 'object') {
    throw new Error('Los datos de la presentación no son válidos');
  }

  const inserted = await tx.insert(Presentacion)
    .values(presentacionData)
    .returning(); // Devuelve el registro creado

  return inserted[0] || null;
};