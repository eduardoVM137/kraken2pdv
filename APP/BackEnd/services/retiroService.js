import { db } from '../config/database.js';
import { Retiro } from '../models/retiro.js';

export const insertarRetiroService = async (datos) => {
  return await db.insert(Retiro).values({
    idempleado_usuario: datos.idempleado_usuario,
    idcorte_caja: datos.idcorte_caja,
    fecha_hora: datos.fecha_hora,
    monto: datos.monto,
    motivo: datos.motivo,
  }).execute();
};

export const editarRetiroService = async (idretiro, datos) => {
  return await db.update(Retiro).set({
    idempleado_usuario: datos.idempleado_usuario,
    idcorte_caja: datos.idcorte_caja,
    fecha_hora: datos.fecha_hora,
    monto: datos.monto,
    motivo: datos.motivo,
  }).where(Retiro.idretiro.eq(idretiro)).execute();
};

export const eliminarRetiroService = async (idretiro) => {
  return await db.deleteFrom(Retiro).where(Retiro.idretiro.eq(idretiro)).execute();
};

export const mostrarRetirosService = async () => {
  return await db.select().from(Retiro).execute();
};
