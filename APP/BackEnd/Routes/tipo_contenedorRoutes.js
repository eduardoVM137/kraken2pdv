import express from "express";
import {
  mostrarTipoContenedorsController,
  insertarTipoContenedorController,
  editarTipoContenedorController,
  eliminarTipoContenedorController,
} from "../controllers/tipo_contenedorController.js";

const router = express.Router();

router.get("/", mostrarTipoContenedorsController);
router.post("/", insertarTipoContenedorController);
router.put("/:id", editarTipoContenedorController);
router.delete("/:id", eliminarTipoContenedorController);

export default router;