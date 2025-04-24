import { db } from "../config/database.js";
import { ModuloEmpresa } from "../models/modulo_empresa.js";
import { eq } from "drizzle-orm";

export const mostrarModuloEmpresasService = async () => {
  return await db.select().from(ModuloEmpresa);
};

export const insertarModuloEmpresaService = async (data) => {
  const [nuevo] = await db.insert(ModuloEmpresa).values(data).returning();
  return !!nuevo;
};

export const editarModuloEmpresaService = async (id, data) => {
  const [actualizado] = await db.update(ModuloEmpresa).set(data).where(eq(ModuloEmpresa.id, id)).returning();
  return !!actualizado;
};

export const eliminarModuloEmpresaService = async (id) => {
  const eliminado = await db.delete(ModuloEmpresa).where(eq(ModuloEmpresa.id, id)).returning();
  return eliminado.length > 0;
};