export function generarLineasPOS(
  venta: { nombre: string; cantidad: number; precio: number }[],
  pagos: { metodo: string; monto: number }[],
  total: number,
  totalPagado: number,
  isCotizacion = false,
  folio?: number,
  cliente?: string,
  vendedor?: string
): string[] {
  const lineas: string[] = [];

  const repeat = (char = "-", len = 32) => char.repeat(len);
  const center = (text: string, width = 32) => {
    const space = Math.floor((width - text.length) / 2);
    return " ".repeat(Math.max(space, 0)) + text;
  };
  const wrap = (text: string, max = 28) => {
    const partes = [];
    for (let i = 0; i < text.length; i += max) {
      partes.push(text.slice(i, i + max));
    }
    return partes;
  };

  // Cabecera
  lineas.push(center("\n"));
  lineas.push(center("Ferre Hogar Olivos 1"));
  lineas.push(center("Bulevard Rea #10302"));
  lineas.push(center(isCotizacion ? "COTIZACION" : "VENTA"));
if (!isCotizacion && folio != null) {
  lineas.push(`Folio: #${folio}`);
  lineas.push(`Vendedor: ${vendedor}`);
  lineas.push(`Cliente: ${cliente}`);
}
 

  lineas.push(center(new Date().toLocaleString()));
  lineas.push(repeat());

  // Productos
  venta.forEach((item) => {
    const nombreWrapped = wrap(item.nombre);
    nombreWrapped.forEach((linea) => lineas.push(linea));
    const totalItem = (item.precio * item.cantidad).toFixed(2);
    const detalle = `${item.cantidad} x $${item.precio.toFixed(2)}`;
    const padding = 32 - detalle.length - totalItem.length;
    lineas.push(detalle + " ".repeat(Math.max(padding, 1)) + totalItem);
  });

  lineas.push(repeat());

  // Totales
  lineas.push(center("==== TOTALES ===="));
  const padTotal = (label: string, value: string) =>
    label + " ".repeat(32 - label.length - value.length) + value;

  lineas.push(padTotal("TOTAL", `$${total.toFixed(2)}`));
  if (!isCotizacion) {
    lineas.push(padTotal("PAGO", `$${totalPagado.toFixed(2)}`));
    
    lineas.push(padTotal("CAMBIO", `$${(totalPagado - total).toFixed(2)}`));
  }

  // Formas de pago
  if (!isCotizacion && pagos.length) {
    lineas.push(repeat());
    lineas.push("FORMAS DE PAGO:");
    pagos.forEach((p) =>
      lineas.push(`- ${p.metodo}: $${p.monto.toFixed(2)}`)
    );
  }

  lineas.push(repeat());

  // Pie
  lineas.push(center(isCotizacion ? "Esta es una COTIZACION" : "Gracias por su compra"));
  lineas.push("\n\n");

  return lineas;
}
