import express from "express";
import {
  mostrarConfiguracionExtraJsonsController,
  insertarConfiguracionExtraJsonController,
  editarConfiguracionExtraJsonController,
  eliminarConfiguracionExtraJsonController,
} from "../controllers/configuracion_extra_jsonController.js";

const router = express.Router();

router.get("/", mostrarConfiguracionExtraJsonsController);
router.post("/", insertarConfiguracionExtraJsonController);
router.put("/:id", editarConfiguracionExtraJsonController);
router.delete("/:id", eliminarConfiguracionExtraJsonController);

export default router;