// routes/productoRoutes.js

import express from 'express';
import { insertarCategoriaController, mostrarCategoriasController } from '../controllers/categoriaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validarCategoria from '../middlewares/validarCategoria.js';

const router = express.Router();

// Ruta para agregar un producto, requiere autenticación y validación de datos
router.post('/',  validarCategoria, insertarCategoriaController);

// Ruta para listar productos activos, solo requiere autenticación
router.get('/activos',  mostrarCategoriasController);

export default router;