import express from "express";
import {
  insertarDetalleProductoController,
  editarDetalleProductoController,
  eliminarDetalleProductoController,
  mostrarDetalleProductosController,
  buscarDetalleProductoIdController,obtenerDetalleProducto,buscarProductoGeneralController,detalleProductoExpandidoController
} from "../controllers/detalle_ProductoController.js";
import validateRequest from "../middlewares/validateRequest.js";
import { detalleProductoSchema } from "../middlewares/validarDetalleProducto.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Crear
router.post(
  "/",
  
  validateRequest(detalleProductoSchema),
  insertarDetalleProductoController
);

// Leer todo
router.get("/", mostrarDetalleProductosController);

// Leer uno
// Buscar producto general por código de presentación (ligera)
router.get("/buscar-general/:codigo", buscarProductoGeneralController);

// Buscar detalle expandido por ID (precios + inventarios)
router.get("/detalle-expandido/:id", detalleProductoExpandidoController);

// Buscar un detalle exacto del producto (ej. para editarlo)
router.get("/:id", obtenerDetalleProducto);


// Actualizar
router.put(
  "/:id",
  authMiddleware,
  validateRequest(detalleProductoSchema),
  editarDetalleProductoController
);

// Eliminar
router.delete("/:id", authMiddleware, eliminarDetalleProductoController);

export default router;