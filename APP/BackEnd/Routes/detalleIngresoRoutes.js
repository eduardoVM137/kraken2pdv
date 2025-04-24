import express from 'express';
import {  mostrarDetalleIngresosController, eliminarDetalleIngresoController, editarDetalleIngresoController, insertarDetalleIngresoController } from '../controllers/detalleIngresoController.js';
import validarDetalleIngreso from '../middlewares/validarDetalleIngreso.js';

const router = express.Router();

// Ruta para agregar un detalle de ingreso
router.post('/insertar', validarDetalleIngreso, insertarDetalleIngresoController);

// Ruta para listar todos los detalles de ingreso
router.get('/', mostrarDetalleIngresosController);

// Ruta para editar un detalle de ingreso
router.put('editar/:id', validarDetalleIngreso, editarDetalleIngresoController);

// Ruta para eliminar un detalle de ingreso
router.delete('/eliminar/:4', eliminarDetalleIngresoController);

export default router;

 