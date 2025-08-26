// app/utils/imprimir-pos.ts
/**
 * Impresión con QZ Tray + Fallback a PDF local
 * - QZ POS reales: ESC/POS (init + corte)
 * - QZ virtuales (PDF/XPS/OneNote/Fax): TEXTO plano
 * - Virtual NO reconocida por QZ: exporta PDF local (jsPDF) y no usa QZ
 */

declare global { interface Window { qz: any } }

export interface OpcionesImpresion {
  nombreImpresora?: string;          // si no se pasa => default de Windows
  tamanoPapel: "58mm" | "80mm";
}

/* ───────────────────────────── Helpers de conexión ───────────────────────── */

async function waitQZApi(): Promise<void> {
  await new Promise<void>((resolve) => {
    const tick = () => (window.qz?.api ? resolve() : setTimeout(tick, 150));
    tick();
  });
}

async function ensureConnected(): Promise<void> {
  const qz = window.qz;
  if (!qz?.websocket) throw new Error("QZ Tray no está cargado (qz.websocket).");
  if (qz.websocket.isActive()) return;
  await qz.websocket.connect();
}

/* ───────────────────────────── Inicialización QZ ─────────────────────────── */

 export async function inicializarQZTray(): Promise<void> {
  await waitQZApi();
  const qz = window.qz;

  // ⚠️ No tocar setPromiseType en navegadores modernos (evita errores de sendData)
  // qz.api.setPromiseType((resolver: any) => new Promise(resolver));

  // (DEV) evita prompts de certificado/firma. En producción, usa certificados reales.
  qz.security.setCertificatePromise((resolve: any) => resolve(""));
  qz.security.setSignaturePromise((_toSign: any) => (resolve: any) => resolve());

  const originalDisconnect = qz.websocket.disconnect.bind(qz.websocket);
  qz.websocket.disconnect = () => {
    try { originalDisconnect(); }
    finally {
      ensureConnected().catch((e: any) => console.warn("Reconexión QZ fallida:", e));
    }
  };

  try {
    await ensureConnected();
    console.log("✅ QZ Tray conectado");
  } catch (err) {
    console.warn("⚠️ No se pudo conectar QZ en el init:", err);
  }
}


/* ────────────────────── Listado / Resolución de impresora ────────────────── */

export async function listarImpresorasDisponibles(): Promise<string[]> {
  await ensureConnected();
  const qz = window.qz;
  const printers = await qz.printers.find("*");
  const list = Array.isArray(printers) ? printers : [String(printers)];
  return Array.from(new Set(list));
}

/**
 * 1) Si se pidió por nombre y existe, esa.
 * 2) Default del SO (qz.printers.getDefault()) si existe.
 * 3) "Microsoft Print to PDF" / "Microsoft XPS Document Writer" / Fax / OneNote si existen.
 * 4) La primera de la lista.
 */
async function resolverImpresoraDeseada(nombreSolicitado?: string): Promise<string> {
  await ensureConnected();
  const qz = window.qz;
  const disponibles: string[] = Array.from(new Set(await qz.printers.find("*") || []));

  if (nombreSolicitado && disponibles.includes(nombreSolicitado)) return nombreSolicitado;

  try {
    const def = await qz.printers.getDefault();
    if (def && disponibles.includes(def)) return def;
  } catch {}

  const candidatos = [
    "Microsoft Print to PDF",
    "Microsoft XPS Document Writer",
    "Fax",
    "OneNote (Desktop)",
    "OneNote for Windows 10",
  ];
  for (const c of candidatos) {
    if (disponibles.includes(c)) return c;
  }

  if (disponibles.length > 0) return disponibles[0];

  throw new Error(
    "No se encontró ninguna impresora disponible.\n" +
    "Instala/activa una impresora del sistema (p. ej. 'Microsoft Print to PDF') y vuelve a intentar."
  );
}

/* ─────────────────────── Detección de impresora virtual ──────────────────── */

function esImpresoraVirtual(nombre: string): boolean {
  return /pdf|xps|fax|onenote/i.test(nombre);
}

/* ─────────────── Exportación directa a PDF (sin QZ, para correo) ─────────── */
/**
 * Genera un PDF local con las líneas recibidas y lo descarga.
 * Útil si QZ no reconoce la impresora virtual o quieres adjuntar el PDF.
 * Requiere: npm i jspdf
 */
