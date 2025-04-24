// --- usuario.js ---
import { pgTable, serial, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const Usuario = pgTable("usuario", {
  id: serial("id").primaryKey(),
  empresa_id: integer("empresa_id"),
  nombre_usuario: varchar("nombre_usuario", { length: 100 }),
  password_hash: varchar("password_hash", { length: 255 }),
  correo: varchar("correo", { length: 150 }),
  activo: boolean("activo"),
  creado_en: timestamp("creado_en", { withTimezone: false }),
  empleado_id: integer("empleado_id"),
});

// --- rol.js ---
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const Rol = pgTable("rol", {
  id: serial("id").primaryKey(),
  empresa_id: integer("empresa_id"),
  nombre: text("nombre"),
  descripcion: text("descripcion"),
});

// --- usuario_rol.js ---
import { pgTable, integer } from "drizzle-orm/pg-core";

export const UsuarioRol = pgTable("usuario_rol", {
  id: integer("id"),
  rol_id: integer("rol_id"),
});

// --- rol_permiso.js ---
import { pgTable, integer } from "drizzle-orm/pg-core";

export const RolPermiso = pgTable("rol_permiso", {
  rol_id: integer("rol_id"),
  area_id: integer("area_id"),
  accion_id: integer("accion_id"),
});

// --- area.js ---
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Area = pgTable("area", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }),
});

// --- accion.js ---
import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const Accion = pgTable("accion", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }),
  descripcion: text("descripcion"),
});

// --- restriccion_usuario.js ---
import { pgTable, serial, integer } from "drizzle-orm/pg-core";

export const RestriccionUsuario = pgTable("restriccion_usuario", {
  id: serial("id").primaryKey(),
  usuario_id: integer("usuario_id"),
  area_id: integer("area_id"),
  accion_id: integer("accion_id"),
});

// --- log_acceso.js ---
import { pgTable, serial, integer, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const LogAcceso = pgTable("log_acceso", {
  id: serial("id").primaryKey(),
  usuario_id: integer("usuario_id"),
  fecha: timestamp("fecha", { withTimezone: false }),
  ip: varchar("ip", { length: 100 }),
  navegador: varchar("navegador", { length: 100 }),
  exito: boolean("exito"),
  sistema: varchar("sistema", { length: 100 }),
});