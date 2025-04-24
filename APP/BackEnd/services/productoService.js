import { db } from '../config/database.js';
import { Producto } from '../models/producto.js';

// Crear un nuevo producto (INSERT)
export const insertarProductoService = async (data) => {
    return await db.insert(Producto).values(data).execute();
};

// Obtener todos los productos  (SELECT)
export const mostrarProductosService = async () => {
    return await db.select().from(Producto).execute();
};

// Actualizar un producto (UPDATE)
export const s_editarProducto = async (id, data) => {
    return await db.update(Producto).set(data).where(Producto.id.eq(id)).execute();
};

// Eliminar un producto (DELETE)
export const s_eliminarProducto = async (id) => {
    return await db.deleteFrom(Producto).where(Producto.id.eq(id)).execute();
};

export const s_mostrarProductosActivos = async () => {//metodo de prueba
    const [results] = await db.execute('select * from productos');
    return results;
};
