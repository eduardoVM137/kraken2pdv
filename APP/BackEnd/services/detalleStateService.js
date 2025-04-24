import { db } from '../config/database.js';
import { DetalleState } from '../models/detalle_state.js';

export const insertarDetalleStateService = async (datos) => {
  return await db.insert(DetalleState).values({
    idempleado_usuario: datos.idempleado_usuario,
    idstate: datos.idstate,
    fecha: datos.fecha,
    estado: datos.estado,
  }).execute();
};

export const editarDetalleStateService = async (iddetalle_state, datos) => {
  return await db.update(DetalleState).set({
    idempleado_usuario: datos.idempleado_usuario,
    idstate: datos.idstate,
    fecha: datos.fecha,
    estado: datos.estado,
  }).where(DetalleState.iddetalle_state.eq(iddetalle_state)).execute();
};

export const eliminarDetalleStateService = async (iddetalle_state) => {
  return await db.deleteFrom(DetalleState).where(DetalleState.iddetalle_state.eq(iddetalle_state)).execute();
};

export const mostrarDetalleStatesService = async () => {
  return await db.select().from(DetalleState).execute();
};
