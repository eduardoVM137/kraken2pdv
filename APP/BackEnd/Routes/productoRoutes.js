import express from "express";
import {
  insertarProductoController,
  editarProductoController,
  eliminarProductoController,
  mostrarProductosController,
  buscarProductoIdController,
  buscarProductoNombreDescripcionController,getInventarioYPrecios,getMovimientosPrecio,mostrarProductosPrecioController,
    productosCriticosController,
  productosConMetricasController,
  productosPrioritariosController,
} from "../controllers/productosController.js";
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post("/", insertarProductoController);
router.put("/:id", editarProductoController);
router.delete("/:id", eliminarProductoController);
// router.get("/", mostrarProductosController);
router.get("/", mostrarProductosPrecioController);
router.get("/buscar", buscarProductoNombreDescripcionController);
router.post("/inventario-precios",getInventarioYPrecios);
router.get("/movimientos/:id", getMovimientosPrecio);
router.get("/criticos", productosCriticosController);
router.get("/metricas", productosConMetricasController);
router.get("/prioritarios", productosPrioritariosController);
router.get("/:id", buscarProductoIdController);

export default router;

