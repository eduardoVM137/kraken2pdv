import { db } from "../config/database.js";
import { DetalleProducto } from "../models/detalle_producto.js";
import { eq } from "drizzle-orm";

   
import { DetalleAtributo } from "../models/detalle_atributo.js";
// 🔹 Insertar
export const insertarDetalleProductoService = async (data) => {
  try {
    const [insertado] = await db.insert(DetalleProducto).values(data).returning();
    return insertado ?? null;
  } catch (error) {
    console.error("Error al insertar detalle_producto:", error);
    throw new Error("No se pudo insertar el detalle del producto");
  }
};

// 🔹 Editar

export const editarDetalleProductoService = async (id, data) => {
  try {
    const [actualizado] = await db
      .update(DetalleProducto)
      .set(data)
      .where(eq(DetalleProducto.id, id))
      .returning();

    return actualizado ?? null;
  } catch (error) {
    console.error("Error al editar detalle_producto:", error);
    throw new Error("No se pudo editar el detalle del producto especificado");
  }
};

export const editarDetalleProductoServiceTx = async (tx, id, data) => {
  const [actualizado] = await tx
    .update(schema.DetalleProducto)
    .set(data)
    .where(eq(schema.DetalleProducto.id, id))
    .returning();
  return actualizado ?? null;
};

// 🔹 Eliminar
export const eliminarDetalleProductoService = async (id) => {
  try {
    const eliminado = await db
      .delete(DetalleProducto)
      .where(eq(DetalleProducto.id, id))
      .returning();
    return eliminado.length > 0;
  } catch (error) {
    console.error("Error al eliminar detalle_producto:", error);
    throw new Error("No se pudo eliminar el detalle del producto");
  }
};

// 🔹 Mostrar todos
export const mostrarDetalleProductosService = async () => {
  return await db.select().from(DetalleProducto);
};

// 🔹 Buscar por ID
// export const buscarDetalleProductoIdService = async (id) => {
//   const [detalle] = await db
//     .select()
//     .from(DetalleProducto)
//     .where(eq(DetalleProducto.id, id))
//     .limit(1);
//   return detalle ?? null;
// };

export const insertarDetalleProductoServiceTx = async (tx, data) => {
  const [insertado] = await tx.insert(DetalleProducto).values(data).returning();
  return insertado;
};

/**
 * Fetches a single DetalleProducto record by its ID.
 * 
 * @param {number} id - The ID of the DetalleProducto to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the DetalleProducto object if found, or null if not found.
 * @throws Will throw an error if the database query fails.
 */

export const buscarDetalleProductoIdService = async (id) => {
  return await db
    .select()
    .from(DetalleProducto)
    .where(eq(DetalleProducto.id, id))
    .then(res => res[0]);
};



 

 

export const getDetalleProductoById = async (id) => {
  try {
    const detalle = await db.query.DetalleProducto.findFirst({
      where: eq(DetalleProducto.id, id),
      with: {
        producto: true,
        atributo: true,
        state: true,
        componentes_padre: true,
        componentes_hijo: true,
        precios: true,
        inventarios: true,
        presentaciones: true,
        etiquetas: true,
        multimedia: true,
        ubicaciones: true,
      },
    });

    if (!detalle) return null; 
    // Cargar los detalle_atributo por separado usando atributo_id
    const detalle_atributo = detalle.atributo_id
      ? await db.query.DetalleAtributo.findMany({
          where: eq(DetalleAtributo.id_atributo, detalle.atributo_id),
        })
      : [];

    return {
      ...detalle,
      detalle_atributo,
    };
  } catch (error) {
    console.error("Error al obtener detalle del producto:", error);
    throw new Error("No se pudo obtener el detalle del producto");
  }
};