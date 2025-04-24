import { db } from "../config/database.js";
import { Empleado } from "../models/empleado.js";
import { eq } from "drizzle-orm";

export const mostrarEmpleadosService = async () => {
  return await db.select().from(Empleado);
};

export const insertarEmpleadoService = async (data) => {
  const [nuevo] = await db.insert(Empleado).values(data).returning();
  return !!nuevo;
};

export const editarEmpleadoService = async (id, data) => {
  const [actualizado] = await db.update(Empleado).set(data).where(eq(Empleado.id, id)).returning();
  return !!actualizado;
};

export const eliminarEmpleadoService = async (id) => {
  const eliminado = await db.delete(Empleado).where(eq(Empleado.id, id)).returning();
  return eliminado.length > 0;
};