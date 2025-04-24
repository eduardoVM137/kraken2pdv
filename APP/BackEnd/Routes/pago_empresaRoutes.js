import express from "express";
import {
  mostrarPagoEmpresasController,
  insertarPagoEmpresaController,
  editarPagoEmpresaController,
  eliminarPagoEmpresaController,
} from "../controllers/pago_empresaController.js";

const router = express.Router();

router.get("/", mostrarPagoEmpresasController);
router.post("/", insertarPagoEmpresaController);
router.put("/:id", editarPagoEmpresaController);
router.delete("/:id", eliminarPagoEmpresaController);

export default router;