import express from "express";
import {
  mostrarInventariosController,
  insertarInventarioController,
  editarInventarioController,
  eliminarInventarioController,buscarInventarioController
} from "../controllers/inventarioController.js";

const router = express.Router();

router.get("/", mostrarInventariosController);
router.get("/:id", buscarInventarioController);
router.post("/", insertarInventarioController);
router.put("/:id", editarInventarioController);
router.delete("/:id", eliminarInventarioController);

export default router;