import { db } from "../config/database.js";
import { UbicacionFisica } from "../models/ubicacion_fisica.js";
import { eq } from "drizzle-orm";

export const mostrarUbicacion_fisicasService = async () => {
  return await db.select().from(UbicacionFisica);
};

export const insertarUbicacion_fisicaService = async (data) => {
  const [nuevo] = await db.insert(UbicacionFisica).values(data).returning();
  return !!nuevo;
};

export const editarUbicacion_fisicaService = async (id, data) => {
  const [actualizado] = await db.update(UbicacionFisica).set(data).where(eq(UbicacionFisica.id, id)).returning();
  return !!actualizado;
};

export const eliminarUbicacion_fisicaService = async (id) => {
  const eliminado = await db.delete(UbicacionFisica).where(eq(UbicacionFisica.id, id)).returning();
  return eliminado.length > 0;
};