import express from "express";
import {
  mostrarNegociosController,
  insertarNegocioController,
  editarNegocioController,
  eliminarNegocioController,
} from "../controllers/negocioController.js";

const router = express.Router();

router.get("/", mostrarNegociosController);
router.post("/", insertarNegocioController);
router.put("/:id", editarNegocioController);
router.delete("/:id", eliminarNegocioController);

export default router;