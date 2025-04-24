import { db } from "../config/database.js";
import { Cliente } from "../models/cliente.js";
import { eq } from "drizzle-orm";

export const mostrarClientesService = async () => {
  return await db.select().from(Cliente);
};

export const insertarClienteService = async (data) => {
  const [nuevo] = await db.insert(Cliente).values(data).returning();
  return !!nuevo;
};

export const editarClienteService = async (id, data) => {
  const [actualizado] = await db.update(Cliente).set(data).where(eq(Cliente.id, id)).returning();
  return !!actualizado;
};

export const eliminarClienteService = async (id) => {
  const eliminado = await db.delete(Cliente).where(eq(Cliente.id, id)).returning();
  return eliminado.length > 0;
};