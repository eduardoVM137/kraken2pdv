import express from "express";
import {
  mostrarContenedorFigurasController,
  insertarContenedorFiguraController,
  editarContenedorFiguraController,
  eliminarContenedorFiguraController,
} from "../controllers/contenedor_figuraController.js";

const router = express.Router();

router.get("/", mostrarContenedorFigurasController);
router.post("/", insertarContenedorFiguraController);
router.put("/:id", editarContenedorFiguraController);
router.delete("/:id", eliminarContenedorFiguraController);

export default router;