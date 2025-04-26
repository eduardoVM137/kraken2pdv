import { db } from "../config/database.js";
import { Atributo } from "../models/atributo.js";
import { eq } from "drizzle-orm";

import { DetalleAtributo } from "../models/detalle_atributo.js";
export const mostrarAtributosService = async () => {
  return await db.select().from(Atributo);
};

export const insertarAtributoService = async (data) => {
  const [nuevo] = await db.insert(Atributo).values(data).returning();
  return !!nuevo;
};

export const editarAtributoService = async (id, data) => {
  const [actualizado] = await db.update(Atributo).set(data).where(eq(Atributo.id, id)).returning();
  return !!actualizado;
};

export const eliminarAtributoService = async (id) => {
  const eliminado = await db.delete(Atributo).where(eq(Atributo.id, id)).returning();
  return eliminado.length > 0;
};

export const insertarAtributoServiceTx = async (tx, data) => {
  const [insertado] = await tx.insert(Atributo).values(data).returning();
  return insertado;
};

export const insertarDetalleAtributosServiceTx = async (tx, dataArray) => {
  return await tx.insert(DetalleAtributo).values(dataArray).returning();
};

 
export const buscarAtributoPorIdService = async (id) => {
  return await db
    .select()
    .from(Atributo)
    .where(eq(Atributo.id, id))
    .then(res => res[0]);
};