// routes/categoriaRoutes.js

import express from "express";
import {
  insertarCategoriaController,
  mostrarCategoriasController,
  editarCategoriaController,
  eliminarCategoriaController,
} from "../controllers/categoriaController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import { categoriaSchema } from "../middlewares/validarCategoria.js";

const router = express.Router();

// Crear categoría (requiere token y validación de datos)
router.post("/", authMiddleware, validateRequest(categoriaSchema), insertarCategoriaController);

// Obtener todas las categorías activas
router.get("/activos", mostrarCategoriasController);

// Actualizar categoría (requiere token y validación de datos)
router.put("/:id", authMiddleware, validateRequest(categoriaSchema), editarCategoriaController);

// Eliminar categoría (requiere token)
router.delete("/:id", authMiddleware, eliminarCategoriaController);

export default router;
