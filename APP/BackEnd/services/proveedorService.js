import { db } from '../config/database.js';
import { Proveedor } from '../models/proveedor.js';

export const insertarProveedorService = async (datos) => {
  return await db.insert(Proveedor).values({
    codigo_proveedor: datos.codigo_proveedor,
    nombre: datos.nombre,
    rfc: datos.rfc,
    direccion: datos.direccion,
    telefono: datos.telefono,
    correo: datos.correo,
    comentarios: datos.comentarios,
    foto: datos.foto,
    idstate: datos.idstate,
  }).execute();
};

export const editarProveedorService = async (idproveedor, datos) => {
  return await db.update(Proveedor).set({
    codigo_proveedor: datos.codigo_proveedor,
    nombre: datos.nombre,
    rfc: datos.rfc,
    direccion: datos.direccion,
    telefono: datos.telefono,
    correo: datos.correo,
    comentarios: datos.comentarios,
    foto: datos.foto,
    idstate: datos.idstate,
  }).where(Proveedor.idproveedor.eq(idproveedor)).execute();
};

export const eliminarProveedorService = async (idproveedor) => {
  return await db.deleteFrom(Proveedor).where(Proveedor.idproveedor.eq(idproveedor)).execute();
};

export const mostrarProveedoresService = async () => {
  return await db.select().from(Proveedor).execute();
};
