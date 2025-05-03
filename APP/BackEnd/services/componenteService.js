import { db } from "../config/database.js";
import { Componente } from "../models/componente.js";
import { eq } from "drizzle-orm";
export const mostrarComponentesService = async () => {
  return await db.select().from(Componente);
};

export const insertarComponenteService = async (data) => {
  const [nuevo] = await db.insert(Componente).values(data).returning();
  return !!nuevo;
};

export const editarComponenteService = async (id, data) => {
  const [actualizado] = await db.update(Componente).set(data).where(eq(Componente.id, id)).returning();
  return !!actualizado;
};

export const eliminarComponenteService = async (id) => {
  const eliminado = await db.delete(Componente).where(eq(Componente.id, id)).returning();
  return eliminado.length > 0;
};

export const insertarComponenteProductoTx = async (tx, ComponenteList) => {
  if (!Array.isArray(ComponenteList) || ComponenteList.length === 0) {
    throw new Error('la lista componente está vacía o no es válida');
  }

  const inserted = await tx.insert(Componente).values(ComponenteList).returning();
  return inserted;
};

export const buscarComponentesPorDetalleProductoService = async (detalleProductoId) => {
  return await db
    .select()
    .from(Componente)
    .where(eq(Componente.detalle_producto_hijo_id, detalleProductoId));
};