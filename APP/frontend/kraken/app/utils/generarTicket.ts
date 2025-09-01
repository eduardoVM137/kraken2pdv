// utils/generarTicket.ts

/** Ancho total del ticket (58mm ≈ 32 chars en Courier 9pt) */
const WIDTH = 32;
/** Ancho para envolver el nombre del producto (puedes dejar 32 si prefieres) */
const NAME_WRAP = 28;

/* ---------- Helpers de formato ---------- */

const repeat = (char = "-", len = WIDTH) => char.repeat(len);

const center = (text: string, width = WIDTH) => {
  const t = (text ?? "").trim();
  const space = Math.floor((width - t.length) / 2);
  return " ".repeat(Math.max(space, 0)) + t;
};

/** Envuelve por palabras; si hay un token muy largo, lo corta en bloques de `max`. */
const wrapWords = (text: string, max = NAME_WRAP): string[] => {
  const clean = (text ?? "")
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return [];

  const out: string[] = [];
  for (const token of clean.split(" ")) {
    if (token.length > max) {
      // token sin espacios muy largo -> partir en bloques
      for (let i = 0; i < token.length; i += max) {
        out.push(token.slice(i, i + max));
      }
      continue;
    }
    if (out.length === 0) out.push(token);
    else {
      const last = out[out.length - 1];
      if ((last + " " + token).length <= max) out[out.length - 1] = last + " " + token;
      else out.push(token);
    }
  }
  return out;
};

/** Línea con left + spaces + right, alineando `right` a la derecha del ticket. */
const padRightLine = (left: string, right: string, width = WIDTH) => {
  const L = (left ?? "").trim();
  const R = (right ?? "").trim();
  const spaces = Math.max(1, width - L.length - R.length);
  return L + " ".repeat(spaces) + R;
};

/**
 * Si cabe en una sola línea, devuelve [ "detalle .... total" ].
 * Si NO cabe, devuelve dos líneas: [ "detalle", " ......... total" ] con el total alineado a la derecha.
 */
const detalleConSubtotal = (detalle: string, totalItem: string, width = WIDTH): string[] => {
  if ((detalle?.length ?? 0) + 1 + (totalItem?.length ?? 0) <= width) {
    return [padRightLine(detalle, totalItem, width)];
  }
  // muy largo -> dos líneas (total alineado a la derecha)
  return [detalle, totalItem.padStart(width)];
};

/* ---------- API ---------- */

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

  /* ===== Cabecera ===== */
  lineas.push(center("Ferre Hogar Olivos 1"));
  lineas.push(center("Bulevard Rea #10302"));
  lineas.push(center(isCotizacion ? "COTIZACION" : "VENTA"));

  if (!isCotizacion && folio != null) {
    lineas.push(`Folio: #${folio}`);
    if (vendedor) lineas.push(`Vendedor: ${vendedor}`);
    if (cliente)  lineas.push(`Cliente: ${cliente}`);
  }

  lineas.push(center(new Date().toLocaleString()));
  lineas.push(repeat());

  /* ===== Productos ===== */
  for (const item of venta) {
    // 1) Nombre envuelto (sin meter líneas vacías extra)
    wrapWords(item.nombre, NAME_WRAP).forEach((l) => lineas.push(l));

    // 2) Detalle + subtotal en la MISMA línea (o dos líneas si no cabe)
const totalItem = (item.precio * item.cantidad).toFixed(2);
const detalle   = `${item.cantidad} x $${item.precio.toFixed(2)}`;
// MISMA LÍNEA (o dos si no cabe; el renderer lo decide):
lineas.push(`${detalle}\t${totalItem}`);
  }

  lineas.push(repeat());

  /* ===== Totales ===== */
  lineas.push(center("==== TOTALES ===="));

  const padLine = (label: string, value: string, width = WIDTH) =>
    padRightLine(label, value, width);

  lineas.push(padLine("TOTAL", `$${total.toFixed(2)}`));

  if (!isCotizacion) {
    lineas.push(padLine("PAGO", `$${totalPagado.toFixed(2)}`));
    lineas.push(padLine("CAMBIO", `$${(totalPagado - total).toFixed(2)}`));
  }

  /* ===== Formas de pago ===== */
  if (!isCotizacion && pagos.length) {
    lineas.push(repeat());
    lineas.push("FORMAS DE PAGO:");
    for (const p of pagos) {
      lineas.push(`- ${p.metodo}: $${p.monto.toFixed(2)}`);
    }
  }

  lineas.push(repeat());
  lineas.push(center(isCotizacion ? "Esta es una COTIZACION" : "Gracias por su compra"));

  return lineas;
}
