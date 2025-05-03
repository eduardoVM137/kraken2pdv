import { db } from "../config/database.js";
import { EtiquetaProducto } from "../models/etiqueta_producto.js";
import { eq } from "drizzle-orm";
export const mostrarEtiquetasService = async () => {
  return await db.select().from(EtiquetaProducto);
};

export const insertarEtiquetaService = async (data) => {
  const [nueva] = await db.insert(EtiquetaProducto).values(data).returning();
  return !!nueva;
};

export const editarEtiquetaService = async (id, data) => {
  const [actualizado] = await db.update(EtiquetaProducto).set(data).where(eq(EtiquetaProducto.id, id)).returning();
  return !!actualizado;
};

export const eliminarEtiquetaService = async (id) => {
  const eliminado = await db.delete(EtiquetaProducto).where(eq(EtiquetaProducto.id, id)).returning();
  return eliminado.length > 0;
};

 

/**
 * Inserta múltiples alias para un detalle de producto.
 * @param {any} tx - Transacción de Drizzle.
 * @param {Array} aliasList - Lista de alias con { detalle_producto_id, codigo }.
 * @returns {Array} Alias insertados.
 */
// export const insertarAliasProductoTx = async (tx, aliasList) => {
//   if (!Array.isArray(aliasList) || aliasList.length === 0) {
//     throw new Error('La lista de alias está vacía o no es válida');
//   }

//   const inserted = await tx.insert(EtiquetaProducto).values(aliasList).returning();
//   return inserted;
// };



 
export const buscarAliasPorDetalleProductoService = async (detalle_producto_id) => {
  return await db
    .select()
    .from(EtiquetaProducto)
    .where(eq(EtiquetaProducto.detalle_producto_id, detalle_producto_id));
};
export const eliminarAliasProductoTx = async (tx, detalle_producto_id) => {
  await tx.delete(schema.EtiquetaProducto)
    .where(eq(schema.EtiquetaProducto.detalle_producto_id, detalle_producto_id));
};

export const insertarAliasProductoTx = async (tx, lista) => {
  if (!Array.isArray(lista) || lista.length === 0) return;
  await tx.insert(schema.EtiquetaProducto).values(lista);
};
