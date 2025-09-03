'use client';
// app/utils/imprimir-pos.ts
/**
 * Impresión con QZ Tray + Fallback a PDF local
 * - QZ POS reales: ESC/POS (init + corte)
 * - QZ virtuales (PDF/XPS/OneNote/Fax): TEXTO plano
 * - Virtual NO reconocida por QZ: exporta PDF local (jsPDF) y no usa QZ
 *
 * Requisitos (DEV local):
 *   /public/qz/digital-certificate.txt  ← certificado PÚBLICO del keypair
 *   /public/qz/private-key.pem          ← llave PRIVADA (PKCS#8: "BEGIN PRIVATE KEY")
 * Asegúrate de instalar el MISMO certificado en QZ (Site Manager → Browse…) y reiniciar QZ Tray.
 */

declare global { interface Window { qz: any } }

export interface OpcionesImpresion {
  nombreImpresora?: string;
  tamanoPapel: "58mm" | "80mm";
}

/* ───────────────────────────── Helpers de conexión ───────────────────────── */

async function waitQZApi(): Promise<void> {
  await new Promise<void>((resolve) => {
    const tick = () => (window.qz?.api ? resolve() : setTimeout(tick, 150));
    tick();
  });
  console.debug("[QZ] API detectada en window");
}

async function ensureConnected(): Promise<void> {
  const qz = window.qz;
  if (!qz?.websocket) throw new Error("[QZ] websocket no está cargado.");
  if (qz.websocket.isActive()) {
    console.debug("[QZ] websocket ya activo");
    return;
  }
  console.debug("[QZ] conectando websocket…");
  try {
    await qz.websocket.connect();
    console.debug("[QZ] websocket conectado");
  } catch {
    // No hacemos throw en cascada desde aquí; que el caller haga fallback a PDF.
    throw new Error("[QZ] no fue posible conectar el websocket");
  }
}

/* ─────────────────────── Carga de cert y firma (DEV local) ───────────────── */

let certCache: string | null = null;
let keyCache: CryptoKey | null = null;
let printersCache: string[] | null = null;

async function loadText(url: string) {
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error();
    return await r.text();
  } catch {
    // Silencio: devolvemos cadena vacía para no generar warnings.
    return "";
  }
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----(BEGIN|END)[\s\S]+?-----/g, "").replace(/\s+/g, "");
  const bin = b64 ? atob(b64) : "";
  const buf = new ArrayBuffer(bin.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
  return buf;
}

/** Hash que usaremos para RSASSA-PKCS1-v1_5. Probar primero "SHA-1". */
type HashAlg = "SHA-1" | "SHA-256";
const SIGN_HASH: HashAlg = "SHA-1";

async function importPrivateKeyPKCS8(pem: string, hash: HashAlg): Promise<CryptoKey | null> {
  try {
    const buf = pemToArrayBuffer(pem);
    if (!buf.byteLength) return null;
    const key = await crypto.subtle.importKey(
      "pkcs8",
      buf,
      { name: "RSASSA-PKCS1-v1_5", hash },
      false,
      ["sign"]
    );
    return key;
  } catch {
    return null; // Silencio si la llave no es válida o no existe
  }
}

async function signRsaPkcs1B64(key: CryptoKey, data: string): Promise<string> {
  const bytes = new TextEncoder().encode(data);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, bytes);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return b64;
}

/* ───────────────────────────── Inicialización QZ ─────────────────────────── */

export async function inicializarQZTray(): Promise<void> {
  await waitQZApi();
  const qz = window.qz;

  // 1) Cargar certificado (desde /public/qz)
  if (!certCache) {
    const certUrl = `/qz/digital-certificate.txt?ts=${Date.now()}`;
    certCache = await loadText(certUrl); // puede quedar ""
  }

  // 2) Cargar private key PKCS#8 (del MISMO keypair)
  if (!keyCache) {
    const keyUrl = `/qz/private-key.pem?ts=${Date.now()}`;
    const keyPem = await loadText(keyUrl);
    keyCache = await importPrivateKeyPKCS8(keyPem, SIGN_HASH); // puede quedar null
  }

  // 3) Entregar cert y firma a QZ —> SIEMPRE resolve, NUNCA reject (evita "Invalid signature")
  qz.security.setCertificatePromise((resolve: any) => {
    resolve(certCache ?? "");
  });

  qz.security.setSignaturePromise((toSign: string) => async (resolve: any /*, reject: any */) => {
    try {
      if (!keyCache) {
        resolve(""); // sin llave: firma vacía para que QZ no avise
        return;
      }
      const sigB64 = await signRsaPkcs1B64(keyCache, toSign);
      resolve(sigB64 || "");
    } catch {
      resolve(""); // jamás reject → evita warnings/errores de firma
    }
  });

  // 4) Conectar websocket (si falla, que el caller haga fallback)
  await ensureConnected();
  console.debug("[QZ] Init completo (hash usado =", SIGN_HASH, ")");
}

/* ────────────────────── Listado / Resolución de impresora ────────────────── */

export async function listarImpresorasDisponibles(): Promise<string[]> {
  try {
    await ensureConnected();
  } catch {
    return [];
  }
  const qz = window.qz;
  try {
    if (printersCache) return printersCache;
    const printers = await qz.printers.find(); // sin argumento = todas
    const list = Array.isArray(printers) ? printers : [String(printers)];
    printersCache = Array.from(new Set(list)).filter(Boolean);
    return printersCache;
  } catch {
    return [];
  }
}

