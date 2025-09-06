import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Conversores numéricos útiles con formularios

export const toIntOrUndefined = (v: unknown): number | undefined => {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export const toIntOrNull = (v: unknown): number | null => {
  if (v === "" || v === null || v === undefined || v === 0 || v === "0") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
