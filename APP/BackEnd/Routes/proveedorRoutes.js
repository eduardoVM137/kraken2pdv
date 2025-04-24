import express from "express";
import {
  mostrarProveedorsController,
  insertarProveedorController,
  editarProveedorController,
  eliminarProveedorController,
} from "../controllers/proveedorController.js";

const router = express.Router();

router.get("/", mostrarProveedorsController);
router.post("/", insertarProveedorController);
router.put("/:id", editarProveedorController);
router.delete("/:id", eliminarProveedorController);

export default router;