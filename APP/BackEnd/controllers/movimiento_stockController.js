
import { insertarMovimientoStockServiceTx } from "../services/movimientoStockService.js";



// Insertar movimiento de stock inicial si se envía cantidad
if (resto.cantidad && resto.ubicacion_id) {
  await insertarMovimientoStockServiceTx(tx, {
    empresa_id: req.empresa_id || 1, // adaptarlo a tu sistema multiempresa
    producto_id: resto.producto_id,
    detalle_producto_id: detalleInsertado.id,
    ubicacion_id: resto.ubicacion_id,
    cantidad: resto.cantidad,
    precio_costo: resto.precio_costo || null,
    tipo_movimiento: 'ajuste_inicial',
    motivo: 'Alta inicial del detalle producto',
    usuario_id: req.usuario_id || null,
  });
}

return res.status(201).json({ message: "Detalle producto creado", data: detalleInsertado });
