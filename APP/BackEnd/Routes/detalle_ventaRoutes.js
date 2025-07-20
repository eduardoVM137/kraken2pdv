import express from "express";
import {
  mostrarDetalleVentasController,
  insertarDetalleVentaController,
  editarDetalleVentaController,
  eliminarDetalleVentaController,
  buscarDetalleVentaController,
} from "../controllers/detalle_ventaController.js";

const router = express.Router();

router.get("/", mostrarDetalleVentasController);

router.get("/:id" ,buscarDetalleVentaController);

router.post("/", insertarDetalleVentaController);
router.put("/:id", editarDetalleVentaController);
router.delete("/:id", eliminarDetalleVentaController);

export default router;