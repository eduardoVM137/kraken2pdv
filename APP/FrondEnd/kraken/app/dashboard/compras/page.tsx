/* ------------------------------------------------------------------
 *  pages/ComprasPage.tsx
 * -----------------------------------------------------------------*/
"use client";

import {
  useState, useMemo, useCallback, ChangeEvent, useEffect,
} from "react";

import { Input }   from "@/components/ui/input";
import { Label }   from "@/components/ui/label";
import { Button }  from "@/components/ui/button";

import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import {
  Popover, PopoverTrigger, PopoverContent,
} from "@/components/ui/popover";

import Papa from "papaparse";
import { Tag, X } from "lucide-react";


/* ─────────────────────────────────────────────────────────
 *  PricePopover  (búsqueda + acordeón)
 * ───────────────────────────────────────────────────────── */
function PricePopover({
  rowId,
  priceList,
  piezasTot,
  costoUnitNuevo,
  selecciones, setSelecciones,
  preciosEditados, setPreciosEditados,
}: {
  rowId: string;
  priceList: {
    precio_id: number; precio_venta: number; precio_costo: number; ubicacion_nombre: string;
  }[];
  piezasTot: number;
  costoUnitNuevo: number;
  selecciones: Record<string, number[]>;
  setSelecciones: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;
  preciosEditados: Record<number, number>;
  setPreciosEditados: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}) {
  const [search, setSearch] = useState("");

  const isOpen = (id: number) => (selecciones[rowId] ?? []).includes(id);

  const toggle = (id: number) =>
    setSelecciones(prev => {
      const s = new Set(prev[rowId] ?? []);
      s.has(id) ? s.delete(id) : s.add(id);
      return { ...prev, [rowId]: Array.from(s) };
    });

  /* Filtro por búsqueda */
  const visibles = useMemo(
    () =>
      priceList.filter(p =>
        p.ubicacion_nombre.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, priceList],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-36 text-xs">
          Editar precios
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="z-50 w-[480px] p-5 space-y-4"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        {/* ─── Resumen costo unitario ─── */}
        <div className="bg-muted/40 border rounded px-3 py-2 text-sm flex justify-between">
          <span className="font-medium">
            Costo unit. nuevo:&nbsp;
            <span className="text-primary font-semibold">
              S/ {costoUnitNuevo.toFixed(2)}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">{piezasTot} pz</span>
        </div>

        {/* ─── Búsqueda ─── */}
        <Input
          placeholder="Buscar ubicación…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-8"
        />

        {/* ─── Lista ubicación + acordeón ─── */}
        <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
          {visibles.map(pr => {
            const costoRef   = Math.max(costoUnitNuevo, pr.precio_costo);
            const costoCamb  = Math.abs(costoUnitNuevo - pr.precio_costo) > 1e-2;
            const opened     = isOpen(pr.precio_id);

            const pillClass =
              pr.precio_venta < costoRef - 1e-3
                ? "bg-red-50 text-red-800 border-red-300"
                : costoCamb
                ? "bg-yellow-50 text-yellow-800 border-yellow-300"
                : "bg-green-50 text-green-800 border-green-300";

            const piso       = Math.ceil(costoRef) + 1;
            const sugeridoDef= pr.precio_venta + (costoUnitNuevo - pr.precio_costo);
            const nuevo      = preciosEditados[pr.precio_id] ??
                               Math.max(+sugeridoDef.toFixed(2), piso);

            const margenPct  = ((nuevo - costoRef) / costoRef) * 100;
            const margenClr  = margenPct <= 0 ? "text-red-500" : "text-green-600";
            const costoDiffClr = Math.abs(pr.precio_costo - costoUnitNuevo) < 1e-2
              ? "text-green-600"
              : pr.precio_costo < costoUnitNuevo
              ? "text-red-500"
              : "text-yellow-500";

            return (
              <div key={pr.precio_id} className="space-y-1">
                {/* Píldora */}
                <button
                  onClick={() => toggle(pr.precio_id)}
                  className={`inline-flex items-center px-3 py-1 border rounded-full text-xs font-medium ${pillClass} ${
                    opened ? "ring-2 ring-sky-400" : ""
                  }`}
                >
                  {pr.ubicacion_nombre} — {pr.precio_venta.toFixed(0)} /{" "}
                  {costoRef.toFixed(0)}
                </button>

                {/* Panel */}
                {opened && (
                  <div className="border rounded p-3 bg-muted/10 space-y-1">
                    <p className="text-sm font-medium flex justify-between items-center">
                      {pr.ubicacion_nombre}
                      <Input
                        type="number"
                        className={`h-7 w-24 text-right ${
                          nuevo < costoRef - 1e-3 ? "border-red-500" : ""
                        }`}
                        value={nuevo}
                        onChange={e =>
                          setPreciosEditados(prev => ({
                            ...prev,
                            [pr.precio_id]: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </p>
                    <p className="text-[11px]">
                      Venta: {pr.precio_venta.toFixed(2)}
                    </p>
                    <p className={`text-[11px] ${costoDiffClr}`}>
                      Costo ant.: {pr.precio_costo.toFixed(2)}
                      <span className="text-muted-foreground">
                        &nbsp;Costo nue.: {costoUnitNuevo.toFixed(2)}
                      </span>
                    </p>
                    <p className={`${margenClr} text-[10px]`}>
                      Margen nuevo: {margenPct.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Acciones masivas ─── */}
        {(() => {
          const seleccionados =
            selecciones[rowId]?.filter(id =>
              visibles.some(v => v.precio_id === id),
            ) ?? [];

          return (
            <div className="pt-3 flex items-center gap-2 text-xs font-semibold">
              <span className="flex-1">
                Acciones sobre {seleccionados.length} precio(s)
              </span>

              <Button
                variant="outline"
                size="xs"
                disabled={!seleccionados.length}
                onClick={() => {
                  priceList.forEach(pr => {
                    if (!seleccionados.includes(pr.precio_id)) return;
                    const costoRef = Math.max(costoUnitNuevo, pr.precio_costo);
                    const piso = Math.ceil(costoRef) + 1;
                    const base =
                      pr.precio_venta + (costoUnitNuevo - pr.precio_costo);
                    setPreciosEditados(prev => ({
                      ...prev,
                      [pr.precio_id]: Math.max(+base.toFixed(2), piso),
                    }));
                  });
                }}
              >
                ⇄ Costo
              </Button>

              <Input
                placeholder="% / $"
                disabled={!seleccionados.length}
                className="h-6 w-16 text-right disabled:opacity-50"
                onKeyDown={e => {
                  if (e.key !== "Enter") return;
                  const raw = e.currentTarget.value.trim();
                  if (!raw) return;
                  const pct = raw.includes("%");
                  const delta = parseFloat(raw.replace(/%/g, "")) || 0;
                  if (!delta) return;
                  priceList.forEach(pr => {
                    if (!seleccionados.includes(pr.precio_id)) return;
                    const base =
                      preciosEditados[pr.precio_id] ?? pr.precio_venta;
                    const nuevo = pct
                      ? +(base * (1 + delta / 100)).toFixed(2)
                      : +(base + delta).toFixed(2);
                    setPreciosEditados(prev => ({
                      ...prev,
                      [pr.precio_id]: nuevo,
                    }));
                  });
                  (e.target as HTMLInputElement).value = "";
                }}
              />
            </div>
          );
        })()}
      </PopoverContent>
    </Popover>
  );
}


/* ─────────────────────────────────────────────────────────
 *  Tipos generales
 * ───────────────────────────────────────────────────────── */
interface CambioPendiente {
  rowId: string;
  precio_id: number;
  nuevoVenta: number;
}

interface Producto {
  rowId: string;
  id: string;
  nombre: string;
  codigoBarras: string;
  precioAnterior: number;
  precioActual: number;
  iva: number;
  cantidad: number;
  presentacionId?: number | null;
  cantidadPorPresentacion: number;
  presentacionNombre: string;
}

interface DetalleExtendido {
  precios: {
    precio_id: number;
    precio_venta: number;
    precio_costo: number;
    tipo_cliente_id: number;
    ubicacion_fisica_id: number;
    ubicacion_nombre: string;
  }[];
  inventarios: {
    ubicacion_nombre: string;
    stock_actual: number;
    stock_minimo: number;
    precio_costo: number;
    precio_venta_sugerido: number;
  }[];
}

interface Presentacion {
  id: number;
  nombre: string;
  cantidad: number;
}

interface FilaImportada {
  codigo: string;
  cantidad?: number;
  precio?: number;
  iva?: number;
}

/* ─────────────────────────────────────────────────────────
 *  API helpers
 * ───────────────────────────────────────────────────────── */
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const j = (r: Response) => {
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
};

const api = {
  buscarPorCodigo: (c: string) =>
    fetch(`${API}/api/detalle-producto/buscar-general/${c}`).then(j),
  presentaciones: (id: string) =>
    fetch(`${API}/api/presentacion/detalle/${id}`).then(j),
  presentacionById: (id: number) =>
    fetch(`${API}/api/presentacion/${id}`).then(j),
  productoUbicacion: (id: string) =>
    fetch(`${API}/api/producto-ubicacion/buscar-precio-inventario/${id}`).then(
      j,
    ),
};

/* ─────────────────────────────────────────────────────────
 *  UI helpers
 * ───────────────────────────────────────────────────────── */
const colorDiff = (base: number, ref: number) => {
  if (Math.abs(base - ref) < 1e-3) return "text-green-600";
  return base < ref ? "text-red-500" : "text-yellow-500";
};

/* ─────────────────────────────────────────────────────────
 *  Página principal
 * ───────────────────────────────────────────────────────── */
export default function ComprasPage() {
  /* -------- estado base -------- */
  const [factura, setFactura] = useState("001");
  const [proveedor, setProveedor] = useState("Proveedor General");
  const [codigo, setCodigo] = useState("");
  const [filtro, setFiltro] = useState("");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [detallesExtendidos, setDetalles] = useState<
    Record<string, DetalleExtendido>
  >({});
  const [presentacionesPorDetalle, setPresentaciones] = useState<
    Record<string, Presentacion[]>
  >({});
  const [selecciones, setSelecciones] = useState<Record<string, number[]>>({});
  const [preciosEditados, setPreciosEditados] = useState<Record<number, number>>(
    {},
  );
  const [cambiosPrecio, setCambiosPrecio] = useState<CambioPendiente[]>([]);
  const [mostrarUnitario, setMostrarUnitario] = useState(false);

  /* -------- listas derivadas -------- */
  const productosFiltrados = useMemo(() => {
    if (!filtro) return productos;
    const f = filtro.toLowerCase();
    return productos.filter(
      p =>
        p.nombre.toLowerCase().includes(f) || p.codigoBarras.includes(f),
    );
  }, [productos, filtro]);

  const { subtotal, impuesto } = useMemo(() => {
    return productosFiltrados.reduce(
      (acc, p) => {
        const piezas = p.cantidad * p.cantidadPorPresentacion;
        const sub = p.precioActual * piezas;
        acc.subtotal += sub;
        acc.impuesto += sub * p.iva / 100;
        return acc;
      },
      { subtotal: 0, impuesto: 0 },
    );
  }, [productosFiltrados]);

  /* -------- helpers de producto -------- */
  const actualizarProducto = (id: string, c: Partial<Producto>) =>
    setProductos(prev =>
      prev.map(p => (p.rowId === id ? { ...p, ...c } : p)),
    );

  const borrarProducto = (id: string) =>
    setProductos(prev => prev.filter(p => p.rowId !== id));

  /* ==================================================
   *  Alta por código / CSV
   * =================================================*/
  type AddStatus = "added" | "incremented" | "not_found";

  const agregarProductoPorCodigo = useCallback(async (codeIn: string, fila?: Partial<FilaImportada>): Promise<AddStatus> => {
    const code = codeIn.trim();
    if (!code) return "not_found";

    let data: any; try { data = await api.buscarPorCodigo(code); } catch { return "not_found"; }
    if (!data?.detalle_producto_id) return "not_found";

    const rowKey = data.detalle_producto_id.toString();
    let status: AddStatus = "added";

    setProductos(prev => {
      const idx = prev.findIndex(p => p.rowId === rowKey);
      if (idx !== -1) {
        status = "incremented";
        const extraQty = fila?.cantidad !== undefined ? Number(fila.cantidad) : 1;
        const next = [...prev];
        next[idx] = { ...next[idx], cantidad: next[idx].cantidad + extraQty };
        return next;
      }

      const nuevo: Producto = {
        rowId: rowKey,
        id: data.detalle_producto_id,
        nombre: data.nombre,
        codigoBarras: data.codigo_barras,
        precioAnterior: parseFloat(data.precio_anterior) || 0,
        precioActual : fila?.precio !== undefined ? Number(fila.precio) : (parseFloat(data.precio_actual) || 0),
        iva          : fila?.iva    !== undefined ? Number(fila.iva)    : (parseFloat(data.iva) || 0),
        cantidad     : fila?.cantidad!== undefined ? Number(fila.cantidad): 1,
        presentacionId: data.presentacion_id ?? null,
        cantidadPorPresentacion: parseFloat(data.cantidad_presentacion) || 1,
        presentacionNombre: data.presentacion_nombre || "Sin presentación",
      };
      return [...prev, nuevo];
    });

    return status;
  }, []);

  /* -------- carga detalles -------- */
  const cargarDetalles = useCallback(async (lista: Producto[]) => {
    const mapa: Record<string, DetalleExtendido> = {};
    await Promise.all(
      lista.map(async p => {
        try {
          const { data } = await api.productoUbicacion(p.id);
          mapa[p.rowId] = {
            inventarios: data.map((i: any) => ({
              ubicacion_nombre: i.ubicacion_nombre,
              stock_actual: +i.stock_actual,
              stock_minimo: +i.stock_minimo,
              precio_costo: +i.precio_costo,
              precio_venta_sugerido: +i.precio_venta,
            })),
            precios: data.map((i: any) => ({
              precio_id: i.precio_id,
              precio_venta: +i.precio_venta,
              precio_costo: +i.precio_costo,
              tipo_cliente_id: i.tipo_cliente_id,
              ubicacion_fisica_id: i.ubicacion_fisica_id,
              ubicacion_nombre: i.ubicacion_nombre,
            })),
          };
        } catch (e) {
          console.error(e);
        }
      }),
    );
    setDetalles(mapa);
  }, []);

  useEffect(() => {
    if (productos.length) cargarDetalles(productos);
  }, [productos, cargarDetalles]);

  /* -------- import CSV -------- */
  const handleFileImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const filas: FilaImportada[] = await new Promise((res, rej) => {
      Papa.parse<FilaImportada>(f, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data }) => res(data),
        error: rej,
      });
    });
    let added = 0,
      inc = 0,
      nf = 0;
    for (const fila of filas) {
      const st = await agregarProductoPorCodigo(fila.codigo, fila);
      if (st === "added") added++;
      else if (st === "incremented") inc++;
      else nf++;
    }
    alert(
      `Importación terminada.\nNuevos: ${added}\nCantidad aumentada: ${inc}\nNo encontrados: ${nf}`,
    );
    e.target.value = "";
  };

  /* -------- cambios de precios -------- */
  const upsertCambio = (rowId: string, nuevoVenta: number) => {
    const marcados = selecciones[rowId] ?? [];
    if (!marcados.length) return;
    setCambiosPrecio(prev => {
      const restante = prev.filter(
        c => !(c.rowId === rowId && marcados.includes(c.precio_id)),
      );
      const nuevos = marcados.map(id => ({
        rowId,
        precio_id: id,
        nuevoVenta,
      }));
      return [...restante, ...nuevos];
    });
  };

  /* -------- helper presentación -------- */
  const presentacionLabel = (p: Producto) => {
    const lista = presentacionesPorDetalle[p.id];
    if (!lista || p.presentacionId == null)
      return `${p.presentacionNombre} — ${p.cantidadPorPresentacion} pz`;
    const m = lista.find(pr => pr.id === p.presentacionId);
    return m
      ? `${m.nombre} — ${m.cantidad} pz`
      : `ID ${p.presentacionId}`;
  };

  /* -------- dummy guardar -------- */
  const guardarCompra = async (
    prods: Producto[],
    fac: string,
    prov: string,
  ) => console.log("Simulando guardarCompra", { prods, fac, prov });

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Panel de Compras</h1>

      {/* Encabezado */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Factura</Label>
          <Input
            value={factura}
            onChange={e => setFactura(e.target.value)}
          />
        </div>
        <div>
          <Label>Proveedor</Label>
          <Select value={proveedor} onValueChange={setProveedor}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Proveedor General">
                Proveedor General
              </SelectItem>
              <SelectItem value="Proveedor Alterno">
                Proveedor Alterno
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Código</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={codigo}
              placeholder="Escanea o escribe código"
              onChange={e => setCodigo(e.target.value)}
              onKeyDown={async e => {
                if (e.key === "Enter") {
                  const st = await agregarProductoPorCodigo(codigo);
                  if (st === "not_found") alert("No encontrado");
                  setCodigo("");
                }
              }}
            />
            <Button
              onClick={async () => {
                const st = await agregarProductoPorCodigo(codigo);
                if (st === "not_found") alert("No encontrado");
                setCodigo("");
              }}
            >
              Agregar
            </Button>
          </div>
        </div>
      </section>

      {/* Filtro + CSV + Toggle */}
      <section className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
        <Input
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="max-w-xs"
          placeholder="Filtrar por nombre o código"
        />
        <div className="flex gap-2 items-center">
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileImport}
          />
          <Button asChild variant="secondary">
            <label htmlFor="fileInput" className="cursor-pointer">
              Importar CSV
            </label>
          </Button>
          <Button
            variant="outline"
            onClick={() => setMostrarUnitario(v => !v)}
          >
            {mostrarUnitario ? "Ocultar detalles" : "Ver detalles"}
          </Button>
        </div>
      </section>

      {/* Tabla */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Cod. Barras</TableHead>
            <TableHead>$ Anterior</TableHead>
            <TableHead>$ Actual</TableHead>
            {mostrarUnitario && <TableHead>$ Unit.</TableHead>}
            <TableHead>IVA %</TableHead>
            <TableHead>Cant.</TableHead>
            <TableHead>Presentación</TableHead>
            <TableHead>Detalles</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {productosFiltrados.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={mostrarUnitario ? 10 : 9}
                className="text-center py-6 text-muted-foreground"
              >
                No hay productos.
              </TableCell>
            </TableRow>
          ) : (
            productosFiltrados.map(p => {
              const piezasTot =
                p.cantidad * p.cantidadPorPresentacion;
              const detalle = detallesExtendidos[p.rowId];
              const priceList = detalle?.precios ?? [];

              return (
                <TableRow key={p.rowId} className="align-top">
                  {/* Producto */}
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.codigoBarras}</TableCell>
                  <TableCell>S/ {p.precioAnterior.toFixed(2)}</TableCell>

                  {/* $ Actual + Popover */}
                  <TableCell className="space-y-1">
                    <Input
                      type="number"
                      className="w-24"
                      value={p.precioActual}
                      onChange={e =>
                        actualizarProducto(p.rowId, {
                          precioActual: +e.target.value || 0,
                        })
                      }
                      onBlur={() =>
                        upsertCambio(p.rowId, p.precioActual)
                      }
                    />

                    {/* Popover completo */}
                    <PricePopover
                      rowId={p.rowId}
                      priceList={priceList}
                      piezasTot={piezasTot}
                      costoUnitNuevo={
                        (p.precioActual / piezasTot) *
                        (1 + p.iva / 100)
                      }
                      selecciones={selecciones}
                      setSelecciones={setSelecciones}
                      preciosEditados={preciosEditados}
                      setPreciosEditados={setPreciosEditados}
                    />
                  </TableCell>

                  {/* Unitario */}
                  {mostrarUnitario && (
                    <TableCell>
                      {(() => {
                        const pcs = p.cantidadPorPresentacion || 1;
                        const unit =
                          (p.precioActual / pcs) *
                          (1 + p.iva / 100);
                        return `S/ ${unit.toFixed(2)}`;
                      })()}
                    </TableCell>
                  )}

                  {/* IVA */}
                  <TableCell>
                    <Input
                      type="number"
                      className="w-20"
                      min={0}
                      max={100}
                      value={p.iva}
                      onChange={e =>
                        actualizarProducto(p.rowId, {
                          iva: +e.target.value || 0,
                        })
                      }
                    />
                  </TableCell>

                  {/* Cantidad */}
                  <TableCell>
                    <Input
                      type="number"
                      className="w-20"
                      min={1}
                      value={p.cantidad}
                      onChange={e =>
                        actualizarProducto(p.rowId, {
                          cantidad: +e.target.value || 1,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {p.cantidad} × {p.cantidadPorPresentacion} ={" "}
                      {piezasTot} pz
                    </p>
                  </TableCell>

                  {/* Presentación */}
                  <TableCell>
                    <Select
                      value={p.presentacionId?.toString() ?? "0"}
                      onOpenChange={async o => {
                        if (
                          o &&
                          !presentacionesPorDetalle[p.id]
                        ) {
                          const { data } = await api.presentaciones(
                            p.id,
                          );
                          setPresentaciones(prev => ({
                            ...prev,
                            [p.id]: data ?? [],
                          }));
                        }
                      }}
                      onValueChange={async val => {
                        const id = +val;
                        if (id === 0)
                          return actualizarProducto(p.rowId, {
                            presentacionId: null,
                            cantidadPorPresentacion: 1,
                          });
                        const { data } = await api.presentacionById(
                          id,
                        );
                        actualizarProducto(p.rowId, {
                          presentacionId: id,
                          cantidadPorPresentacion:
                            +data?.cantidad || 1,
                        });
                      }}
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue>
                          {presentacionLabel(p)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">
                          Sin presentación — 1 pz
                        </SelectItem>
                        {(presentacionesPorDetalle[p.id] ?? []).map(
                          pr => (
                            <SelectItem
                              key={pr.id}
                              value={pr.id.toString()}
                            >
                              {pr.nombre} — {pr.cantidad} pz
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Detalles */}
                  <TableCell>
                    {detalle && (
                      <div className="space-y-1 text-xs">
                        {detalle.inventarios.map((i, idx) => (
                          <div key={idx}>
                            📦 {i.ubicacion_nombre} —{" "}
                            {i.stock_actual} pz — $
                            {i.precio_costo.toFixed(2)}
                          </div>
                        ))}
                        {detalle.precios.map((pr, idx) => (
                          <div key={idx}>
                            💲 {pr.precio_venta} — Cliente tipo{" "}
                            {pr.tipo_cliente_id}
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => borrarProducto(p.rowId)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Totales */}
      <footer className="flex justify-between items-center border-t pt-4">
        <div className="space-y-1 text-sm">
          <div>Subtotal: S/ {subtotal.toFixed(2)}</div>
          <div>Impuesto:&nbsp; S/ {impuesto.toFixed(2)}</div>
          <div className="font-semibold">
            Total: S/ {(subtotal + impuesto).toFixed(2)}
          </div>
        </div>
        <Button
          onClick={async () => {
            await guardarCompra(productos, factura, proveedor);
            if (cambiosPrecio.length) {
              await fetch(`${API}/api/precio/actualizar-lote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cambios: cambiosPrecio }),
              }).then(j);
            }
            alert("Compra registrada y precios actualizados");
          }}
        >
          Enviar
        </Button>
      </footer>
    </main>
  );
}
