import { MovimientoStock } from '../models/movimiento_stock.js';

export const insertarMovimientoStockServiceTx = async (tx, data) => {
  const [insertado] = await tx.insert(MovimientoStock).values(data).returning();
  return insertado;
};

