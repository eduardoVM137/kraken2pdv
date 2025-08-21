// app/utils/imprimir-pos.ts
/**
 * Utilidades de impresión con QZ Tray (ESC/POS) con fallback a la impresora
 * predeterminada de Windows cuando no se especifica ninguna.
 */

declare global {
  interface Window { qz: any }
}

export interface OpcionesImpresion {
  nombreImpresora?: string;          // opcional: si no se pasa, se usa la default de Windows
  tamanoPapel: "58mm" | "80mm";
}

/* --------------------------- helpers de conexión --------------------------- */

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

/* ---------------------------- inicialización QZ ---------------------------- */

export async function inicializarQZTray(): Promise<void> {
  await waitQZApi();
  const qz = window.qz;

  // QZ espera una función que DEVUELVA una Promise
  qz.api.setPromiseType((resolve: any, reject: any) => new Promise(resolve, reject));

  // (DEV) evita prompts de certificado/firma
  qz.security.setCertificatePromise((resolve: any) => resolve(""));
  qz.security.setSignaturePromise((_toSign: any) => (resolve: any) => resolve());

  // reconexión simple
  const originalDisconnect = qz.websocket.disconnect.bind(qz.websocket);
  qz.websocket.disconnect = () => {
    try { originalDisconnect(); } finally {
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

/* ------------------------- listado / selección seguro ---------------------- */

/** Devuelve la lista de impresoras disponibles (únicas). */
export async function listarImpresorasDisponibles(): Promise<string[]> {
  await ensureConnected();
  const qz = window.qz;
  const printers = await qz.printers.find("*"); // '*' devuelve todas
  const list = Array.isArray(printers) ? printers : [String(printers)];
  // dedup
  return Array.from(new Set(list));
}

/**
 * Resuelve el nombre de impresora a usar:
 * 1) Si se pide una y existe, esa.
 * 2) default del SO (qz.printers.getDefault()) si existe.
 * 3) "Microsoft Print to PDF" o "Microsoft XPS Document Writer" si existen.
 * 4) La primera de la lista.
 * Si no hay ninguna, lanza error.
 */
async function resolverImpresoraDeseada(nombreSolicitado?: string): Promise<string> {
  await ensureConnected();
  const qz = window.qz;
  const disponibles: string[] = Array.from(new Set(await qz.printers.find("*") || []));

  // 1) nombre solicitado
  if (nombreSolicitado && disponibles.includes(nombreSolicitado)) return nombreSolicitado;

  // 2) default del SO
  try {
    const def = await qz.printers.getDefault();
    if (def && disponibles.includes(def)) return def;
  } catch { /* ignore */ }

  // 3) defaults típicos de Windows
  const candidatos = ["Microsoft Print to PDF", "Microsoft XPS Document Writer"];
  for (const c of candidatos) {
    if (disponibles.includes(c)) return c;
  }

  // 4) primera disponible
  if (disponibles.length > 0) return disponibles[0];

  // sin impresoras
  throw new Error(
    "No se encontró ninguna impresora disponible.\n" +
    "Instala/activa una impresora del sistema (por ejemplo 'Microsoft Print to PDF') y vuelve a intentar."
  );
}

/* -------------------------------- impresión -------------------------------- */

export async function imprimirLoteTexto(
  loteTexto: string[],
  opciones: OpcionesImpresion
): Promise<void> {
  await ensureConnected();
  const qz = window.qz;

  // Resuelve la impresora final con fallback a default Windows
  const impresora = await resolverImpresoraDeseada(opciones.nombreImpresora);

  // comandos ESC/POS mínimos
  const ESC = "\x1B";
  const INIT_PRINTER = ESC + "@";
  const CUT_PAPER = "\x1D\x56\x41\x10";

  const payload = [INIT_PRINTER, loteTexto.join("\n") + "\n", CUT_PAPER];

  const config = qz.configs.create(impresora, {
    encoding: "ISO-8859-1",
    size: opciones.tamanoPapel,
  });

  await qz.print(config, payload);
  console.log(`🖨️ Impresión enviada a '${impresora}'`);
}
