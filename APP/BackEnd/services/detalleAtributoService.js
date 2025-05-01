import { eq } from 'drizzle-orm';
import { DetalleAtributo } from '../models/detalle_atributo.js';
import { db } from '../config/database.js';
import * as schema from "../models/schema.js"; // ✅ NECESARIO para schema.DetalleProducto

export const buscarDetallesAtributoService = async (atributo_id) => {
  return await db
    .select()
    .from(DetalleAtributo)
    .where(eq(DetalleAtributo.id_atributo, atributo_id));
};
export const eliminarDetallesAtributoServiceTx = async (tx, atributo_id) => {
  await tx.delete(schema.DetalleAtributo)
    .where(eq(schema.DetalleAtributo.id_atributo, atributo_id));
};

export const insertarDetalleAtributosServiceTx = async (tx, lista) => {
  if (!Array.isArray(lista) || lista.length === 0) return;
  await tx.insert(schema.DetalleAtributo).values(lista);
};
