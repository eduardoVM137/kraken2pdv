/**
 * Módulo de utilidades para impresión con QZ Tray
 *
 * Aquí centralizamos la lógica de:
 *  - Inicialización y reconexión automática al daemon de QZ Tray
 *  - Listado de impresoras disponibles
 *  - Impresión de lotes de texto ESC/POS en un solo envío (buffered)
 */

declare global {
  interface Window { qz: any }
}

/**
 * Opciones de impresión para QZ Tray.
 * @property nombreImpresora - Nombre exacto de la impresora configurada en QZ Tray.
 * @property tamanoPapel - Tamaño de papel ("58mm" o "80mm").
 */
export interface OpcionesImpresion {
  nombreImpresora: string;
  tamanoPapel: "58mm" | "80mm";
}

/**
 * Inicializa la API de QZ Tray y mantiene la conexión viva.
 * Reintenta conexión cada 3 segundos si falla.
 */
export async function inicializarQZTray(): Promise<void> {
  const qz = window.qz;

  // Esperar hasta que qz.api exista
  await new Promise<void>((resolve) => {
    const intento = () => {
      if (qz?.api) resolve();
      else setTimeout(intento, 500);
    };
    intento();
  });

  // Usar promesas nativas
  qz.api.setPromiseType(window.Promise);

  // Función que intenta conectar y reintenta si falla
  const conectar = async () => {
    try {
      await qz.websocket.connect();
      console.log("✅ Conectado a QZ Tray");
    } catch (err) {
      console.warn("⚠️ QZ Tray conexión fallida, reintentando en 3s", err);
      setTimeout(conectar, 3000);
    }
  };

  // Override de disconnect para reconectar automáticamente
  const desconectarOriginal = qz.websocket.disconnect;
  qz.websocket.disconnect = () => {
    desconectarOriginal();
    conectar();
  };

  // Lanzar la primera conexión
  await conectar();
}

/**
 * Lista todas las impresoras disponibles en QZ Tray.
 * Garantiza que el WebSocket esté conectado antes de solicitar.
 * @returns Array de nombres de impresora.
 */
export async function listarImpresorasDisponibles(): Promise<string[]> {
  const qz = window.qz;

  // Asegurar conexión
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }

  // El wildcard '*' devuelve todas las impresoras
  return await qz.printers.find("*");
}

/**
 * Imprime un lote de texto ESC/POS en un solo envío (buffered).
 * @param loteTexto Array de líneas de texto a imprimir.
 * @param opciones Configuración de impresora y papel.
 */
export async function imprimirLoteTexto(
  loteTexto: string[],
  opciones: OpcionesImpresion
): Promise<void> {
  const qz = window.qz;

  // Inicializar comandos ESC/POS
  const ESC = "\x1B";
  const INIT_PRINTER = ESC + "@";   // Inicializar impresora
  const CUT_PAPER    = "\x1D\x56\x41\x10"; // Cortar papel completo

  // Montar payload en un único arreglo para buffering
  const payload = [
    INIT_PRINTER,
    loteTexto.join("\n") + "\n",
    CUT_PAPER
  ];

  // Asegurar que la conexión WebSocket esté activa
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }

  // Validar opción de impresora
  const impresora = opciones.nombreImpresora;
  if (!impresora) {
    throw new Error("Debe especificarse un nombre de impresora.");
  }

  // Crear configuración ESC/POS: encoding y tamaño de papel
  const config = qz.configs.create(impresora, {
    encoding: "ISO-8859-1",
    size: opciones.tamanoPapel
  });

  // Enviar el lote a la impresora
  await qz.print(config, payload);
  console.log(`🖨️ Impresión enviada a '${impresora}'`);
}
