// src/services/usuarioService.js
import { db } from "../config/database.js";
import { Usuario } from "../models/usuario.js";
import { eq } from "drizzle-orm";

export const mostrarUsuariosService = async () => {
  return await db.select().from(Usuario);
};

export const insertarUsuarioService = async (data) => {
  const [nuevo] = await db.insert(Usuario).values(data).returning();
  return !!nuevo;
};

export const editarUsuarioService = async (id, data) => {
  const [actualizado] = await db
    .update(Usuario)
    .set(data)
    .where(eq(Usuario.id, id))
    .returning();
  return !!actualizado;
};

export const eliminarUsuarioService = async (id) => {
  const eliminado = await db.delete(Usuario).where(eq(Usuario.id, id)).returning();
  return eliminado.length > 0;
};
