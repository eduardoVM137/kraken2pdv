import { db } from "../config/database.js";
import { eq } from "drizzle-orm";
import {
  
  Presentacion,
  EtiquetaProducto,
  Componente,
  DetalleProductoCelda,
  DetalleProducto,
  Inventario,
   Precio,
  ProductoUbicacion,
ProductoMultimedia
} from "../models/schema.js"; // ajusta la ruta a tus tablas

   
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

export const editarDetalleProductoService1Tx = async (tx, id, data) => {
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
export const editarDetalleProductoServiceTx = async (tx, data) => {
  const detalle = await tx
    .update(DetalleProducto)
    .set(data)
    .where(eq(DetalleProducto.id, data.id))
    .returning();

  if (!detalle?.[0]) {
    throw new Error("No se pudo actualizar detalle_producto");
  }

  return detalle[0];
};


export const eliminarRelacionesDetalleProductoTx = async (tx, detalle_producto_id) => {
  try {
    // Elimina multimedia (fotos)
    await tx.delete(ProductoMultimedia).where(eq(ProductoMultimedia.detalle_producto_id, detalle_producto_id));

    // Elimina ubicaciones lógicas
    await tx.delete(ProductoUbicacion).where(eq(ProductoUbicacion.detalle_producto_id, detalle_producto_id));

    // Elimina precios (se asume que se eliminan todos los precios ligados al detalle_producto)
    await tx.delete(Precio).where(eq(Precio.detalle_producto_id, detalle_producto_id));

    // Elimina presentaciones
    await tx.delete(Presentacion).where(eq(Presentacion.detalle_producto_id, detalle_producto_id));

    // Elimina etiquetas (alias)
    await tx.delete(EtiquetaProducto).where(eq(EtiquetaProducto.detalle_producto_id, detalle_producto_id));

    // Elimina componentes donde este producto sea hijo
    await tx.delete(Componente).where(eq(Componente.detalle_producto_hijo_id, detalle_producto_id));

    // Elimina celdas del inventario
    await tx.delete(DetalleProductoCelda).where(eq(DetalleProductoCelda.detalle_producto_id, detalle_producto_id));

    // Elimina inventarios
    await tx.delete(Inventario).where(eq(Inventario.detalle_producto_id, detalle_producto_id));

    // Opcional: eliminar detalle_atributo si quieres evitar duplicados de atributos
    // Podrías consultar el atributo_id y luego eliminar sus detalles, si es necesario

    console.log(`Relaciones del detalle_producto ${detalle_producto_id} eliminadas correctamente.`);
  } catch (err) {
    throw new Error("Error al eliminar relaciones del detalle_producto: " + err.message);
  }
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