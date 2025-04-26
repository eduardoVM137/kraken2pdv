import { eq } from 'drizzle-orm';
import { DetalleAtributo } from '../models/detalle_atributo.js';
import { db } from '../config/database.js';

export const buscarDetallesAtributoService = async (atributo_id) => {
  return await db
    .select()
    .from(DetalleAtributo)
    .where(eq(DetalleAtributo.id_atributo, atributo_id));
};
