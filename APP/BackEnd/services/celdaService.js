import { db } from "../config/database.js";
import { Celda } from "../models/celda.js";
import { eq } from "drizzle-orm";

import { DetalleProductoCelda } from "../models/detalle_producto_celda.js";
import { ContenedorFisico } from "../models/contenedor_fisico.js";
import { UbicacionFisica } from "../models/ubicacion_fisica.js";
 
export const mostrarCeldasService = async () => {
  return await db.select().from(Celda);
};

export const insertarCeldaService = async (data) => {
  const [nuevo] = await db.insert(Celda).values(data).returning();
  return !!nuevo;
};

export const editarCeldaService = async (id, data) => {
  const [actualizado] = await db.update(Celda).set(data).where(eq(Celda.id, id)).returning();
  return !!actualizado;
};

export const eliminarCeldaService = async (id) => {
  const eliminado = await db.delete(Celda).where(eq(Celda.id, id)).returning();
  return eliminado.length > 0;
};
export async function getUbicacionFisicaDetallada(detalleProductoId) {
  const resultado = await db
    .select({
      cantidad: DetalleProductoCelda.cantidad,
      fila: Celda.fila,
      columna: Celda.columna,
      nombre_contenedor: ContenedorFisico.nombre,
      descripcion_contenedor: ContenedorFisico.descripcion,
      nombre_ubicacion: UbicacionFisica.nombre,
      tipo_ubicacion: UbicacionFisica.tipo
    })
    .from(DetalleProductoCelda)
    .innerJoin(Celda, eq(DetalleProductoCelda.celda_id, Celda.id))
    .innerJoin(ContenedorFisico, eq(Celda.contenedor_fisico_id, ContenedorFisico.id))
    .innerJoin(UbicacionFisica, eq(ContenedorFisico.ubicacion_fisica_id, UbicacionFisica.id))
    .where(eq(DetalleProductoCelda.detalle_producto_id, detalleProductoId));

  return resultado;
}