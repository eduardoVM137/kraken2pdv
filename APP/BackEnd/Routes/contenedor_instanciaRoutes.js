import express from "express";
import {
  mostrarContenedorInstanciasController,
  insertarContenedorInstanciaController,
  editarContenedorInstanciaController,
  eliminarContenedorInstanciaController,
} from "../controllers/contenedor_instanciaController.js";

const router = express.Router();

router.get("/", mostrarContenedorInstanciasController);
router.post("/", insertarContenedorInstanciaController);
router.put("/:id", editarContenedorInstanciaController);
router.delete("/:id", eliminarContenedorInstanciaController);

export default router;