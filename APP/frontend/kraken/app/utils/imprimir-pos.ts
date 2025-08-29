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
  await qz.websocket.connect();
  console.debug("[QZ] websocket conectado");
}

/* ─────────────────────── Carga de cert y firma (DEV local) ───────────────── */

let certCache: string | null = null;
let keyCache: CryptoKey | null = null;
let printersCache: string[] | null = null;

async function loadText(url: string) {
  console.debug("[QZ] cargando archivo:", url);
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`[QZ] Error al leer ${url}`);
  const txt = await r.text();
  console.debug("[QZ] archivo leído con éxito:", url, "len=", txt.length);
  return txt;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----(BEGIN|END)[\s\S]+?-----/g, "").replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new ArrayBuffer(bin.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
  return buf;
}

/** Hash que usaremos para RSASSA-PKCS1-v1_5. Probar primero "SHA-1". */
type HashAlg = "SHA-1" | "SHA-256";
const SIGN_HASH: HashAlg = "SHA-1";

async function importPrivateKeyPKCS8(pem: string, hash: HashAlg): Promise<CryptoKey> {
  console.debug("[QZ] importando llave privada PKCS#8 con", hash);
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(pem),
    { name: "RSASSA-PKCS1-v1_5", hash },
    false,
    ["sign"]
  );
  console.debug("[QZ] llave privada importada (hash=", hash, ")");
  return key;
}

async function signRsaPkcs1B64(key: CryptoKey, data: string): Promise<string> {
  console.debug("[QZ] firmando toSign:", data.slice(0, 70), "…");
  const bytes = new TextEncoder().encode(data);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, bytes);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  console.debug("[QZ] firma base64 len=", b64.length, "preview=", b64.slice(0, 32), "…");
  return b64;
}

/* ───────────────────────────── Inicialización QZ ─────────────────────────── */

export async function inicializarQZTray(): Promise<void> {
  await waitQZApi();
  const qz = window.qz;

  // 1) Cargar certificado (desde /public/qz)
  if (!certCache) {
    const certUrl = `/qz/digital-certificate.txt?ts=${Date.now()}`;
    const cert = await loadText(certUrl);
    console.debug("[QZ] CERT header:", cert.split("\n")[0]);
    if (!/-----BEGIN CERTIFICATE-----/.test(cert)) {
      console.error("[QZ] CERT inválido: falta BEGIN CERTIFICATE");
      throw new Error("Certificado QZ inválido");
    }
    certCache = cert;
  }

  // 2) Cargar private key PKCS#8 (del MISMO keypair)
  if (!keyCache) {
    const keyUrl = `/qz/private-key.pem?ts=${Date.now()}`;
    const keyPem = await loadText(keyUrl);
    const first = keyPem.split("\n")[0].trim();
    console.debug("[QZ] KEY header:", first);
    if (!/-----BEGIN PRIVATE KEY-----/.test(first)) {
      console.error("[QZ] La llave NO es PKCS#8 (debe decir BEGIN PRIVATE KEY).");
      throw new Error("La llave privada debe ser PKCS#8");
    }
    keyCache = await importPrivateKeyPKCS8(keyPem, SIGN_HASH);
  }

  // 3) Entregar cert y firma a QZ
  qz.security.setCertificatePromise((resolve: any) => {
    console.debug("[QZ] entregando CERT a QZ (len=%d)", certCache!.length);
    resolve(certCache!);
  });

  qz.security.setSignaturePromise((toSign: string) => async (resolve: any, reject: any) => {
    try {
      const sigB64 = await signRsaPkcs1B64(keyCache!, toSign);
      resolve(sigB64);
    } catch (e) {
      console.error("[QZ] error al firmar:", e);
      reject(e);
    }
  });

  // 4) Conectar websocket
  await ensureConnected();
  console.debug("[QZ] Init completo (hash usado =", SIGN_HASH, ")");
}

/* ────────────────────── Listado / Resolución de impresora ────────────────── */

export async function listarImpresorasDisponibles(): Promise<string[]> {
  await ensureConnected();
  const qz = window.qz;
  try {
    if (printersCache) {
      console.debug("[QZ] usando cache impresoras:", printersCache);
      return printersCache;
    }
    const printers = await qz.printers.find(); // sin argumento = todas
    const list = Array.isArray(printers) ? printers : [String(printers)];
    printersCache = Array.from(new Set(list)).filter(Boolean);
    console.debug("[QZ] impresoras detectadas:", printersCache);
    return printersCache;
  } catch (e: any) {
    console.warn("[QZ] no fue posible listar impresoras:", e?.message || e);
    return [];
  }
}

async function resolverImpresoraDeseada(nombreSolicitado?: string): Promise<string> {
  await ensureConnected();
  const qz = window.qz;

  const pedido = (nombreSolicitado || "").trim();
  const nombre = /default\s*de\s*windows/i.test(pedido) ? "" : pedido;

  let disponibles: string[] = [];
  try {
    disponibles = Array.from(new Set(await qz.printers.find() || [])).filter(Boolean);
  } catch {
    disponibles = [];
  }

  console.debug("[QZ] resolviendo impresora. Pedido:", nombre, "Disponibles:", disponibles);

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
