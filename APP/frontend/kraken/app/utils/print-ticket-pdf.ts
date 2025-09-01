// utils/print-ticket-pdf.ts
import jsPDF from "jspdf";

/** Limpia y compacta el arreglo de líneas:
 *  - normaliza CRLF
 *  - elimina espacios a la derecha
 *  - colapsa líneas vacías consecutivas
 *  - quita blanco al inicio/fin
 */
export function compactPOSLines(lines: string[]): string[] {
  const norm = (lines ?? []).map((l) => (l ?? "").replace(/\r/g, "").replace(/\s+$/g, ""));
  const out: string[] = [];
  for (const l of norm) {
    const empty = l.trim() === "";
    const prevEmpty = out.length && out[out.length - 1].trim() === "";
    if (empty && prevEmpty) continue;
    out.push(empty ? "" : l);
  }
  while (out[0]?.trim() === "") out.shift();
  while (out[out.length - 1]?.trim() === "") out.pop();
  return out;
}

export type ExportOpts = {
  /** Ancho del rollo en mm (58 u 80) */
  widthMm?: number;
  /** Márgenes y tipografía */
  left?: number;
  right?: number;
  top?: number;
  fontSize?: number;
  lineH?: number;
  emptyH?: number;
  /** Separación entre left y right cuando hay TAB (en mm) */
  tabGapMm?: number;
  /** Nombre de archivo */
  fileName?: string;
  /** Abrir en pestaña (blob URL) en lugar de descargar */
  openInsteadOfDownload?: boolean;
};

/** Firma unificada:
 *  - exportTicketPDF(lines, "ticket.pdf")
 *  - exportTicketPDF(lines, { widthMm: 58, fileName: "ticket.pdf", ... })
 */
export function exportTicketPDF(
  lines: string[],
  arg?: string | ExportOpts,
  maybeOpts?: ExportOpts
) {
  const opts: ExportOpts =
    typeof arg === "string" ? { ...(maybeOpts ?? {}), fileName: arg } : (arg ?? {});

  const width = opts.widthMm ?? 58;
  const left = opts.left ?? 4;
  const right = opts.right ?? 4;
  const top = opts.top ?? 8;
  const fs = opts.fontSize ?? 9;
  const lineH = opts.lineH ?? 4;
  const emptyH = opts.emptyH ?? 2.5;
  const tabGap = opts.tabGapMm ?? 1.5;
  const fileName = opts.fileName ?? "ticket.pdf";
  const openInstead = !!opts.openInsteadOfDownload;

  const clean = compactPOSLines(lines);

  // ====== PRE-CÁLCULO DE ALTURA (emula el render real) ======
  const tmp = new jsPDF({ unit: "mm", format: [width, 1000] });
  tmp.setFont("courier", "normal");
  tmp.setFontSize(fs);
  const maxW = Math.max(10, width - left - right);

  let height = top;
  for (const raw of clean) {
    const line = (raw ?? "").replace(/\r/g, "");
    if (line.trim() === "") {
      height += emptyH;
      continue;
    }

    if (line.includes("\t")) {
      const [leftText = "", rightText = ""] = line.split("\t");
      const wLeft = tmp.getTextWidth(leftText);
      const wRight = tmp.getTextWidth(rightText);

      // ¿cabe en una sola línea (left + gap + right)?
      if (wLeft + tabGap + wRight <= maxW) {
        height += lineH;
      } else {
        // Envuelve left y luego una línea para right
        const wrappedLeft = tmp.splitTextToSize(leftText, maxW);
        height += wrappedLeft.length * lineH; // left envuelto
        height += lineH; // línea para right alineado a la derecha
      }
    } else {
      const wrapped = tmp.splitTextToSize(line, maxW);
      height += wrapped.length * lineH;
    }
  }
  height += 6; // margen inferior
  height = Math.max(80, height);

  // ====== DOCUMENTO FINAL ======
  const doc = new jsPDF({ unit: "mm", format: [width, height], putOnlyUsedFonts: true });
  doc.setFont("courier", "normal");
  doc.setFontSize(fs);

  let y = top;
  for (const raw of clean) {
    const line = (raw ?? "").replace(/\r/g, "");
    if (line.trim() === "") {
      y += emptyH;
      continue;
    }

    // --- Línea con TAB: "<left>\t<right>" ---
    if (line.includes("\t")) {
      const [leftText = "", rightText = ""] = line.split("\t");
      const wLeft = doc.getTextWidth(leftText);
      const wRight = doc.getTextWidth(rightText);

      if (wLeft + tabGap + wRight <= maxW) {
        // Misma línea: left normal y right alineado al borde derecho
        doc.text(leftText, left, y, { baseline: "top" });
        doc.text(rightText, left + maxW, y, {
          baseline: "top",
          align: "right" as any,
        });
        y += lineH;
      } else {
        // Dos líneas: envolver left y luego right alineado a la derecha
        const wrappedLeft = doc.splitTextToSize(leftText, maxW);
        for (const w of wrappedLeft) {
          doc.text(w, left, y, { baseline: "top" });
          y += lineH;
        }
        doc.text(rightText, left + maxW, y, {
          baseline: "top",
          align: "right" as any,
        });
        y += lineH;
      }
      continue;
    }

    // --- Línea normal (sin TAB) ---
    const wrapped = doc.splitTextToSize(line, maxW);
    for (const w of wrapped) {
      doc.text(w, left, y, { baseline: "top" });
      y += lineH;
    }
  }

  if (openInstead) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    // Si quisieras además descargar, descomenta:
    // doc.save(fileName);
  } else {
    doc.save(fileName);
  }
}

