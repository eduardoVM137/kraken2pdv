// app/utils/generarTicket.ts

import jsPDF from "jspdf";

interface VentaItem {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface PagoItem {
  metodo: string;
  monto: number;
}

/**
 * Genera un ticket de altura dinámica, con opción de marca de agua para cotización.
 *
 * @param venta         Lista de productos vendidos
 * @param pagos         Lista de pagos realizados
 * @param total         Total de la venta
 * @param totalPagado   Monto pagado (0 en cotización)
 * @param isCotizacion  Si es true, omite sección de pagos y dibuja watermark “COTIZACIÓN”
 */
export function generarTicketPDF(
  venta: VentaItem[],
  pagos: PagoItem[],
  total: number,
  totalPagado: number,
  isCotizacion = false
) {
  // —————————————————————————————————————————————————————————————
  // 1) Contar líneas que vamos a imprimir
  // —————————————————————————————————————————————————————————————
  const lineHeight = 5;     // mm por línea
  let lines = 0;

  // Cabecera: TIENDA, TIPO, FECHA, línea
  lines += 4;

  // Productos: 2 líneas por cada item (nombre + detalle)
  lines += venta.length * 2;

  // Totales: línea + TOTAL + RESTANTE (+ PAGADO si no es cotización)
  lines += 1 + 1 + 1 + (isCotizacion ? 0 : 1);

  // Pagos (solo en venta): línea + cabecera PAGO + N líneas de pago
  if (!isCotizacion) {
    lines += 1 + 1 + pagos.length;
  }

  // Pie de página: línea final + mensaje
  lines += 2;

  // Margen extra mínimo para no cortar
  const extraMargin = 4; // mm

  // Altura total en mm
  const alturaMM = lines * lineHeight + extraMargin;

  // —————————————————————————————————————————————————————————————
  // 2) Crear el PDF con altura dinámica
  // —————————————————————————————————————————————————————————————
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [58, alturaMM],
  });

  // Helper para truncar texto largo
  const wrapText = (t: string, max = 32) =>
    t.length > max ? t.slice(0, max - 3) + "..." : t;

  let y = 5;

  // —————————————————————————————————————————————————————————————
  // 3) Marca de agua (si cotización)
  // —————————————————————————————————————————————————————————————
  if (isCotizacion) {
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.setFont("Courier", "normal");
    doc.setFontSize(30);
    doc.setTextColor(200);
    doc.text("COTIZACIÓN", w / 2, h / 2, {
      align: "center",
      angle: 45,
    });
    doc.setTextColor(0);
  }

  // —————————————————————————————————————————————————————————————
  // 4) Cabecera
  // —————————————————————————————————————————————————————————————
  doc.setFont("Courier", "normal");
  doc.setFontSize(8);
  doc.text("TIENDA KRAKEN", 8, y);
  y += lineHeight;
  doc.text(isCotizacion ? "COTIZACIÓN" : "VENTA", 18, y);
  y += lineHeight;
  doc.text(new Date().toLocaleString(), 2, y);
  y += lineHeight;
  doc.text("-".repeat(32), 2, y);
  y += lineHeight;

  // —————————————————————————————————————————————————————————————
  // 5) Detalle de productos
  // —————————————————————————————————————————————————————————————
  venta.forEach((item) => {
    doc.text(wrapText(item.nombre), 2, y);
    y += lineHeight;
    doc.text(`${item.cantidad} x $${item.precio.toFixed(2)}`, 2, y);
    doc.text(
      `$${(item.precio * item.cantidad).toFixed(2)}`,
      56,
      y,
      { align: "right" }
    );
    y += lineHeight;
  });


  if (!isCotizacion) {
  // —————————————————————————————————————————————————————————————
  // 6) Totales
  // —————————————————————————————————————————————————————————————
  doc.text("-".repeat(32), 2, y);
  y += lineHeight;
  doc.text("TOTAL:", 2, y);
  doc.text(`$${total.toFixed(2)}`, 56, y, { align: "right" });
  y += lineHeight;

  doc.text("PAGO:", 2, y);
  doc.text(`$${totalPagado.toFixed(2)}`, 56, y, { align: "right" });
  y += lineHeight;

  doc.text("RESTANTE:", 2, y);
  doc.text(`$${(total - totalPagado).toFixed(2)}`, 56, y, { align: "right" });
  y += lineHeight;

  // —————————————————————————————————————————————————————————————
  // 7) Sección de pagos (solo en venta)
  // —————————————————————————————————————————————————————————————
    doc.text("-".repeat(32), 2, y);
    y += lineHeight;

    doc.text("FORMAS DE PAGO:", 2, y);
    y += lineHeight;

    pagos.forEach((p) => {
      doc.text(`- ${p.metodo}: $${p.monto.toFixed(2)}`, 2, y);
      y += lineHeight;
    });

    doc.text("-".repeat(32), 2, y);
    y += lineHeight;
  }

  // —————————————————————————————————————————————————————————————
  // 8) Pie de página
  // —————————————————————————————————————————————————————————————
  doc.text(
    isCotizacion ? "Esta es una COTIZACIÓN" : "Gracias por su compra",
    4,
    y
  );

  // —————————————————————————————————————————————————————————————
  // 9) Guardar PDF
  // —————————————————————————————————————————————————————————————
  const filename = isCotizacion
    ? `cotizacion-${Date.now()}.pdf`
    : `ticket-${Date.now()}.pdf`;
  doc.save(filename);
}
