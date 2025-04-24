import express from "express";
import {
  mostrarEmpresasController,
  insertarEmpresaController,
  editarEmpresaController,
  eliminarEmpresaController,
} from "../controllers/empresaController.js";

const router = express.Router();

router.get("/", mostrarEmpresasController);
router.post("/", insertarEmpresaController);
router.put("/:id", editarEmpresaController);
router.delete("/:id", eliminarEmpresaController);

export default router;