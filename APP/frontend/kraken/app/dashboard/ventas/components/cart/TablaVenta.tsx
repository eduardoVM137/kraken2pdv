// components/TablaVenta.tsx
"use client";

import { useMemo, useState, ChangeEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

/* ----------------------- Tipos ----------------------- */
interface ProductoVenta {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  descuento?: number;
  descuentoRaw?: string;
  iva?: number;
  presentacion_id?: number | null;
}
interface TablaVentaProps {
  productos: ProductoVenta[];
  setProductos: (items: ProductoVenta[]) => void;
  agregarVentaPendiente: (items: ProductoVenta[]) => void;
}

/* ----------------------- Helpers ----------------------- */
const DEFAULT_WIDTHS: number[] = [60, 8, 8, 8, 6, 8, 2]; // [Desc, Cant, Precio, Desc., IVA, Subt., Acc.]
const MIN_PCT_ALL: number[]   = [12, 3, 4, 3, 3, 4, 2]; // mínimos MUY reducidos
const MAX_PCT = 96;

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

const visibleIdx = (details: boolean) => (details ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 5, 6]);

/** Redistribuye un delta en % desde la col "k" hacia/desde el resto, respetando mínimos */
function redistribute(arr: number[], k: number, delta: number, mins: number[]) {
  if (Math.abs(delta) < 1e-6) return arr;
  const out = [...arr];
  const others = out.map((_, i) => i).filter((i) => i !== k);

  if (delta > 0) {
    // expandir k => quitar a otras según su "slack"
    let need = delta;
    let pool = others
      .map((i) => ({ i, slack: out[i] - mins[i] }))
      .filter((o) => o.slack > 0);
    let totalSlack = pool.reduce((s, o) => s + o.slack, 0);
    if (totalSlack <= 0) return out;

    for (const o of pool) {
      const take = (o.slack / totalSlack) * need;
      const real = Math.min(o.slack, take);
      out[o.i] -= real;
      need -= real;
    }
    out[k] += delta - need;
  } else {
    // encoger k => repartimos ese % equitativamente
    let give = -delta;
    const share = give / others.length;
    for (const i of others) out[i] += share;
    out[k] -= give;
  }

  const diff = 100 - sum(out);
  if (Math.abs(diff) > 0.01) out[k] = clamp(out[k] + diff, mins[k], MAX_PCT);
  return out;
}

