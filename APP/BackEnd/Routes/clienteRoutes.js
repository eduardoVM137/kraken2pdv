import express from 'express';
import {
  insertarClienteController,
  editarClienteController,
  eliminarClienteController,
  mostrarClientesController,
} from '../controllers/clienteController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, insertarClienteController);
router.put('/:id', authMiddleware, editarClienteController);
router.delete('/:id', authMiddleware, eliminarClienteController);
router.get('/', authMiddleware, mostrarClientesController);

export default router;
