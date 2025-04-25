import express from "express";
import {
  insertarDetalleProductoController,
  editarDetalleProductoController,
  eliminarDetalleProductoController,
  mostrarDetalleProductosController,
  buscarDetalleProductoIdController,
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
router.get("/:id", buscarDetalleProductoIdController);

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