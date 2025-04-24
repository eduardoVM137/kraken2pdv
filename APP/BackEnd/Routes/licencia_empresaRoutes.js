import express from "express";
import {
  mostrarLicenciaEmpresasController,
  insertarLicenciaEmpresaController,
  editarLicenciaEmpresaController,
  eliminarLicenciaEmpresaController,
} from "../controllers/licencia_empresaController.js";

const router = express.Router();

router.get("/", mostrarLicenciaEmpresasController);
router.post("/", insertarLicenciaEmpresaController);
router.put("/:id", editarLicenciaEmpresaController);
router.delete("/:id", eliminarLicenciaEmpresaController);

export default router;