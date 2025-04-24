import express from "express";
import {
  mostrarPresentacionesController,
  insertarPresentacionController,
  editarPresentacionController,
  eliminarPresentacionController,
} from "../controllers/presentacionController.js";

const router = express.Router();

router.get("/", mostrarPresentacionesController);
router.post("/", insertarPresentacionController);
router.put("/:id", editarPresentacionController);
router.delete("/:id", eliminarPresentacionController);

export default router;