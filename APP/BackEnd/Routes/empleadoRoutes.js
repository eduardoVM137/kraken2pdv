import express from "express";
import {
  mostrarEmpleadosController,
  insertarEmpleadoController,
  editarEmpleadoController,
  eliminarEmpleadoController,
} from "../controllers/empleadoController.js";

const router = express.Router();

router.get("/", mostrarEmpleadosController);
router.post("/", insertarEmpleadoController);
router.put("/:id", editarEmpleadoController);
router.delete("/:id", eliminarEmpleadoController);

export default router;