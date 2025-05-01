import express from "express";
import {
  insertarDetalleProductoController,
  editarDetalleProductoController,
  eliminarDetalleProductoController,
  mostrarDetalleProductosController,
  buscarDetalleProductoIdController,
  buscarDetalleProductoCompletoController,
} from "../controllers/detalle_ProductoController.js";

import validateRequest from "../middlewares/validateRequest.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// Importar los esquemas separados
import {
  detalleProductoCrearSchema,
  detalleProductoEditarSchema,
} from "../middlewares/validarDetalleProducto.js"; 

const router = express.Router();

// Crear
router.post(
  "/",
  validateRequest(detalleProductoCrearSchema),
  insertarDetalleProductoController
);

// Leer todos
router.get("/", mostrarDetalleProductosController);

// Leer uno (detalle completo)
router.get("/:id", buscarDetalleProductoCompletoController);

// Actualizar
router.put(
  "/:id",
  
  validateRequest(detalleProductoEditarSchema),
  editarDetalleProductoController
);

// Eliminar
router.delete("/:id", eliminarDetalleProductoController);

export default router;
