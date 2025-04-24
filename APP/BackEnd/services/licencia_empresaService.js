import { db } from "../config/database.js";
import { LicenciaEmpresa } from "../models/licencia_empresa.js";
import { eq } from "drizzle-orm";

export const mostrarLicenciaEmpresasService = async () => {
  return await db.select().from(LicenciaEmpresa);
};

export const insertarLicenciaEmpresaService = async (data) => {
  const [nuevo] = await db.insert(LicenciaEmpresa).values(data).returning();
  return !!nuevo;
};

export const editarLicenciaEmpresaService = async (id, data) => {
  const [actualizado] = await db.update(LicenciaEmpresa).set(data).where(eq(LicenciaEmpresa.id, id)).returning();
  return !!actualizado;
};

export const eliminarLicenciaEmpresaService = async (id) => {
  const eliminado = await db.delete(LicenciaEmpresa).where(eq(LicenciaEmpresa.id, id)).returning();
  return eliminado.length > 0;
};