
import express from 'express';
import {
  insertarIngresoController,
  editarIngresoController,
  eliminarIngresoController,
  mostrarIngresosController,
} from '../controllers/ingresoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, insertarIngresoController);
router.put('/:id', authMiddleware, editarIngresoController);
router.delete('/:id', authMiddleware, eliminarIngresoController);
router.get('/', authMiddleware, mostrarIngresosController);

export default router;
