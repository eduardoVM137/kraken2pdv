import express from "express";
import {
  mostrarClientesController,
  insertarClienteController,
  editarClienteController,
  eliminarClienteController,
} from "../controllers/clienteController.js";

const router = express.Router();

router.get("/", mostrarClientesController);
router.post("/", insertarClienteController);
router.put("/:id", editarClienteController);
router.delete("/:id", eliminarClienteController);

export default router;