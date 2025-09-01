import express from "express";
import {
  mostrarCeldasController,
  insertarCeldaController,
  editarCeldaController,
  eliminarCeldaController,getUbicacionFisicaCompleta,
} from "../controllers/celdaController.js";

const router = express.Router();

router.get("/", mostrarCeldasController);
router.post("/", insertarCeldaController);
router.put("/:id", editarCeldaController);
router.delete("/:id", eliminarCeldaController);
router.get("/ubicacion-detallada/:id", getUbicacionFisicaCompleta);

export default router;