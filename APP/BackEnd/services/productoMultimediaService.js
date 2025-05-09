import { MultimediaProducto } from '../models/producto_multimedia.js';
import { db } from '../config/database.js';
import { eq } from 'drizzle-orm';
/**
 * Inserta múltiples archivos multimedia para un detalle de producto.
 * @param {any} tx - Transacción de Drizzle.
 * @param {Array} multimediaList - Lista de multimedia con { detalle_producto_id, url_archivo }.
 * @returns {Array} Archivos insertados.
 */
export const insertarMultimediaProductoTx = async (tx, multimediaList) => {
  if (!Array.isArray(multimediaList) || multimediaList.length === 0) {
    throw new Error('La lista de multimedia está vacía o no es válida');
  }

  const inserted = await tx.insert(MultimediaProducto).values(multimediaList).returning();
  return inserted;
};


 

export const buscarFotosPorDetalleProductoService = async (detalle_producto_id) => {
  return await db
    .select()
    .from(MultimediaProducto)
    .where(eq(MultimediaProducto.detalle_producto_id, detalle_producto_id));
};