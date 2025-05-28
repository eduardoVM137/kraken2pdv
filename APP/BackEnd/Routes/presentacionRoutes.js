import express from "express";
import {
  mostrarPresentacionesController,
  insertarPresentacionController,
  editarPresentacionController,
  eliminarPresentacionController,buscarPresentacionPorIdContoller,
  buscarPresentacionesPorDetalleProductoController,
} from "../controllers/presentacionController.js";
 
import authMiddleware from '../middlewares/authMiddleware.js';

import validateRequest from "../middlewares/validateRequest.js";
import { presentacionSchemaObligatorio } from "../middlewares/validarPresentacion.js";


const router = express.Router();
  

router.get("/", mostrarPresentacionesController); 
router.post("/", validateRequest(presentacionSchemaObligatorio),insertarPresentacionController);
router.put("/:id", editarPresentacionController);
router.delete("/:id", eliminarPresentacionController);
router.get("/:id", buscarPresentacionPorIdContoller);
router.get("/detalle/:detalle_producto_id", buscarPresentacionesPorDetalleProductoController); // 👈 nuevo

export default router;