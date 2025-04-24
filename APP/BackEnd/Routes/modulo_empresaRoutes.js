import express from "express";
import {
  mostrarModuloEmpresasController,
  insertarModuloEmpresaController,
  editarModuloEmpresaController,
  eliminarModuloEmpresaController,
} from "../controllers/modulo_empresaController.js";

const router = express.Router();

router.get("/", mostrarModuloEmpresasController);
router.post("/", insertarModuloEmpresaController);
router.put("/:id", editarModuloEmpresaController);
router.delete("/:id", eliminarModuloEmpresaController);

export default router;