import jsPDF from "jspdf";

interface VentaItem {
  nombre: string;
  cantidad: number;
  precio: number;         // renombrado desde precio_unitario
}

interface PagoItem {
  metodo: string;
  monto: number;
}

export function generarTicketPDF(
  venta: VentaItem[],
  pagos: PagoItem[],
  total: number,
  totalPagado: number
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [58, 200] });
  const wrapText = (text: string, max = 32) =>
    text.length > max ? text.slice(0, max - 3) + "..." : text;
  let y = 10;

  doc.setFont("Courier", "normal");
  doc.setFontSize(8);

  const linea = () => {
    doc.text("-".repeat(32), 2, y);
    y += 4;
  };

  // Cabecera
  doc.text("TIENDA KRAKEN", 12, y); y += 5;
  doc.text("VENTA",         20, y); y += 5;
  doc.text(new Date().toLocaleString(), 2, y); y += 5;
  linea();

  // Detalle de productos
  venta.forEach(item => {
    const nombre   = wrapText(item.nombre);
    const subtotal = item.precio * item.cantidad;

    doc.text(nombre, 2, y);
    y += 4;

    // Cantidad x Precio unitario
    doc.text(`${item.cantidad} x $${item.precio.toFixed(2)}`, 2, y);

    // Subtotal alineado a la derecha
    doc.text(`$${subtotal.toFixed(2)}`, 52, y, { align: "right" });
    y += 5;
  });

  // Totales
  linea();
  doc.text(`TOTAL:`,   2,  y);
  doc.text(`$${total.toFixed(2)}`, 52, y, { align: "right" });
  y += 4;

  doc.text(`PAGADO:`,  2,  y);
  doc.text(`$${totalPagado.toFixed(2)}`, 52, y, { align: "right" });
  y += 4;

  doc.text(`RESTANTE:`, 2,  y);
  doc.text(`$${(total - totalPagado).toFixed(2)}`, 52, y, { align: "right" });
  y += 4;

  // Pagos realizados
  linea();
  doc.text("PAGO:", 2, y);
  y += 4;
  pagos.forEach(p => {
    doc.text(`- ${p.metodo}: $${p.monto.toFixed(2)}`, 2, y);
    y += 4;
  });

  // Pie
  linea();
  doc.text("Gracias por su compra", 6, y);
  y += 6;

  doc.save("ticket_venta.pdf");
}
