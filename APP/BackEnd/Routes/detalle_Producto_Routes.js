import express from "express";
import {
  insertarDetalleProductoController,
  editarDetalleProductoController,
  eliminarDetalleProductoController,
  mostrarDetalleProductosController,
  buscarDetalleProductoIdController,
} from "../controllers/detalle_Producto_Controller.js";

const router = express.Router();

router.post("/", insertarDetalleProductoController);
router.put("/:id", editarDetalleProductoController);
router.delete("/:id", eliminarDetalleProductoController);
router.get("/", mostrarDetalleProductosController);
router.get("/:id", buscarDetalleProductoIdController);

export default router;
