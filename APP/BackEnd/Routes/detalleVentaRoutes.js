import express from 'express';
import { insertarDetalleVentaController, mostrarDetalleVentasController } from '../controllers/detalleVentaController.js';
import validarDetalleVenta from '../middlewares/validarDetalleVenta.js';

const router = express.Router();

// Ruta para agregar un detalle de venta
router.post('/detalleventas', validarDetalleVenta, insertarDetalleVentaController);

// Ruta para listar detalles de ventas
router.get('/detalleventas', mostrarDetalleVentasController);

export default router;
