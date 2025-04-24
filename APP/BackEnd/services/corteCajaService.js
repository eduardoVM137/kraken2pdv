import { db } from '../config/database.js';
import { CorteCaja } from '../models/corte_de_caja.js';

export const insertarCorteCajaService = async (datos) => {
  return await db.insert(CorteCaja).values({
    idempleado_usuario: datos.idempleado_usuario,
    fecha_hora_inicio: datos.fecha_hora_inicio,
    fecha_hora_fin: datos.fecha_hora_fin,
    fondo_inicial: datos.fondo_inicial,
    total_retiros: datos.total_retiros,
    total_ventas: datos.total_ventas,
    total_entregado: datos.total_entregado,
  }).execute();
};

export const editarCorteCajaService = async (idcorte_caja, datos) => {
  return await db.update(CorteCaja).set({
    idempleado_usuario: datos.idempleado_usuario,
    fecha_hora_inicio: datos.fecha_hora_inicio,
    fecha_hora_fin: datos.fecha_hora_fin,
    fondo_inicial: datos.fondo_inicial,
    total_retiros: datos.total_retiros,
    total_ventas: datos.total_ventas,
    total_entregado: datos.total_entregado,
  }).where(CorteCaja.idcorte_caja.eq(idcorte_caja)).execute();
};

export const eliminarCorteCajaService = async (idcorte_caja) => {
  return await db.deleteFrom(CorteCaja).where(CorteCaja.idcorte_caja.eq(idcorte_caja)).execute();
};

export const mostrarCortesCajaService = async () => {
  return await db.select().from(CorteCaja).execute();
};
