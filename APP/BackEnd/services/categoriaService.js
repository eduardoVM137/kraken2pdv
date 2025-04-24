import { db } from "../config/database.js";
import { Categoria } from "../models/categoria.js";
import { eq } from "drizzle-orm";

// 🔹 Mostrar todas las categorías activas
 
export const mostrarCategoriasService = async () => {
  return await db.select().from(Categoria).where(eq(Categoria.estado, true));
};

// 🔹 Insertar categoría
export const insertarCategoriaService = async (data) => {
  try {
    const [insertado] = await db
      .insert(Categoria)
      .values(data)
      .returning(); // Trae todos los campos generados (como el ID)

    return insertado;
  } catch (error) {
    console.error("Error al insertar categoría:", error);
    throw new Error("No se pudo insertar la categoría");
  }
};

// 🔹 Editar categoría
export const editarCategoriaService = async (id, data) => {
  const resultado = await db.update(Categoria).set(data).where(eq(Categoria.id, id));
  if (resultado.affectedRows === 0) return null;
  return { id, ...data };
};

// 🔹 Eliminar categoría
export const eliminarCategoriaService = async (id) => {
  return await db.delete(Categoria).where(eq(Categoria.id, id));
};
