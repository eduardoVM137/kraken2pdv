import express from "express";
import {
  mostrarProductoUbicacionsController,
  insertarProductoUbicacionController,
  editarProductoUbicacionController,
  eliminarProductoUbicacionController,buscarProductoUbicacionController,
} from "../controllers/producto_ubicacionController.js";

const router = express.Router();

router.get("/", mostrarProductoUbicacionsController);
router.post("/", insertarProductoUbicacionController);
router.put("/:id", editarProductoUbicacionController);
router.delete("/:id", eliminarProductoUbicacionController);
router.get('/buscar-precio-inventario/:id', buscarProductoUbicacionController);

export default router;