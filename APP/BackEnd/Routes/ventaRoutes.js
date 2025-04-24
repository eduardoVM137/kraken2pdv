
import express from 'express';
import {
  insertarVentaController,
  editarVentaController,
  eliminarVentaController,
  mostrarVentasController,
} from '../controllers/ventaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, insertarVentaController);
router.put('/:id', authMiddleware, editarVentaController);
router.delete('/:id', authMiddleware, eliminarVentaController);
router.get('/', authMiddleware, mostrarVentasController);

export default router;
