import express from "express";
import {
  insertarProductoController,
  editarProductoController,
  eliminarProductoController,
  mostrarProductosController,
  buscarProductoIdController,
  buscarProductoNombreDescripcionController,
} from "../controllers/productosController.js";
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post("/", insertarProductoController);
router.put("/:id", editarProductoController);
router.delete("/:id", eliminarProductoController);
router.get("/", mostrarProductosController);
router.get("/buscar", buscarProductoNombreDescripcionController);
router.get("/:id", buscarProductoIdController);

export default router;

