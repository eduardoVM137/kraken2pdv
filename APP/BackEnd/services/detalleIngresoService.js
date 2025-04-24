import { db } from '../config/database.js';
import { DetalleIngreso } from '../models/detalle_ingreso.js';

export const insertarDetalleIngresoService = async (datos) => {
  return await db.insert(DetalleIngreso).values({
    idingreso: datos.idingreso,
    idproducto: datos.idproducto,
    cantidad: datos.cantidad,
    precio_costo: datos.precio_costo,
  }).execute();
};

export const editarDetalleIngresoService = async (iddetalle_ingreso, datos) => {
  return await db.update(DetalleIngreso).set({
    idingreso: datos.idingreso,
    idproducto: datos.idproducto,
    cantidad: datos.cantidad,
    precio_costo: datos.precio_costo,
  }).where(DetalleIngreso.iddetalle_ingreso.eq(iddetalle_ingreso)).execute();
};

export const eliminarDetalleIngresoService = async (iddetalle_ingreso) => {
  return await db.delete(DetalleIngreso).where(eq(DetalleIngreso.iddetalle_ingreso,iddetalle_ingreso));

};


export const mostrarDetalleIngresosService = async () => {
  return await db.select().from(DetalleIngreso).execute();
};
