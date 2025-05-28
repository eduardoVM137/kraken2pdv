import {
  mostrarInventariosService,
  insertarInventarioService,
  editarInventarioService,
  eliminarInventarioService,
} from "../services/inventarioService.js";

export const mostrarInventariosController = async (req, res, next) => {
  try {
    const data = await mostrarInventariosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarInventarioController = async (req, res, next) => {
  try {
    const exito = await insertarInventarioService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarInventarioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarInventarioService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarInventarioController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarInventarioService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const buscarInventarioPorDetalleProductoService = async (detalle_producto_id) => {
  return await db
    .select({
      inventario_id: Inventario.id,
      detalle_producto_id: Inventario.detalle_producto_id,
      stock_actual: Inventario.cantidad,
      precio_costo: Inventario.costo,
      ubicacion_id: Inventario.ubicacion_id,
      ubicacion_nombre: Ubicacion.nombre,
    })
    .from(Inventario)
    .leftJoin(Ubicacion, eq(Inventario.ubicacion_id, Ubicacion.id))
    .where(eq(Inventario.detalle_producto_id, detalle_producto_id));
};