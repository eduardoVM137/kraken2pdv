// SSR-safe UUID + helpers para IDs virtuales del UI
// No depende de crypto.randomUUID, pero lo usa si existe.

export const uuid = (): string => {
  const g: any = globalThis as any;
  const c: Crypto | undefined = g?.crypto as any;

  // 1) Usa randomUUID si está disponible
  if (c && typeof (c as any).randomUUID === "function") {
    try {
      return (c as any).randomUUID();
    } catch {
      /* cae al fallback */
    }
  }

  // 2) Fallback con getRandomValues o Math.random
  let bytes: Uint8Array;
  if (c && typeof c.getRandomValues === "function") {
    bytes = c.getRandomValues(new Uint8Array(16));
  } else {
    bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) bytes[i] = (Math.random() * 256) | 0;
  }

  // Version 4 y variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

// ID corto a partir del UUID (útil para chips / idVirtual del UI)
export const shortId = (prefix = "", len = 8): string => {
  const base = uuid().replaceAll("-", "");
  const id = base.slice(0, Math.max(1, Math.min(len, base.length)));
  return prefix ? `${prefix}_${id}` : id;
};

// Fábrica que asegura no repetir dentro de la misma sesión (Set local)
export const makeIdFactory = (prefix = "", len = 8) => {
  const seen = new Set<string>();
  return () => {
    let id: string;
    do {
      id = shortId(prefix, len);
    } while (seen.has(id));
    seen.add(id);
    return id;
  };
};

// Helpers opinados para tu app
export const vInv = () => shortId("inv", 8);
export const vPrice = () => shortId("price", 8);
export const vPres = () => shortId("pres", 8);
