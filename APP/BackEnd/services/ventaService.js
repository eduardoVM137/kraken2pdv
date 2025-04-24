import { db } from '../config/database.js';
import { Venta } from '../models/venta.js';

export const insertarVentaService = async (datos) => {
  return await db.insert(Venta).values({
    idempleado_usuario: datos.idempleado_usuario,
    idcliente: datos.idcliente,
    idstate: datos.idstate,
    fecha: datos.fecha,
    metodo_pago: datos.metodo_pago,
    comprobante: datos.comprobante,
    iva: datos.iva,
    total: datos.total,
    pagado: datos.pagado,
    comentarios: datos.comentarios,
  }).execute();
};

export const editarVentaService = async (idventa, datos) => {
  return await db.update(Venta).set({
    idempleado_usuario: datos.idempleado_usuario,
    idcliente: datos.idcliente,
    idstate: datos.idstate,
    fecha: datos.fecha,
    metodo_pago: datos.metodo_pago,
    comprobante: datos.comprobante,
    iva: datos.iva,
    total: datos.total,
    pagado: datos.pagado,
    comentarios: datos.comentarios,
  }).where(Venta.idventa.eq(idventa)).execute();
};

export const eliminarVentaService = async (idventa) => {
  return await db.deleteFrom(Venta).where(Venta.idventa.eq(idventa)).execute();
};

export const mostrarVentasService = async () => {
  return await db.select().from(Venta).execute();
};
