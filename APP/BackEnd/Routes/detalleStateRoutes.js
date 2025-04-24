
import express from 'express';
import {
  insertarDetalleStateController,
  editarDetalleStateController,
  eliminarDetalleStateController,
  mostrarDetalleStatesController,
} from '../controllers/detalleStateController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, insertarDetalleStateController);
router.put('/:id', authMiddleware, editarDetalleStateController);
router.delete('/:id', authMiddleware, eliminarDetalleStateController);
router.get('/', authMiddleware, mostrarDetalleStatesController);

export default router;



 