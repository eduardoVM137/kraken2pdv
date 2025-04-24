
import express from 'express';
import {
  insertarSubCategoriaController,
  editarSubCategoriaController,
  eliminarSubCategoriaController,
  mostrarSubCategoriasController,
} from '../controllers/subCategoriaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, insertarSubCategoriaController);
router.put('/:id', authMiddleware, editarSubCategoriaController);
router.delete('/:id', authMiddleware, eliminarSubCategoriaController);
router.get('/', authMiddleware, mostrarSubCategoriasController);

export default router;
