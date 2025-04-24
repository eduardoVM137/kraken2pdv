import express from "express";
import {
  mostrarIngresosController,
  insertarIngresoController,
  editarIngresoController,
  eliminarIngresoController,
} from "../controllers/ingresoController.js";

const router = express.Router();

router.get("/", mostrarIngresosController);
router.post("/", insertarIngresoController);
router.put("/:id", editarIngresoController);
router.delete("/:id", eliminarIngresoController);

export default router;