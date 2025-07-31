// utils/date.ts
export function parseDMY(s: string): Date | null {
  const parts = s.split("/");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map((x) => parseInt(x, 10));
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}
