import express from "express";
import {
  mostrarProducto_visual_tagsController,
  insertarProducto_visual_tagController,
  editarProducto_visual_tagController,
  eliminarProducto_visual_tagController,
} from "../controllers/producto_visual_tagController.js";

const router = express.Router();

router.get("/", mostrarProducto_visual_tagsController);
router.post("/", insertarProducto_visual_tagController);
router.put("/:id", editarProducto_visual_tagController);
router.delete("/:id", eliminarProducto_visual_tagController);

export default router;