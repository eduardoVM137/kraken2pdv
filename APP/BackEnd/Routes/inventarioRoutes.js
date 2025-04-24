
import express from 'express';
import {
  insertarInventarioController,
  editarInventarioController,
  eliminarInventarioController,
  mostrarInventariosController,
} from '../controllers/inventarioController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, insertarInventarioController);
router.put('/:id', authMiddleware, editarInventarioController);
router.delete('/:id', authMiddleware, eliminarInventarioController);
router.get('/', authMiddleware, mostrarInventariosController);

export default router;
