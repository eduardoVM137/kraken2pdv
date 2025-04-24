import express from "express";
import {
  mostrarDetalleIngresosController,
  insertarDetalleIngresoController,
  editarDetalleIngresoController,
  eliminarDetalleIngresoController,
} from "../controllers/detalle_ingresoController.js";

const router = express.Router();

router.get("/", mostrarDetalleIngresosController);
router.post("/", insertarDetalleIngresoController);
router.put("/:id", editarDetalleIngresoController);
router.delete("/:id", eliminarDetalleIngresoController);

export default router;