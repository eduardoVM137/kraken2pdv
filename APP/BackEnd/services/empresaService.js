import { db } from "../config/database.js";
import { Empresa } from "../models/empresa.js";
import { eq } from "drizzle-orm";

export const mostrarEmpresasService = async () => {
  return await db.select().from(Empresa);
};

export const insertarEmpresaService = async (data) => {
  const [nuevo] = await db.insert(Empresa).values(data).returning();
  return !!nuevo;
};

export const editarEmpresaService = async (id, data) => {
  const [actualizado] = await db.update(Empresa).set(data).where(eq(Empresa.id, id)).returning();
  return !!actualizado;
};

export const eliminarEmpresaService = async (id) => {
  const eliminado = await db.delete(Empresa).where(eq(Empresa.id, id)).returning();
  return eliminado.length > 0;
};