import express from "express";
import {
  mostrarVentasController,
  insertarVentaController,
  editarVentaController,
  eliminarVentaController,mostrarProductosVentaController
} from "../controllers/ventaController.js";

const router = express.Router();

router.get("/productos", mostrarProductosVentaController);
router.get("/", mostrarVentasController);
router.post("/", insertarVentaController);
router.put("/:id", editarVentaController);
router.delete("/:id", eliminarVentaController);

export default router;