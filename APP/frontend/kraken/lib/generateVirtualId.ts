// frontend/lib/generateVirtualId.ts
export const generateVirtualId = (prefix: string) =>
  `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
