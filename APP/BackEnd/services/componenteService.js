import { db } from '../config/database.js';
import { Componente } from '../models/componente.js';

export const insertarComponenteService = async (datos) => {
  return await db.insert(Componente).values({
    idproducto: datos.idproducto,
    idproducto_item: datos.idproducto_item,
    cantidad: datos.cantidad,
  }).execute();
};

export const editarComponenteService = async (idcomponente, datos) => {
  return await db.update(Componente).set({
    idproducto: datos.idproducto,
    idproducto_item: datos.idproducto_item,
    cantidad: datos.cantidad,
  }).where(Componente.idcomponente.eq(idcomponente)).execute();
};

export const eliminarComponenteService = async (idcomponente) => {
  return await db.deleteFrom(Componente).where(Componente.idcomponente.eq(idcomponente)).execute();
};

export const mostrarComponentesService = async () => {
  return await db.select().from(Componente).execute();
};
