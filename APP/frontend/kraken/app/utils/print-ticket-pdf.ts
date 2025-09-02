// utils/print-ticket-pdf.ts
// Motor HTML (recomendado) + fallback jsPDF (opcional)
import jsPDF from "jspdf";

/** Limpia/compacta igual que antes */
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
  widthMm?: number;           // 58 u 80
  left?: number;              // jsPDF only
  right?: number;             // jsPDF only
  top?: number;               // jsPDF only
  fontSize?: number;          // jsPDF only
  lineH?: number;             // jsPDF only
  emptyH?: number;            // jsPDF only
  tabGapMm?: number;          // jsPDF only
  fileName?: string;
  openInsteadOfDownload?: boolean;
  /** Usa motor HTML con @page size (true por defecto). Si lo desactivas, usa jsPDF. */
  htmlEngine?: boolean;
  /** Ajuste de tamaño de fuente para HTML (por defecto 11px) */
  htmlFontPx?: number;
  /** Márgenes de página para HTML (por defecto 0) */
  htmlMarginMm?: number;
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

/** Exporta ticket a PDF de ancho exacto en mm.
 *  - Por defecto usa el motor HTML (@page size: 58mm/80mm).
 *  - Si htmlEngine=false, usa tu implementación jsPDF de siempre.
 */
export function exportTicketPDF(lines: string[], arg?: string | ExportOpts, maybe?: ExportOpts) {
  const opts: ExportOpts = typeof arg === "string" ? { ...(maybe ?? {}), fileName: arg } : (arg ?? {});
  const width = opts.widthMm ?? 58;
  const fileName = opts.fileName ?? "ticket.pdf";
  const openInstead = !!opts.openInsteadOfDownload;
  const useHTML = opts.htmlEngine !== false; // default: true
  const text = Array.isArray(lines) ? lines.join("\n") : String(lines ?? "");

  if (useHTML) {
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(fileName)}</title>
<style>
  @page { size: ${width}mm auto; margin: ${opts.htmlMarginMm ?? 0}mm; }
  html, body { width: ${width}mm; margin: 0; padding: 0; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body {
    font-family: "Courier New", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  }
  pre {
    font-size: ${opts.htmlFontPx ?? 11}px;
    line-height: 1.25;
    white-space: pre-wrap; /* conserva saltos, permite envolver */
    margin: 0;
    padding: 0;
  }
</style>
</head>
<body>
  <pre>${escapeHtml(text)}</pre>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    if (openInstead) {
      const w = window.open(url, "_blank", "noopener,noreferrer");
      if (!w) forceDownload(url, fileName);
      return;
    }
    forceDownload(url, fileName);
    return;
  }

  // ======= Fallback jsPDF (tu lógica original) =======
  const left = opts.left ?? 4;
  const right = opts.right ?? 4;
  const top = opts.top ?? 8;
  const fs = opts.fontSize ?? 9;
  const lineH = opts.lineH ?? 4;
  const emptyH = opts.emptyH ?? 2.5;
  const tabGap = opts.tabGapMm ?? 1.5;

  const clean = compactPOSLines(lines);
  const tmp = new jsPDF({ unit: "mm", format: [width, 1000] });
  tmp.setFont("courier", "normal");
  tmp.setFontSize(fs);
  const maxW = Math.max(10, width - left - right);

  let height = top;
  for (const raw of clean) {
    const line = (raw ?? "").replace(/\r/g, "");
    if (line.trim() === "") { height += emptyH; continue; }
    if (line.includes("\t")) {
      const [l = "", r = ""] = line.split("\t");
      const wL = tmp.getTextWidth(l), wR = tmp.getTextWidth(r);
      height += wL + tabGap + wR <= maxW ? lineH : (tmp.splitTextToSize(l, maxW).length * lineH + lineH);
    } else {
      height += (tmp.splitTextToSize(line, maxW).length * lineH);
    }
  }
  height = Math.max(80, height + 6);

  const doc = new jsPDF({ unit: "mm", format: [width, height], putOnlyUsedFonts: true });
  doc.setFont("courier", "normal");
  doc.setFontSize(fs);

  let y = top;
  for (const raw of clean) {
    const line = (raw ?? "").replace(/\r/g, "");
    if (line.trim() === "") { y += emptyH; continue; }
    if (line.includes("\t")) {
      const [l = "", r = ""] = line.split("\t");
      const wL = doc.getTextWidth(l), wR = doc.getTextWidth(r);
      if (wL + tabGap + wR <= maxW) {
        doc.text(l, left, y, { baseline: "top" });
        doc.text(r, left + maxW, y, { baseline: "top", align: "right" as any });
        y += lineH;
      } else {
        for (const w of doc.splitTextToSize(l, maxW)) { doc.text(w, left, y, { baseline: "top" }); y += lineH; }
        doc.text(r, left + maxW, y, { baseline: "top", align: "right" as any }); y += lineH;
      }
      continue;
    }
    for (const w of doc.splitTextToSize(line, maxW)) { doc.text(w, left, y, { baseline: "top" }); y += lineH; }
  }

  if (openInstead) {
    const blob = doc.output("blob"); const url = URL.createObjectURL(blob);
    window.open(url, "_blank"); return;
  } else doc.save(fileName);
}

function forceDownload(url: string, fileName: string) {
  const a = document.createElement("a");
  a.href = url; a.download = fileName; document.body.appendChild(a);
  a.click(); a.remove(); URL.revokeObjectURL(url);
}
