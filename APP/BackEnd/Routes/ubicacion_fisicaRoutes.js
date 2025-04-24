import express from "express";
import {
  mostrarUbicacion_fisicasController,
  insertarUbicacion_fisicaController,
  editarUbicacion_fisicaController,
  eliminarUbicacion_fisicaController,
} from "../controllers/ubicacion_fisicaController.js";

const router = express.Router();

router.get("/", mostrarUbicacion_fisicasController);
router.post("/", insertarUbicacion_fisicaController);
router.put("/:id", editarUbicacion_fisicaController);
router.delete("/:id", eliminarUbicacion_fisicaController);

export default router;