// --- usuarioService.js ---
import { db } from "../config/database.js";
import { Usuario } from "../models/usuario.js";
import { eq } from "drizzle-orm";

export const mostrarUsuariosService = async () => {
  return await db.select().from(Usuario);
};

export const insertarUsuarioService = async (data) => {
  const [nuevo] = await db.insert(Usuario).values(data).returning();
  return !!nuevo;
};

export const editarUsuarioService = async (id, data) => {
  const [actualizado] = await db.update(Usuario).set(data).where(eq(Usuario.id, id)).returning();
  return !!actualizado;
};

export const eliminarUsuarioService = async (id) => {
  const eliminado = await db.delete(Usuario).where(eq(Usuario.id, id)).returning();
  return eliminado.length > 0;
};

// --- rolService.js ---
import { db } from "../config/database.js";
import { Rol } from "../models/rol.js";
import { eq } from "drizzle-orm";

export const mostrarRolsService = async () => {
  return await db.select().from(Rol);
};

export const insertarRolService = async (data) => {
  const [nuevo] = await db.insert(Rol).values(data).returning();
  return !!nuevo;
};

export const editarRolService = async (id, data) => {
  const [actualizado] = await db.update(Rol).set(data).where(eq(Rol.id, id)).returning();
  return !!actualizado;
};

export const eliminarRolService = async (id) => {
  const eliminado = await db.delete(Rol).where(eq(Rol.id, id)).returning();
  return eliminado.length > 0;
};

// --- usuario_rolService.js ---
import { db } from "../config/database.js";
import { UsuarioRol } from "../models/usuario_rol.js";
import { eq } from "drizzle-orm";

export const mostrarUsuarioRolsService = async () => {
  return await db.select().from(UsuarioRol);
};

export const insertarUsuarioRolService = async (data) => {
  const [nuevo] = await db.insert(UsuarioRol).values(data).returning();
  return !!nuevo;
};

export const editarUsuarioRolService = async (id, data) => {
  const [actualizado] = await db.update(UsuarioRol).set(data).where(eq(UsuarioRol.id, id)).returning();
  return !!actualizado;
};

export const eliminarUsuarioRolService = async (id) => {
  const eliminado = await db.delete(UsuarioRol).where(eq(UsuarioRol.id, id)).returning();
  return eliminado.length > 0;
};

// --- rol_permisoService.js ---
import { db } from "../config/database.js";
import { RolPermiso } from "../models/rol_permiso.js";
import { eq } from "drizzle-orm";

export const mostrarRolPermisosService = async () => {
  return await db.select().from(RolPermiso);
};

export const insertarRolPermisoService = async (data) => {
  const [nuevo] = await db.insert(RolPermiso).values(data).returning();
  return !!nuevo;
};

export const editarRolPermisoService = async (id, data) => {
  const [actualizado] = await db.update(RolPermiso).set(data).where(eq(RolPermiso.id, id)).returning();
  return !!actualizado;
};

export const eliminarRolPermisoService = async (id) => {
  const eliminado = await db.delete(RolPermiso).where(eq(RolPermiso.id, id)).returning();
  return eliminado.length > 0;
};

// --- areaService.js ---
import { db } from "../config/database.js";
import { Area } from "../models/area.js";
import { eq } from "drizzle-orm";

export const mostrarAreasService = async () => {
  return await db.select().from(Area);
};

export const insertarAreaService = async (data) => {
  const [nuevo] = await db.insert(Area).values(data).returning();
  return !!nuevo;
};

export const editarAreaService = async (id, data) => {
  const [actualizado] = await db.update(Area).set(data).where(eq(Area.id, id)).returning();
  return !!actualizado;
};

export const eliminarAreaService = async (id) => {
  const eliminado = await db.delete(Area).where(eq(Area.id, id)).returning();
  return eliminado.length > 0;
};

// --- accionService.js ---
import { db } from "../config/database.js";
import { Accion } from "../models/accion.js";
import { eq } from "drizzle-orm";

export const mostrarAccionsService = async () => {
  return await db.select().from(Accion);
};

export const insertarAccionService = async (data) => {
  const [nuevo] = await db.insert(Accion).values(data).returning();
  return !!nuevo;
};

export const editarAccionService = async (id, data) => {
  const [actualizado] = await db.update(Accion).set(data).where(eq(Accion.id, id)).returning();
  return !!actualizado;
};

export const eliminarAccionService = async (id) => {
  const eliminado = await db.delete(Accion).where(eq(Accion.id, id)).returning();
  return eliminado.length > 0;
};

// --- restriccion_usuarioService.js ---
import { db } from "../config/database.js";
import { RestriccionUsuario } from "../models/restriccion_usuario.js";
import { eq } from "drizzle-orm";

export const mostrarRestriccionUsuariosService = async () => {
  return await db.select().from(RestriccionUsuario);
};

export const insertarRestriccionUsuarioService = async (data) => {
  const [nuevo] = await db.insert(RestriccionUsuario).values(data).returning();
  return !!nuevo;
};

export const editarRestriccionUsuarioService = async (id, data) => {
  const [actualizado] = await db.update(RestriccionUsuario).set(data).where(eq(RestriccionUsuario.id, id)).returning();
  return !!actualizado;
};

export const eliminarRestriccionUsuarioService = async (id) => {
  const eliminado = await db.delete(RestriccionUsuario).where(eq(RestriccionUsuario.id, id)).returning();
  return eliminado.length > 0;
};

// --- log_accesoService.js ---
import { db } from "../config/database.js";
import { LogAcceso } from "../models/log_acceso.js";
import { eq } from "drizzle-orm";

export const mostrarLogAccesosService = async () => {
  return await db.select().from(LogAcceso);
};

export const insertarLogAccesoService = async (data) => {
  const [nuevo] = await db.insert(LogAcceso).values(data).returning();
  return !!nuevo;
};

export const editarLogAccesoService = async (id, data) => {
  const [actualizado] = await db.update(LogAcceso).set(data).where(eq(LogAcceso.id, id)).returning();
  return !!actualizado;
};

export const eliminarLogAccesoService = async (id) => {
  const eliminado = await db.delete(LogAcceso).where(eq(LogAcceso.id, id)).returning();
  return eliminado.length > 0;
};