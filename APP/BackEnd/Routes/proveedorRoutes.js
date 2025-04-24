
import express from 'express';
import {
  insertarProveedorController,
  editarProveedorController,
  eliminarProveedorController,
  mostrarProveedoresController,
} from '../controllers/proveedorController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', insertarProveedorController);
router.put('/:id', authMiddleware, editarProveedorController);
router.delete('/:id', authMiddleware, eliminarProveedorController);
router.get('/', mostrarProveedoresController);

export default router;
