// routes/productoRoutes.js

import express from 'express';
import { insertarProductoController, mostrarProductosController } from '../controllers/productosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validarProducto from '../middlewares/validarProducto.js';

const router = express.Router();

// Ruta para agregar un producto, requiere autenticación y validación de datos
router.post('/',  validarProducto, insertarProductoController);

// Ruta para listar productos activos, solo requiere autenticación
router.get('/activos',  mostrarProductosController);

export default router;





