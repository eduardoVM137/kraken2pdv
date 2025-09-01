import {
    insertarProductoService,
    editarProductoService,
    eliminarProductoService,
    mostrarProductosService,
    buscarProductoIdService,
    buscarProductoNombreDescripcionService,obtenerPreciosInventarios,getHistorialDetalleProducto  ,mostrarProductosConPreciosService,

      obtenerProductosCriticos,
  obtenerProductosConMetricas,
  obtenerProductosPrioritarios,
  } from "../services/productoService.js";
  
  export const insertarProductoController = async (req, res, next) => {
    try {
      const exito = await insertarProductoService(req.body);
      if (!exito) return res.status(400).json({ message: "No se pudo crear el producto" });
  
      return res.status(201).json({ message: "Producto creado correctamente" });
    } catch (error) {
      next(error);
    }
  };
  
  export const editarProductoController = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
  
      const exito = await editarProductoService(id, req.body);
      if (!exito) return res.status(404).json({ message: "Producto no encontrado" });
  
      return res.status(200).json({ message: "Producto actualizado correctamente" });
    } catch (error) {
      next(error);
    }
  };
  
  export const eliminarProductoController = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
  
      const exito = await eliminarProductoService(id);
      if (!exito) return res.status(404).json({ message: "Producto no encontrado" });
  
      return res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  };
  
  export const mostrarProductosController = async (req, res, next) => {
    try {
      const data = await mostrarProductosService();
      return res.status(200).json({ message: "Productos encontrados", data });
    } catch (error) {
      next(error);
    }
  };


  export const buscarProductoIdController = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
  
      const producto = await buscarProductoIdService(id);
      if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
  
      return res.status(200).json({ data: producto });
    } catch (error) {
      next(error);
    }
  };
  
  export const buscarProductoNombreDescripcionController = async (req, res, next) => {
    try {
      const { busqueda } = req.query;
      if (!busqueda) return res.status(400).json({ message: "Se requiere un término de búsqueda" });
  
      const data = await buscarProductoNombreDescripcionService(busqueda);
      return res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };
  export async function getInventarioYPrecios(req, res) {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Se requiere una lista válida de IDs de detalle_producto.",
      });
    }

    const data = await obtenerPreciosInventarios(ids);

    res.status(200).json({
      message: "Inventarios y precios obtenidos correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en getInventarioYPrecios:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}


export async function getMovimientosPrecio(req, res) {
  try {
    const detalleProductoId = parseInt(req.params.id);

    if (isNaN(detalleProductoId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const movimientos = await getHistorialDetalleProducto (detalleProductoId);

    res.status(200).json({
      message: "Movimientos de precio obtenidos correctamente",
      data: movimientos,
    });
  } catch (err) {
    console.error("Error en getMovimientosPrecio:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}



//panel productos 

  export const mostrarProductosPrecioController = async (req, res, next) => {
  try {
    const productos = await mostrarProductosConPreciosService();

    const productosMap = new Map();

    for (const prod of productos) {
      const {
        detalle_producto_id,
        nombre_calculado,
        activo, // booleano
        precio_id,
        precio_venta,
        tipo_cliente,
        etiqueta_id,
        alias,
        tipo
      } = prod;

      if (!productosMap.has(detalle_producto_id)) {
        productosMap.set(detalle_producto_id, {
          id: detalle_producto_id, // ✅ lo renombramos a "id"
          nombre_calculado,
          activo: activo ? "activo" : "inactivo", // ✅ string esperado por el frontend
          precios: [],
          alias: [],
        });
      }

      const actual = productosMap.get(detalle_producto_id);

      if (precio_id && !actual.precios.some(p => p.precio_id === precio_id)) {
        actual.precios.push({
          precio_id,
          precio_venta,
          tipo_cliente
        });
      }

      if (etiqueta_id && !actual.alias.some(a => a.etiqueta_id === etiqueta_id)) {
        actual.alias.push({
          etiqueta_id,
          alias,
          tipo
        });
      }
    }

    const data = Array.from(productosMap.values());

    res.json({
      message: "Productos encontrados",
      data
    });
  } catch (error) {
    console.error("Error en mostrarProductosConPreciosController:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};
//area stock


export const productosCriticosController = async (req, res, next) => {
  try {
    const data = await obtenerProductosCriticos();
    return res.status(200).json({ message: "Productos críticos encontrados", data });
  } catch (error) {
    next(error);
  }
};

export const productosConMetricasController = async (req, res, next) => {
  try {
    const data = await obtenerProductosConMetricas();
    return res.status(200).json({ message: "Productos con métricas encontrados", data });
  } catch (error) {
    next(error);
  }
};

export const productosPrioritariosController = async (req, res, next) => {
  try {
    const data = await obtenerProductosPrioritarios();
    return res.status(200).json({ message: "Productos prioritarios encontrados", data });
  } catch (error) {
    next(error);
  }
};