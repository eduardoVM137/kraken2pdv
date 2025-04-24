
import express from 'express';
import {
  insertarEmpleadoController,
  editarEmpleadoController,
  eliminarEmpleadoController,
  mostrarEmpleadosController,
} from '../controllers/empleadoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, insertarEmpleadoController);
router.put('/:id', authMiddleware, editarEmpleadoController);
router.delete('/:id', authMiddleware, eliminarEmpleadoController);
router.get('/', authMiddleware, mostrarEmpleadosController);

export default router;
