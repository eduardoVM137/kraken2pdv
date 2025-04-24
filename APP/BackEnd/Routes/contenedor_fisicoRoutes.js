import express from "express";
import {
  mostrarContenedorFisicosController,
  insertarContenedorFisicoController,
  editarContenedorFisicoController,
  eliminarContenedorFisicoController,
} from "../controllers/contenedor_fisicoController.js";

const router = express.Router();

router.get("/", mostrarContenedorFisicosController);
router.post("/", insertarContenedorFisicoController);
router.put("/:id", editarContenedorFisicoController);
router.delete("/:id", eliminarContenedorFisicoController);

export default router;