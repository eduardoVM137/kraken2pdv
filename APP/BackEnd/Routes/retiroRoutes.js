
import express from 'express';
import {
  insertarRetiroController,
  editarRetiroController,
  eliminarRetiroController,
  mostrarRetirosController,
} from '../controllers/retiroController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, insertarRetiroController);
router.put('/:id', authMiddleware, editarRetiroController);
router.delete('/:id', authMiddleware, eliminarRetiroController);
router.get('/', authMiddleware, mostrarRetirosController);

export default router;
