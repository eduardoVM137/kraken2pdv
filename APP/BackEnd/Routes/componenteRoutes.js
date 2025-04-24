import express from 'express';
import {
  insertarComponenteController,
  editarComponenteController,
  eliminarComponenteController,
  mostrarComponentesController,
} from '../controllers/componenteController.js';
import validarComponente from '../middlewares/validarComponente.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, validarComponente, insertarComponenteController);
router.put('/:id', authMiddleware, validarComponente, editarComponenteController);
router.delete('/:id', authMiddleware, eliminarComponenteController);
router.get('/', authMiddleware, mostrarComponentesController);

export default router;
