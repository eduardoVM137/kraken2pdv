import { db } from '../config/database.js';
import { Ingreso } from '../models/ingreso.js';

export const insertarIngresoService = async (datos) => {
  return await db.insert(Ingreso).values({
    idempleado: datos.idempleado,
    idproveedor: datos.idproveedor,
    idstate: datos.idstate,
    fecha: datos.fecha,
    metodo_pago: datos.metodo_pago,
    comprobante: datos.comprobante,
    iva: datos.iva,
    total: datos.total,
    pagado: datos.pagado,
  }).execute();
};

export const editarIngresoService = async (idingreso, datos) => {
  return await db.update(Ingreso).set({
    idempleado: datos.idempleado,
    idproveedor: datos.idproveedor,
    idstate: datos.idstate,
    fecha: datos.fecha,
    metodo_pago: datos.metodo_pago,
    comprobante: datos.comprobante,
    iva: datos.iva,
    total: datos.total,
    pagado: datos.pagado,
  }).where(Ingreso.idingreso.eq(idingreso)).execute();
};

export const eliminarIngresoService = async (idingreso) => {
  return await db.deleteFrom(Ingreso).where(Ingreso.idingreso.eq(idingreso)).execute();
};

export const mostrarIngresosService = async () => {
  return await db.select().from(Ingreso).execute();
};
