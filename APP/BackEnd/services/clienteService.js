import { db } from '../config/database.js';
import { Cliente } from '../models/cliente.js';

export const insertarClienteService = async (datos) => {
  return await db.insert(Cliente).values({
    codigo_cliente: datos.codigo_cliente,
    nombre: datos.nombre,
    apellidos: datos.apellidos,
    direccion: datos.direccion,
    telefono: datos.telefono,
    correo: datos.correo,
    fecha_nacimiento: datos.fecha_nacimiento,
    comentarios: datos.comentarios,
    foto: datos.foto,
  }).execute();
};

export const editarClienteService = async (idcliente, datos) => {
  return await db.update(Cliente).set({
    codigo_cliente: datos.codigo_cliente,
    nombre: datos.nombre,
    apellidos: datos.apellidos,
    direccion: datos.direccion,
    telefono: datos.telefono,
    correo: datos.correo,
    fecha_nacimiento: datos.fecha_nacimiento,
    comentarios: datos.comentarios,
    foto: datos.foto,
  }).where(Cliente.idcliente.eq(idcliente)).execute();
};

export const eliminarClienteService = async (idcliente) => {
  return await db.deleteFrom(Cliente).where(Cliente.idcliente.eq(idcliente)).execute();
};

export const mostrarClientesService = async () => {
  return await db.select().from(Cliente).execute();
};
