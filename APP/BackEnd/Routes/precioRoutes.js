import express from "express";
import {
  mostrarPreciosController,
  insertarPrecioController,
  editarPrecioController,
  eliminarPrecioController,
} from "../controllers/precioController.js";

const router = express.Router();

router.get("/", mostrarPreciosController);
router.post("/", insertarPrecioController);
router.put("/:id", editarPrecioController);
router.delete("/:id", eliminarPrecioController);

export default router;