import express from "express";
import {
  mostrarIngresosController,
  insertarIngresoController,
  editarIngresoController,
  eliminarIngresoController,
  buscarIngresosController,
  detalleIngresoController,
  ingresosPendientesController,
  ingresosCanceladosController,
  compararPreciosController,
  ultimosPreciosController,
  evolucionPrecioController,
  rankingProveedoresController,
  productosPrecioBajoController,
  promedioCantidadController,
  comprasRepetidasController,
  analisisProductoController
} from "../controllers/ingresoController.js";

const router = express.Router();

// Rutas existentes
router.get("/", mostrarIngresosController);
router.post("/", insertarIngresoController);
router.put("/:id", editarIngresoController);
router.delete("/:id", eliminarIngresoController);

// 📘 Nuevas rutas de análisis y detalle
router.get("/buscar", buscarIngresosController); // ?estado=...&proveedor=...
router.get("/pendientes", ingresosPendientesController);
router.get("/cancelados", ingresosCanceladosController);
router.get("/:id/detalle", detalleIngresoController);

// 🔍 Comparaciones y análisis por producto
router.get("/producto/:id/comparar-precios", compararPreciosController);
router.get("/producto/:id/evolucion-precio", evolucionPrecioController);
router.get("/producto/:id/analisis", analisisProductoController);

// 📈 Estadísticas globales
router.get("/ultimos-precios", ultimosPreciosController);
router.get("/ranking-proveedores", rankingProveedoresController);
router.get("/productos-precio-bajo", productosPrecioBajoController);
router.get("/promedio-cantidad", promedioCantidadController);
router.get("/compras-repetidas", comprasRepetidasController);

export default router;