async function resolverImpresoraDeseada(nombreSolicitado?: string): Promise<string> {
  await ensureConnected().catch(() => { throw new Error("QZ no conectado"); });
  const qz = window.qz;

  const pedido = (nombreSolicitado || "").trim();
  const nombre = /default\s*de\s*windows/i.test(pedido) ? "" : pedido;

  let disponibles: string[] = [];
  try {
    disponibles = Array.from(new Set(await qz.printers.find() || [])).filter(Boolean);
  } catch {
    disponibles = [];
  }

  if (nombre) {
    const exact = disponibles.find(p => p === nombre);
    if (exact) return exact;
    const parcial = disponibles.find(p => p.toLowerCase().includes(nombre.toLowerCase()));
    if (parcial) return parcial;
  }

  try {
    const def = await qz.printers.getDefault();
    if (def && (!nombre || !disponibles.length || disponibles.includes(def))) return def;
  } catch { /* ignore */ }

  const candidatos = [
    "POS-58","Microsoft Print to PDF","Microsoft XPS Document Writer","Fax",
    "OneNote (Desktop)","OneNote for Windows 10",
  ];
  for (const c of candidatos) {
    const hit = disponibles.find(p => p.toLowerCase().includes(c.toLowerCase()));
    if (hit) return hit;
  }

  if (disponibles.length > 0) return disponibles[0];
  throw new Error("[QZ] no se encontraron impresoras.");
}

/* ─────────────────────── Detección de impresora virtual ──────────────────── */

function esImpresoraVirtual(nombre: string): boolean {
  return /pdf|xps|fax|onenote/i.test(nombre);
}

/* ─────────────── Exportación directa a PDF (sin QZ, para correo) ─────────── */

export async function exportarPDFLocal(
  lineas: string[],
  nombreArchivo = `ticket-${Date.now()}.pdf`
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const left = 12; let top = 14;
  doc.setFont("courier", "normal"); doc.setFontSize(11);
  lineas.forEach((ln) => {
    const wrapped = doc.splitTextToSize(ln, 185);
    doc.text(wrapped, left, top);
    top += wrapped.length * 6;
    if (top > 280) { doc.addPage(); top = 14; }
  });
  doc.save(nombreArchivo);
  console.debug("[QZ] PDF exportado:", nombreArchivo);
  return nombreArchivo;
}

/* ───────────────────────────────── Impresión ─────────────────────────────── */

export async function imprimirLoteTexto(
  loteTexto: string[],
  opciones: OpcionesImpresion
): Promise<void> {
  const qz = window.qz;

  const fallbackPDF = async (motivo: string) => {
    console.warn("[QZ] fallback a PDF →", motivo);
    await exportarPDFLocal(loteTexto);
  };

  if (!qz || !qz.websocket) {
    await fallbackPDF("QZ no está disponible en window");
    return;
  }

  let disponibles: string[] = [];
  try {
    await ensureConnected();
    disponibles = await listarImpresorasDisponibles();
  } catch {
    await fallbackPDF("No fue posible listar impresoras QZ");
    return;
  }

  const solicitada = (opciones.nombreImpresora || "").trim();
  const solicitadaEsVirtual = solicitada && esImpresoraVirtual(solicitada);
  const solicitadaExisteEnQZ = solicitada ? disponibles.includes(solicitada) : false;

  if (solicitadaEsVirtual && !solicitadaExisteEnQZ) {
    await fallbackPDF("Impresora virtual seleccionada no está en QZ");
    return;
  }

  let impresora = "";
  try {
    impresora = await resolverImpresoraDeseada(solicitada || undefined);
    console.debug("[QZ] impresora final elegida:", impresora);
  } catch {
    await fallbackPDF("No se pudo resolver impresora en QZ");
    return;
  }

  const canQZ =
    typeof qz.configs?.create === "function" &&
    typeof qz.print === "function" &&
    typeof qz.websocket?.isActive === "function" &&
    qz.websocket.isActive();

  if (!canQZ) {
    await fallbackPDF("QZ no está listo para imprimir");
    return;
  }

  const usarTextoPlano = esImpresoraVirtual(impresora);
  console.debug("[QZ] tipo de impresión:", usarTextoPlano ? "TEXTO plano" : "ESC/POS");

  const ESC = "\x1B";
  const INIT_PRINTER = ESC + "@";
  const CUT_PAPER    = "\x1D\x56\x41\x10";

  const payload = usarTextoPlano
    ? [loteTexto.join("\r\n") + "\r\n\f"]                         // virtual: texto + salto de página
    : [INIT_PRINTER, loteTexto.join("\n") + "\n", CUT_PAPER];     // POS real: ESC/POS

  const config = qz.configs.create(impresora, {
    encoding: usarTextoPlano ? "UTF-8" : "ISO-8859-1",
    size: opciones.tamanoPapel,
    scaleContent: usarTextoPlano ? true : undefined,
  });

  try {
    console.debug("[QZ] enviando a qz.print, payload:", payload);
    await qz.print(config, payload);
    console.log(`🖨️ [QZ] impresión enviada a '${impresora}' (${usarTextoPlano ? "TEXTO" : "ESC/POS"})`);
  } catch (err: any) {
    console.error("[QZ] error en qz.print:", err);
    await fallbackPDF("qz.print lanzó un error: " + (err?.message || err));
  }
}