export async function exportarPDFLocal(
  lineas: string[],
  nombreArchivo = `ticket-${Date.now()}.pdf`
) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" }); // usa 'a4' para facilitar impresión/adjunto
  const left = 12;
  let top = 14;

  doc.setFont("courier", "normal");
  doc.setFontSize(11);

  lineas.forEach((ln) => {
    const wrapped = doc.splitTextToSize(ln, 185); // ~ ancho útil A4
    doc.text(wrapped, left, top);
    top += wrapped.length * 6;
    if (top > 280) { doc.addPage(); top = 14; }
  });

  doc.save(nombreArchivo);
  return nombreArchivo;
}

/* ───────────────────────────────── Impresión ─────────────────────────────── */

/* ───────────────────────────────── Impresión ─────────────────────────────── */
export async function imprimirLoteTexto(
  loteTexto: string[],
  opciones: OpcionesImpresion
): Promise<void> {
  const qz = window.qz;

  // Helper para cortar por lo sano y exportar PDF local
  const fallbackPDF = async (motivo: string) => {
    console.warn("Impresión por QZ omitida →", motivo);
    await exportarPDFLocal(loteTexto); // descarga un PDF local para adjuntar
  };

  // 0) Si QZ no existe en la página, salimos a PDF local
  if (!qz || !qz.websocket) {
    await fallbackPDF("QZ no está disponible en window");
    return;
  }

  // 1) Intentar listar las impresoras que QZ reconoce
  let disponibles: string[] = [];
  try {
    await ensureConnected();
    disponibles = await listarImpresorasDisponibles();
  } catch (e) {
    // Si no podemos ni listar, nos vamos a PDF
    await fallbackPDF("No fue posible listar impresoras QZ");
    return;
  }

  // 2) Verificar si la selección del usuario es virtual y si QZ la ve
  const solicitada = (opciones.nombreImpresora || "").trim();
  const solicitadaEsVirtual = solicitada && esImpresoraVirtual(solicitada);
  const solicitadaExisteEnQZ = solicitada ? disponibles.includes(solicitada) : false;

  // 2.a) Usuario eligió virtual NO listada por QZ → PDF local
  if (solicitadaEsVirtual && !solicitadaExisteEnQZ) {
    await fallbackPDF("Impresora virtual seleccionada no está en QZ");
    return;
  }

  // 3) Resolver impresora final para QZ (si esto falla → PDF)
  let impresora = "";
  try {
    impresora = await resolverImpresoraDeseada(solicitada || undefined);
  } catch (e) {
    await fallbackPDF("No se pudo resolver impresora en QZ");
    return;
  }

  // 4) Validar que QZ tenga su conexión interna lista para enviar datos
  const canQZ =
    typeof qz.configs?.create === "function" &&
    typeof qz.print === "function" &&
    typeof qz.websocket?.isActive === "function" &&
    qz.websocket.isActive() &&
    // algunas versiones exponen connection.sendData; si no está, evitamos llamar
    (typeof qz.websocket?.connection?.sendData === "function" ||
     typeof (qz as any).print === "function"); // respaldo: si print existe, seguimos

  if (!canQZ) {
    await fallbackPDF("QZ no está listo para imprimir (connection/sendData)");
    return;
  }

  // 5) Construir payload según tipo de impresora
  const usarTextoPlano = esImpresoraVirtual(impresora);
  const ESC = "\x1B";
  const INIT_PRINTER = ESC + "@";
  const CUT_PAPER    = "\x1D\x56\x41\x10";

  const payload = usarTextoPlano
    ? [loteTexto.join("\r\n") + "\r\n\f"]          // virtual: texto plano + salto de página
    : [INIT_PRINTER, loteTexto.join("\n") + "\n", CUT_PAPER]; // POS real: ESC/POS

  const config = qz.configs.create(impresora, {
    encoding: usarTextoPlano ? "UTF-8" : "ISO-8859-1",
    size: opciones.tamanoPapel,
    scaleContent: usarTextoPlano ? true : undefined,
  });

  // 6) Enviar a QZ. Si algo explota, hacemos fallback a PDF local.
  try {
    await qz.print(config, payload);
    console.log(`🖨️ Impresión enviada a '${impresora}' (${usarTextoPlano ? "TEXTO" : "ESC/POS"})`);
  } catch (err: any) {
    await fallbackPDF("qz.print lanzó un error: " + (err?.message || err));
  }
}