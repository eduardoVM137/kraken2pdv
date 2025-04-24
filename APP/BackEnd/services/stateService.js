import { db } from '../config/database.js';
import { State } from '../models/state.js';

export const insertarStateService = async (datos) => {
  return await db.insert(State).values({
    nombre: datos.nombre,
  }).execute();
};

export const editarStateService = async (idstate, datos) => {
  return await db.update(State).set({
    nombre: datos.nombre,
  }).where(State.idstate.eq(idstate)).execute();
};

export const eliminarStateService = async (idstate) => {
  return await db.deleteFrom(State).where(State.idstate.eq(idstate)).execute();
};

export const mostrarStatesService = async () => {
  return await db.select().from(State).execute();
};
