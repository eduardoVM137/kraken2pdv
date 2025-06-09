import {
  
  mostrarIngresosService,
  insertarIngresoService,
  editarIngresoService,
  eliminarIngresoService,
  buscarIngresosService,
  obtenerDetalleCompraService,
  listarIngresosPendientesService,
  listarIngresosCanceladosService,
  compararPreciosPorProductoService,
  ultimoPrecioProductoProveedorService,
  evolucionPrecioProductoService,
  rankingProveedoresService,
  productosConPrecioBajoService,
  promedioCantidadPorProductoService,
  comprasRepetidasService,
  analisisProductoComprasService
} from "../services/ingresoService.js";


export const mostrarIngresosController = async (req, res, next) => {
  try {
    const data = await mostrarIngresosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export const insertarIngresoController = async (req, res, next) => {
  try {
    const exito = await insertarIngresoService(req.body);
    res.status(exito ? 201 : 400).json({ message: exito ? "Creado" : "Falló" });
  } catch (error) {
    next(error);
  }
};

export const editarIngresoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await editarIngresoService(id, req.body);
    res.status(exito ? 200 : 404).json({ message: exito ? "Actualizado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};

export const eliminarIngresoController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exito = await eliminarIngresoService(id);
    res.status(exito ? 200 : 404).json({ message: exito ? "Eliminado" : "No encontrado" });
  } catch (error) {
    next(error);
  }
};


// Buscar ingresos con filtros
export const buscarIngresosController = async (req, res, next) => {
  try {
    const data = await buscarIngresosService(req.query);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Ver detalle de compra
export const detalleIngresoController = async (req, res, next) => {
  try {
    const data = await obtenerDetalleCompraService(Number(req.params.id));
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Pendientes
export const ingresosPendientesController = async (_req, res, next) => {
  try {
    const data = await listarIngresosPendientesService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Cancelados
export const ingresosCanceladosController = async (_req, res, next) => {
  try {
    const data = await listarIngresosCanceladosService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Comparación de precios por producto
export const compararPreciosController = async (req, res, next) => {
  try {
    const data = await compararPreciosPorProductoService(Number(req.params.id));
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Último precio por proveedor
export const ultimosPreciosController = async (_req, res, next) => {
  try {
    const data = await ultimoPrecioProductoProveedorService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Evolución del precio
export const evolucionPrecioController = async (req, res, next) => {
  try {
    const data = await evolucionPrecioProductoService(Number(req.params.id));
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Ranking de proveedores
export const rankingProveedoresController = async (_req, res, next) => {
  try {
    const data = await rankingProveedoresService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Productos con precio bajo
export const productosPrecioBajoController = async (_req, res, next) => {
  try {
    const data = await productosConPrecioBajoService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Promedio de cantidad por producto
export const promedioCantidadController = async (_req, res, next) => {
  try {
    const data = await promedioCantidadPorProductoService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// Compras repetidas sospechosas
export const comprasRepetidasController = async (_req, res, next) => {
  try {
    const data = await comprasRepetidasService();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// 🔍 Análisis completo de compras por producto
export const analisisProductoController = async (req, res, next) => {
  try {
    const data = await analisisProductoComprasService(Number(req.params.id));
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
