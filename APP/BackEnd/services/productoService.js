import { db } from "../config/database.js";
import { Producto } from "../models/producto.js";
import { eq, like, or } from "drizzle-orm";

// Insertar producto
export const insertarProductoService = async (data) => {
  const result = await db.insert(Producto).values(data).returning();
  return result[0] || null;
};

// Editar producto
export const editarProductoService = async (idproducto, data) => {
  const result = await db.update(Producto)
    .set(data)
    .where(eq(Producto.idproducto, idproducto))
    .returning();

  return result[0] || null;
};

// Eliminar producto
export const eliminarProductoService = async (idproducto) => {
  return await db.delete(Producto)
    .where(eq(Producto.idproducto, idproducto));
};

// Mostrar todos
export const mostrarProductosService = async () => {
  return await db.select().from(Producto);
};

// Buscar por ID
export const buscarProductoIdService = async (idproducto) => {
  const [producto] = await db.select()
    .from(Producto)
    .where(eq(Producto.idproducto, idproducto))
    .limit(1);

  return producto || null;
};

// Buscar por nombre o descripción
export const buscarProductoNombreDescripcionService = async (busqueda) => {
  return await db.select()
    .from(Producto)
    .where(
      or(
        like(Producto.nombre, `%${busqueda}%`),
        like(Producto.descripcion, `%${busqueda}%`)
      )
    );
};
