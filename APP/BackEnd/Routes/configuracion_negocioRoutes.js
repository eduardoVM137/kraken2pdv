import express from "express";
import {
  mostrarConfiguracionNegociosController,
  insertarConfiguracionNegocioController,
  editarConfiguracionNegocioController,
  eliminarConfiguracionNegocioController,
} from "../controllers/configuracion_negocioController.js";

const router = express.Router();

router.get("/", mostrarConfiguracionNegociosController);
router.post("/", insertarConfiguracionNegocioController);
router.put("/:id", editarConfiguracionNegocioController);
router.delete("/:id", eliminarConfiguracionNegocioController);

export default router;