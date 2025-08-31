// ✅ lib/api.ts - API Wrapper reutilizable y trazable para entornos SaaS
// Usa contexto opcional para registrar qué función de negocio realizó cada llamada HTTP
// Es escalable, claro y compatible con SSR/Next.js frontend

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.69:3001";

/**
 * Maneja la respuesta general de cualquier petición
 * - Valida errores HTTP
 * - Desestructura `data` para facilitar el consumo
 * - Registra errores con contexto para trazabilidad
 */
async function handleResponse(res: Response, context: string) {
  console.log("ENV API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  const data = await res.json();
  if (!res.ok) {
    console.error(`❌ [${context}]`, data?.message || res.statusText);
    throw new Error(data?.message || `HTTP ${res.status}`);
  }
  // Desenvuelve { data: ... }
  return data?.data;
}
// 🔽 NUEVO: apiGet con opciones
type GetOptions = {
  signal?: AbortSignal;  // para cancelación
  soft404?: boolean;     // si 404 => devolver [] en lugar de error
};
/**
 * Realiza un GET a la API base
 * @param path - ruta relativa a BASE_URL
 * @param context - contexto del módulo (ej. "getProductos")
 * @returns T - respuesta del backend, campo `data`
 */
export async function apiGet<T = any>(
  path: string,
  context = `GET ${path}`,
  opts: GetOptions = {}
): Promise<T> {
  console.log("ENV API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { signal: opts.signal });

  if (opts.soft404 && res.status === 404) {
    // 404 tratado como “sin resultados”
    return [] as unknown as T;
  }
  return await handleResponse(res, context);
}

/**
 * Realiza un POST con JSON al backend
 * @param path - ruta relativa
 * @param body - payload JSON
 * @param context - contexto legible
 * @returns T - respuesta útil
 */
export async function apiPost<T = any>(path: string, body: any, context = `POST ${path}`): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await handleResponse(res, context);
}

/**
 * PUT para editar recursos completos
 * @param path - ruta API
 * @param body - datos actualizados
 * @param context - ej. "editarVenta"
 */
export async function apiPut<T = any>(path: string, body: any, context = `PUT ${path}`): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await handleResponse(res, context);
}

/**
 * PATCH para actualizaciones parciales
 * @param path - endpoint
 * @param body - campos a modificar
 * @param context - ej. "actualizarEstadosVentas"
 */
export async function apiPatch<T = any>(path: string, body: any, context = `PATCH ${path}`): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await handleResponse(res, context);
}

/**
 * DELETE con cuerpo JSON (si aplica)
 * @param path - ruta objetivo
 * @param body - parámetros a eliminar
 * @param context - propósito legible para logging
 * @example apiDelete("/api/producto/1", {}, "eliminarProducto")
 */
export async function apiDelete<T = any>(path: string, body: any, context = `DELETE ${path}`): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await handleResponse(res, context);
}
