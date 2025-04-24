
import express from 'express';
import {
  insertarStateController,
  editarStateController,
  eliminarStateController,
  mostrarStatesController,
} from '../controllers/stateController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, insertarStateController);
router.put('/:id', authMiddleware, editarStateController);
router.delete('/:id', authMiddleware, eliminarStateController);
router.get('/', authMiddleware, mostrarStatesController);

export default router;