/* ----------------------- UI ----------------------- */
export default function TablaVenta({
  productos,
  setProductos,
  agregarVentaPendiente,
}: TablaVentaProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Anchos en % (SIEMPRE suman 100)
  const [widthsPct, setWidthsPct] = useState<number[]>(DEFAULT_WIDTHS);

  // Menú contextual para headers
  const [ctx, setCtx] = useState<{ open: boolean; x: number; y: number; localIdx: number } | null>(
    null
  );
  const ctxRef = useRef<HTMLDivElement | null>(null);

  // Cierra el menú contextual al hacer click fuera
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ctxRef.current) return;
      if (ctxRef.current.contains(e.target as Node)) return;
      setCtx(null);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Activos según columnas visibles
  const activePct = useMemo(
    () =>
      showDetails ? widthsPct : [widthsPct[0], widthsPct[1], widthsPct[2], widthsPct[5], widthsPct[6]],
    [widthsPct, showDetails]
  );

  // Resizer: arrastre con redistribución global
  const startResize = (localIdx: number, e: React.MouseEvent) => {
    e.preventDefault();

    const handleEl = e.currentTarget as HTMLElement;
    const tableEl = handleEl.closest("table") as HTMLTableElement | null;
    const tableWidth = tableEl?.getBoundingClientRect().width || 1;

    const startX = e.clientX;
    const start = [...widthsPct];

    const vis = visibleIdx(showDetails); // e.g., [0,1,2,5,6]
    const wVisible = vis.map((i) => start[i]);
    const minsVisible = vis.map((i) => MIN_PCT_ALL[i]);

    document.body.style.userSelect = "none";
    (document.body.style as any).touchAction = "none";

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const deltaPct = (dx / tableWidth) * 100;

      const k = localIdx;
      const targetK = clamp(wVisible[k] + deltaPct, minsVisible[k], MAX_PCT);
      const apply = targetK - wVisible[k];
      const nextVisible = redistribute(wVisible, k, apply, minsVisible);

      const next = [...start];
      visibleIdx(showDetails).forEach((idx, local) => {
        next[idx] = nextVisible[local];
      });
      setWidthsPct(next);
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
      (document.body.style as any).touchAction = "";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // Acciones de menú
  const resetWidths = () => setWidthsPct([...DEFAULT_WIDTHS]);
  const autoProportional = () => {
    // Normaliza a 100 manteniendo proporción actual (por si hubo redondeos)
    const total = sum(widthsPct);
    if (Math.abs(total - 100) < 0.01) return; // ya está ok
    const next = widthsPct.map((w) => (w / total) * 100);
    setWidthsPct(next);
  };

  // Totales
  const totalGeneral = productos.reduce((s, it) => s + it.precio * it.cantidad, 0);
  const totalItems = productos.reduce((s, it) => s + it.cantidad, 0);
  const totalUnicos = productos.length;

  const handleDescuentoChange = (raw: string, index: number) => {
    const copia = [...productos];
    let newDesc = 0;
    if (raw.trim().endsWith("%")) {
      const pct = parseFloat(raw.slice(0, -1)) || 0;
      newDesc = (copia[index].precio * copia[index].cantidad * pct) / 100;
    } else newDesc = parseFloat(raw) || 0;
    copia[index].descuento = Math.max(0, newDesc);
    copia[index].descuentoRaw = raw;
    setProductos(copia);
  };

  // Helpers header index según columnas visibles
  const idxSubtotal = showDetails ? 5 : 3;
  const idxAcciones = showDetails ? 6 : 4;
// Draft de cantidades por fila (string para permitir teclear libremente)
const [qtyDraft, setQtyDraft] = useState<string[]>([]);

// Inicializa/realinea cuando cambie el número de filas
// Mantén el draft sincronizado con la cantidad real cada vez que cambia la venta.
// Esto cubre el caso de "agregar con escáner" (mismo renglón, cantidad incrementa).
useEffect(() => {
  setQtyDraft(productos.map((p) => String(p.cantidad ?? 1)));
}, [productos]);

// Parser permisivo: ".156", "00.5", "0.5" → número
function parseQty(raw: string): number | null {
  const s = raw.replace(",", ".").trim();
  if (s === "" || s === ".") return null;
  // Acepta "123", "123.", ".5", "0.5", "00.50"
  if (!/^(\d+(\.\d*)?|\.\d+)$/.test(s)) return null;
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : null;
}

// Confirma la edición (blur o Enter)
function commitQty(index: number, raw: string) {
  const v = parseQty(raw);
  const min = 0.01;           // ajusta si quieres permitir 0
  if (v === null) {
    // Revertir a valor actual si entrada inválida
    setQtyDraft(d => {
      const nd = [...d];
      nd[index] = String(productos[index].cantidad ?? 1);
      return nd;
    });
    return;
  }
  const val = Math.max(min, v);
  const copia = [...productos];
  copia[index].cantidad = val;
  setProductos(copia);
  setQtyDraft(d => {
    const nd = [...d];
    nd[index] = String(val);
    return nd;
  });
}

  return (
    <div className="w-full">
      <div className="mb-2 flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setShowDetails((s) => !s)}>
          {showDetails ? "Ocultar detalles" : "Mostrar detalles"}
        </Button>
      </div>

      {/* Desktop/Tablet: ocupa 100% (sin scroll horizontal por defecto) */}
      <ScrollArea className="hidden sm:block w-full rounded-md border">
        <Table className="table-auto w-full">
          <colgroup>
            {activePct.map((p, i) => (
              <col key={i} style={{ width: `${p}%` }} />
            ))}
          </colgroup>

          <TableHeader className="bg-muted/80">
            <TableRow className="hover:bg-muted/80">
              <HeaderCell
                title="Descripción"
                onResize={(e) => startResize(0, e)}
                onContext={(evt) => setCtx({ open: true, x: evt.clientX, y: evt.clientY, localIdx: 0 })}
              />
              <HeaderCell
                title="Cant"
                align="center"
                onResize={(e) => startResize(1, e)}
                onContext={(evt) => setCtx({ open: true, x: evt.clientX, y: evt.clientY, localIdx: 1 })}
              />
              <HeaderCell
                title="Precio"
                align="right"
                onResize={(e) => startResize(2, e)}
                onContext={(evt) => setCtx({ open: true, x: evt.clientX, y: evt.clientY, localIdx: 2 })}
              />
              {showDetails && (
                <HeaderCell
                  title="Descuento"
                  align="right"
                  onResize={(e) => startResize(3, e)}
                  onContext={(evt) => setCtx({ open: true, x: evt.clientX, y: evt.clientY, localIdx: 3 })}
                />
              )}
              {showDetails && (
                <HeaderCell
                  title="IVA %"
                  align="right"
                  onResize={(e) => startResize(4, e)}
                  onContext={(evt) => setCtx({ open: true, x: evt.clientX, y: evt.clientY, localIdx: 4 })}
                />
              )}
              <HeaderCell
                title="Subtotal"
                align="right"
                onResize={(e) => startResize(idxSubtotal, e)}
                onContext={(evt) =>
                  setCtx({ open: true, x: evt.clientX, y: evt.clientY, localIdx: idxSubtotal === 3 ? 3 : 5 })
                }
              />
              <HeaderCell
                title="Acciones"
                align="right"
                onResize={(e) => startResize(idxAcciones, e)}
                onContext={(evt) =>
                  setCtx({ open: true, x: evt.clientX, y: evt.clientY, localIdx: idxAcciones === 4 ? 4 : 6 })
                }
              />
            </TableRow>
          </TableHeader>

          <TableBody>
            {productos.map((item, index) => {
              const desc = item.descuento ?? 0;
              const base = Math.max(0, item.precio * item.cantidad - desc);
              const ivaPct = item.iva ?? 0;
              const tax = (base * ivaPct) / 100;
              const total = base + tax;

              return (
                <TableRow
                  key={`${item.id}-${item.presentacion_id ?? "none"}-${index}`}
                  className={`${index % 2 === 0 ? "bg-muted/40" : "bg-muted/70"} hover:bg-accent transition-colors`}
                >
                  <TableCell className="px-2 py-2 whitespace-normal break-words">
                    {item.nombre?.trim() || "—"}
                  </TableCell>

         <TableCell className="px-1 py-2">
  <div className="flex items-center justify-center gap-1">
    <Button
      size="sm"
      variant="outline"
      className="h-7 w-7 p-0"
      onClick={() => {
        const min = 0.01;
        const copia = [...productos];
        const next = Math.max(min, (copia[index].cantidad ?? 1) - 1);
        copia[index].cantidad = next;
        setProductos(copia);
        setQtyDraft(d => {
          const nd = [...d]; nd[index] = String(next); return nd;
        });
      }}
    >
      −
    </Button>

    <input
      type="text"
      inputMode="decimal"
      className="w-16 min-w-[64px] text-center"
      value={qtyDraft[index] ?? String(item.cantidad)}
      onFocus={(e) => e.currentTarget.select()}          // selecciona todo al enfocar
      onChange={(e) => {
        const val = e.target.value;
        setQtyDraft(d => {
          const nd = [...d]; nd[index] = val; return nd;
        });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") commitQty(index, qtyDraft[index] ?? String(item.cantidad));
      }}
      onBlur={() => commitQty(index, qtyDraft[index] ?? String(item.cantidad))}
      aria-label="Cantidad"
    />

    <Button
      size="sm"
      variant="outline"
      className="h-7 w-7 p-0"
      onClick={() => {
        const copia = [...productos];
        const next = (copia[index].cantidad ?? 0) + 1;
        copia[index].cantidad = next;
        setProductos(copia);
        setQtyDraft(d => {
          const nd = [...d]; nd[index] = String(next); return nd;
        });
      }}
    >
      +
    </Button>
  </div>
</TableCell>

                  <TableCell className="px-2 py-2 text-right">${item.precio.toFixed(2)}</TableCell>

                  {showDetails && (
                    <TableCell className="px-2 py-2 text-right">
                      <input
                        type="text"
                        className="w-20 text-right"
                        placeholder="0 o 10%"
                        value={item.descuentoRaw ?? desc.toFixed(2)}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleDescuentoChange(e.target.value, index)
                        }
                      />
                    </TableCell>
                  )}

                  {showDetails && (
                    <TableCell className="px-2 py-2 text-right">
                      <input
                        type="number"
                        className="w-16 text-right"
                        min={0}
                        max={100}
                        value={ivaPct}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const val = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                          const copia = [...productos];
                          copia[index].iva = val;
                          setProductos(copia);
                        }}
                      />
                    </TableCell>
                  )}

                  <TableCell className="px-2 py-2 text-right">${total.toFixed(2)}</TableCell>

                  <TableCell className="px-2 py-2 text-right">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setProductos(productos.filter((_, i) => i !== index))}
                      title="Quitar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Móvil: tarjetas */}
      <div className="sm:hidden space-y-2">
        {productos.map((item, index) => {
          const desc = item.descuento ?? 0;
          const base = Math.max(0, item.precio * item.cantidad - desc);
          const ivaPct = item.iva ?? 0;
          const tax = (base * ivaPct) / 100;
          const total = base + tax;

          return (
            <div
              key={`${item.id}-${item.presentacion_id ?? "none"}-${index}`}
              className={`rounded-md border p-3 ${index % 2 ? "bg-muted/70" : "bg-muted/40"}`}
            >
              <div className="text-sm font-medium whitespace-normal break-words">
                {item.nombre?.trim() || "—"}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
           <div className="flex items-center gap-1">
  <Button
    size="sm"
    variant="outline"
    className="h-7 w-7 p-0"
    onClick={() => {
      const min = 0.01;
      const copia = [...productos];
      const next = Math.max(min, (copia[index].cantidad ?? 1) - 1);
      copia[index].cantidad = next;
      setProductos(copia);
      setQtyDraft(d => { const nd = [...d]; nd[index] = String(next); return nd; });
    }}
  >
    −
  </Button>

  <input
    type="text"
    inputMode="decimal"
    className="w-16 min-w-[64px] text-center"
    value={qtyDraft[index] ?? String(item.cantidad)}
    onFocus={(e) => e.currentTarget.select()}
    onChange={(e) => {
      const val = e.target.value;
      setQtyDraft(d => { const nd = [...d]; nd[index] = val; return nd; });
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter") commitQty(index, qtyDraft[index] ?? String(item.cantidad));
    }}
    onBlur={() => commitQty(index, qtyDraft[index] ?? String(item.cantidad))}
    aria-label="Cantidad"
  />

  <Button
    size="sm"
    variant="outline"
    className="h-7 w-7 p-0"
    onClick={() => {
      const copia = [...productos];
      const next = (copia[index].cantidad ?? 0) + 1;
      copia[index].cantidad = next;
      setProductos(copia);
      setQtyDraft(d => { const nd = [...d]; nd[index] = String(next); return nd; });
    }}
  >
    +
  </Button>
</div>


                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Precio</div>
                  <div className="font-semibold">${item.precio.toFixed(2)}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Subtotal</div>
                  <div className="font-semibold">${total.toFixed(2)}</div>
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setProductos(productos.filter((_, i) => i !== index))}
                  title="Quitar"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totales y acciones */}
      <div className="mt-4 flex items-center justify-between text-sm font-semibold">
        <span>Total parcial:</span>
        <span>
          ${totalGeneral.toFixed(2)} — {totalItems} artículo{totalItems !== 1 ? "s" : ""},{" "}
          {totalUnicos} tipo{totalUnicos !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => agregarVentaPendiente(productos)}
            disabled={productos.length === 0}
          >
            Guardar como pendiente
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (productos.length > 0 && window.confirm("¿Deseas limpiar el carrito?"))
                setProductos([]);
            }}
            disabled={productos.length === 0}
          >
            Limpiar carrito
          </Button>
        </div>
      </div>

      {/* -------- Menú contextual (clic derecho) -------- */}
      {ctx?.open && (
        <div
          ref={ctxRef}
          onDoubleClick={() => {
            resetWidths(); // doble click dentro del menú = RESET rápido
            setCtx(null);
          }}
          className="fixed z-50 min-w-[180px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          style={{ left: ctx.x + 2, top: ctx.y + 2 }}
        >
          <div className="px-2 py-1.5 text-xs text-muted-foreground">Columnas</div>
          <button
            className="w-full rounded-sm px-2 py-1.5 text-left hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              autoProportional();
              setCtx(null);
            }}
          >
            Auto (proporcional)
          </button>
          <button
            className="w-full rounded-sm px-2 py-1.5 text-left hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              resetWidths();
              setCtx(null);
            }}
          >
            Reset (predeterminado)
          </button>
          <div className="px-2 pb-1 pt-1 text-[11px] text-muted-foreground">
            Doble-click aquí para <b>Reset</b>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------- HeaderCell -------------- */
function HeaderCell({
  title,
  align = "left",
  onResize,
  onContext,
}: {
  title: string;
  align?: "left" | "center" | "right";
  onResize: (e: React.MouseEvent) => void;
  onContext: (e: React.MouseEvent) => void;
}) {
  const alignCls =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  return (
    <TableHead
      className={`relative ${alignCls} font-semibold select-none`}
      onContextMenu={(e) => {
        e.preventDefault();
        onContext(e);
      }}
      onDoubleClick={(e) => {
        // doble click en cualquier header también abre el menú por conveniencia
        onContext(e);
      }}
    >
      {title}
      {/* Manija amplia para arrastrar */}
      <span
        onMouseDown={onResize}
        title="Arrastra para ajustar ancho"
        className="absolute right-0 top-0 h-full w-3 cursor-col-resize z-10"
        style={{ touchAction: "none" }}
      >
        <span className="mx-auto block h-full w-[2px] bg-border hover:bg-foreground/60" />
      </span>
    </TableHead>
  );
}
