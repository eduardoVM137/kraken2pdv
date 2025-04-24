import { db } from '../config/database.js';
import { Empleado } from '../models/empleado.js';

export const insertarEmpleadoService = async (datos) => {
  return await db.insert(Empleado).values({
    codigo_empleado: datos.codigo_empleado,
    nombre: datos.nombre,
    apellidos: datos.apellidos,
    direccion: datos.direccion,
    telefono: datos.telefono,
    correo: datos.correo,
    fecha_nacimiento: datos.fecha_nacimiento,
    comentarios: datos.comentarios,
    foto: datos.foto,
    idstate: datos.idstate,
  }).execute();
};

export const editarEmpleadoService = async (idempleado, datos) => {
  return await db.update(Empleado).set({
    codigo_empleado: datos.codigo_empleado,
    nombre: datos.nombre,
    apellidos: datos.apellidos,
    direccion: datos.direccion,
    telefono: datos.telefono,
    correo: datos.correo,
    fecha_nacimiento: datos.fecha_nacimiento,
    comentarios: datos.comentarios,
    foto: datos.foto,
    idstate: datos.idstate,
  }).where(Empleado.idempleado.eq(idempleado)).execute();
};

export const eliminarEmpleadoService = async (idempleado) => {
  return await db.deleteFrom(Empleado).where(Empleado.idempleado.eq(idempleado)).execute();
};

export const mostrarEmpleadosService = async () => {
  return await db.select().from(Empleado).execute();
};
