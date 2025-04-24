import express from "express";
import {
  mostrarEtiquetasController,
  insertarEtiquetaController,
  editarEtiquetaController,
  eliminarEtiquetaController,
} from "../controllers/etiquetaProductoController.js";

const router = express.Router();

router.get("/", mostrarEtiquetasController);
router.post("/", insertarEtiquetaController);
router.put("/:id", editarEtiquetaController);
router.delete("/:id", eliminarEtiquetaController);

export default router;