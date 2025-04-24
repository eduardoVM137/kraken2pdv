import express from "express";
import {
  mostrarDetalleProductoCeldasController,
  insertarDetalleProductoCeldaController,
  editarDetalleProductoCeldaController,
  eliminarDetalleProductoCeldaController,
} from "../controllers/detalle_producto_celdaController.js";

const router = express.Router();

router.get("/", mostrarDetalleProductoCeldasController);
router.post("/", insertarDetalleProductoCeldaController);
router.put("/:id", editarDetalleProductoCeldaController);
router.delete("/:id", eliminarDetalleProductoCeldaController);

export default router;