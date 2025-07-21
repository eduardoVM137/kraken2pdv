import express from "express";
import {
  mostrarVentasController,
  insertarVentaController,
  editarVentaController,
  eliminarVentaController,mostrarProductosVentaController,buscarProductosPorAliasController,buscarVentasController,estadoVentasController,buscarVentaController
} from "../controllers/ventaController.js";

const router = express.Router();

router.get("/productos", mostrarProductosVentaController);
router.get("/productos-alias", buscarProductosPorAliasController);

router.get("/", mostrarVentasController);
router.get("/buscar/:id", buscarVentasController);

router.get("/:id", buscarVentaController);
router.patch("/estado", estadoVentasController);
router.post("/", insertarVentaController);
router.put("/:id", editarVentaController);
router.delete("/:id", eliminarVentaController);

export default router;