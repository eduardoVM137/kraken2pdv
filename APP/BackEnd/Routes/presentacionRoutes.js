import express from "express";
import {
  mostrarPresentacionesController,
  insertarPresentacionController,
  editarPresentacionController,
  eliminarPresentacionController,
} from "../controllers/presentacionController.js";
 
import authMiddleware from '../middlewares/authMiddleware.js';

import validateRequest from "../middlewares/validateRequest.js";
import { presentacionSchema } from "../middlewares/validarPresentacion.js";


const router = express.Router();
  

router.get("/", mostrarPresentacionesController);
router.post("/", validateRequest(presentacionSchema),insertarPresentacionController);
router.put("/:id", editarPresentacionController);
router.delete("/:id", eliminarPresentacionController);

export default router;