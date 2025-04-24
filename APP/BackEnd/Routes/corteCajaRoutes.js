import express from 'express';
import {
  insertarCorteCajaController,
  editarCorteCajaController,
  eliminarCorteCajaController,
  mostrarCortesCajaController,
} from '../controllers/corteCajaController.js';
import validarCorteCaja from '../middlewares/validarCorteCaja.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, validarCorteCaja, insertarCorteCajaController);
router.put('/:id', authMiddleware, validarCorteCaja, editarCorteCajaController);
router.delete('/:id', authMiddleware, eliminarCorteCajaController);
router.get('/', authMiddleware, mostrarCortesCajaController);

export default router;
