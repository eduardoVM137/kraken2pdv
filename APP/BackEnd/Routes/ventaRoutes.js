import express from "express";
import {
  mostrarVentasController,
  insertarVentaController,
  editarVentaController,
  eliminarVentaController,
} from "../controllers/ventaController.js";

const router = express.Router();

router.get("/", mostrarVentasController);
router.post("/", insertarVentaController);
router.put("/:id", editarVentaController);
router.delete("/:id", eliminarVentaController);

export default router;