import { db } from "../config/database.js";
import { PagoEmpresa } from "../models/pago_empresa.js";
import { eq } from "drizzle-orm";

export const mostrarPagoEmpresasService = async () => {
  return await db.select().from(PagoEmpresa);
};

export const insertarPagoEmpresaService = async (data) => {
  const [nuevo] = await db.insert(PagoEmpresa).values(data).returning();
  return !!nuevo;
};

export const editarPagoEmpresaService = async (id, data) => {
  const [actualizado] = await db.update(PagoEmpresa).set(data).where(eq(PagoEmpresa.id, id)).returning();
  return !!actualizado;
};

export const eliminarPagoEmpresaService = async (id) => {
  const eliminado = await db.delete(PagoEmpresa).where(eq(PagoEmpresa.id, id)).returning();
  return eliminado.length > 0;
};