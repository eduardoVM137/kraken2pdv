// app/dashboard/compras/components/price-popover/utils.ts
export function classNames(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}
