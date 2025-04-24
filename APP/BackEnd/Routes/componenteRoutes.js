import express from "express";
import {
  mostrarComponentesController,
  insertarComponenteController,
  editarComponenteController,
  eliminarComponenteController,
} from "../controllers/componenteController.js";

const router = express.Router();

router.get("/", mostrarComponentesController);
router.post("/", insertarComponenteController);
router.put("/:id", editarComponenteController);
router.delete("/:id", eliminarComponenteController);

export default router;