import express from "express";
import {
  mostrarAtributosController,
  insertarAtributoController,
  editarAtributoController,
  eliminarAtributoController,
} from "../controllers/atributoController.js";

const router = express.Router();

router.get("/", mostrarAtributosController);
router.post("/", insertarAtributoController);
router.put("/:id", editarAtributoController);
router.delete("/:id", eliminarAtributoController);

export default router;