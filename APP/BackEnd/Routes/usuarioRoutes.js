// src/routes/usuarioRoutes.js
import express from "express";
import {
  mostrarUsuariosController,
  insertarUsuarioController,
  editarUsuarioController,
  eliminarUsuarioController,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/", mostrarUsuariosController);
router.post("/", insertarUsuarioController);
router.put("/:id", editarUsuarioController);
router.delete("/:id", eliminarUsuarioController);

export default router;
