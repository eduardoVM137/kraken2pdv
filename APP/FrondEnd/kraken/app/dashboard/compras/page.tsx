"use client";
import { useState, useMemo, useCallback, ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import Papa from "papaparse";

/* ==================================================
 *  Tipos auxiliares y contratos de datos
 * =================================================*/
interface CambioPendiente {
  rowId: string;
  nuevoCosto: number;
  precio_ids: number[]; // ID(s) exactos sobre los que se hará el UPDATE
}

interface Producto {
  rowId: string;                    // clave de React (detalle_producto_id string)
  id: string;                       // detalle_producto_id real
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

interface Presentacion { id: number; nombre: string; cantidad: number; }
interface FilaImportada { codigo: string; cantidad?: number; precio?: number; iva?: number; }

/* ==================================================
 *  Helpers de API
 * =================================================*/
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const json = (r: Response) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); };
const api = {
  buscarPorCodigo : (c: string)    => fetch(`${API_BASE_URL}/api/detalle-producto/buscar-general/${c}`).then(json),
  presentaciones   : (id: string)  => fetch(`${API_BASE_URL}/api/presentacion/detalle/${id}`).then(json),
  presentacionById : (id: number)  => fetch(`${API_BASE_URL}/api/presentacion/${id}`).then(json),
  productoUbicacion: (id: string)  => fetch(`${API_BASE_URL}/api/producto-ubicacion/buscar-precio-inventario/${id}`).then(json),
};

/* ==================================================
 *  Componente principal
 * =================================================*/
export default function ComprasPage() {
  /* ---------------- estado base ---------------- */
  const [factura,  setFactura]  = useState("001");
  const [proveedor,setProveedor]= useState("Proveedor General");
  const [codigo,   setCodigo]   = useState("");
  const [filtro,   setFiltro]   = useState("");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [detallesExtendidos, setDetallesExtendidos] = useState<Record<string, DetalleExtendido>>({});
  const [presentacionesPorDetalle, setPresentacionesPorDetalle] = useState<Record<string, Presentacion[]>>({});

  const [selecciones, setSelecciones] = useState<Record<string, number[]>>({}); // precio_ids marcados por fila
  const [cambiosPrecio, setCambiosPrecio] = useState<CambioPendiente[]>([]);
const [preciosEditados, setPreciosEditados] = useState<Record<number, number>>({});

  /* ---------------- derivadas ---------------- */
  const productosFiltrados = useMemo(() => {
    if (!filtro) return productos;
    const f = filtro.toLowerCase();
    return productos.filter(p => p.nombre.toLowerCase().includes(f) || p.codigoBarras.includes(f));
  }, [productos, filtro]);

  const { subtotal, impuesto } = useMemo(() => {
    return productosFiltrados.reduce((acc, p) => {
      const piezas = p.cantidad * p.cantidadPorPresentacion;
      const sub    = p.precioActual * piezas;
      acc.subtotal += sub;
      acc.impuesto += (sub * p.iva) / 100;
      return acc;
    }, { subtotal: 0, impuesto: 0 });
  }, [productosFiltrados]);

  /* ==================================================
   *  Mutadores de producto
   * =================================================*/
  const actualizarProducto = (rowId: string, cambios: Partial<Producto>) =>
    setProductos(prev => prev.map(p => p.rowId === rowId ? { ...p, ...cambios } : p));

  const borrarProducto = (rowId: string) =>
    setProductos(prev => prev.filter(p => p.rowId !== rowId));

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

  /* ---------- carga de detalles (inventarios + precios) ---------- */
  const cargarDetallesExtendidos = useCallback(async (lista: Producto[]) => {
    const map: Record<string, DetalleExtendido> = {};

    await Promise.all(lista.map(async p => {
      try {
        const res = await api.productoUbicacion(p.id);
        const data = res.data;
        map[p.rowId] = {
          inventarios: data.map((i:any)=>({
            ubicacion_nombre: i.ubicacion_nombre,
            stock_actual    : parseFloat(i.stock_actual),
            stock_minimo    : parseFloat(i.stock_minimo),
            precio_costo    : parseFloat(i.precio_costo),
            precio_venta_sugerido: parseFloat(i.precio_venta),
          })),
          precios: data.map((i:any)=>({
            precio_id: i.precio_id,
            precio_venta: parseFloat(i.precio_venta),
            tipo_cliente_id: i.tipo_cliente_id,
            ubicacion_fisica_id: i.ubicacion_fisica_id,
            ubicacion_nombre: i.ubicacion_nombre,
          })),
        };
      } catch(e){ console.error(e);}  
    }));

    setDetallesExtendidos(map);
  }, []);

  // Actualiza detalles cada vez que cambia la lista de productos
  useEffect(() => { if (productos.length) cargarDetallesExtendidos(productos); }, [productos, cargarDetallesExtendidos]);

  /* ========== A PARTIR DE AQUÍ VA EL BLOQUE DE handleFileImport ========== */
   /* ---------- import CSV ---------- */
  const handleFileImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filas: FilaImportada[] = await new Promise((resolve, reject) => {
      Papa.parse<FilaImportada>(file, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data }) => resolve(data),
        error   : err => reject(err),
      });
    });

    let added = 0, inc = 0, nf = 0;
    for (const fila of filas) {
      const st = await agregarProductoPorCodigo(fila.codigo, fila);
      if (st === "added") added++;
      else if (st === "incremented") inc++;
      else nf++;
    }

    alert(`Importación terminada.\nNuevos: ${added}\nCantidad aumentada: ${inc}\nNo encontrados: ${nf}`);
    e.target.value = ""; // limpia input
  };

  /* ==================================================
   *  Utilidades
   * =================================================*/

  /** Etiqueta legible para la presentación actual */
  const presentacionLabel = (p: Producto) => {
    const lista = presentacionesPorDetalle[p.id];
    if (!lista || p.presentacionId == null)
      return `${p.presentacionNombre} — ${p.cantidadPorPresentacion} pz`;

    const match = lista.find(pr => pr.id === p.presentacionId);
    return match
      ? `${match.nombre} — ${match.cantidad} pz`
      : `ID ${p.presentacionId}`;
  };

  /** Inserta o actualiza cambio de precio_venta por precio_id */
  const upsertCambio = (rowId: string, nuevo: number) => {
    setCambiosPrecio(prev => {
      const marcados = selecciones[rowId] ?? [];
      if (marcados.length === 0) return prev;

      const payload = marcados.map(id => ({
        rowId,
        precio_id : id,
        nuevoVenta: preciosEditados[id] ?? nuevo,
      }));

      const resto = prev.filter(c =>
        !(c.rowId === rowId && marcados.includes((c as any).precio_id))
      );

      return [...resto, ...payload];
    });
  };

  /** Placeholder de guardado – cambia por tu endpoint real */
  const guardarCompra = async (
    productos: Producto[],
    factura: string,
    proveedor: string
  ) => {
    console.log("Simulando guardarCompra:", { productos, factura, proveedor });
    // TODO: sustituir por fetch POST real
  };

  /* ============ A PARTIR DE AQUÍ VIENE EL JSX 'return (…)'
     (ya lo pegaste en el paso anterior) ============ */


/* ==================================================
 *  Render
 * =================================================*/
return (
  <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    {/* ────────────────────────────────────────────────
     *  1. Título principal
     * ──────────────────────────────────────────────── */}
    <h1 className="text-3xl font-bold">Panel de Compras</h1>

    {/* ────────────────────────────────────────────────
     *  2. Encabezado: factura / proveedor / código
     * ──────────────────────────────────────────────── */}
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Factura */}
      <div>
        <Label>Factura</Label>
        <Input value={factura} onChange={e => setFactura(e.target.value)} />
      </div>

      {/* Proveedor */}
      <div>
        <Label>Proveedor</Label>
        <Select value={proveedor} onValueChange={setProveedor}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Proveedor General">Proveedor General</SelectItem>
            <SelectItem value="Proveedor Alterno">Proveedor Alterno</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Captura de código */}
      <div>
        <Label>Código</Label>
        <div className="flex gap-2 mt-1">
          <Input
            placeholder="Escanea o escribe código"
            value={codigo}
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

    {/* ────────────────────────────────────────────────
     *  3. Barra utilidades: filtro + importar CSV
     * ──────────────────────────────────────────────── */}
    <section className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
      {/* Filtro */}
      <Input
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        className="max-w-xs"
        placeholder="Filtrar por nombre o código"
      />

      {/* Import CSV */}
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
      </div>
    </section>

    {/* ────────────────────────────────────────────────
     *  4. Tabla de productos
     * ──────────────────────────────────────────────── */}
    <Table>
      {/* Cabecera */}
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Cod. Barras</TableHead>
          <TableHead>$ Anterior</TableHead>
          <TableHead>$ Actual</TableHead>
          <TableHead>IVA %</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Presentación</TableHead>
          <TableHead>Detalles</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>

      {/* Cuerpo */}
      <TableBody>
        {productosFiltrados.length === 0 ? (
          /* ---- sin productos ---- */
          <TableRow>
            <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
              No hay productos.
            </TableCell>
          </TableRow>
        ) : (
          /* ---- lista de productos ---- */
          productosFiltrados.map(p => {
            const piezas     = p.cantidad * p.cantidadPorPresentacion;
            const detalle    = detallesExtendidos[p.rowId];
            const priceList  = detalle?.precios || [];
            const selected   = selecciones[p.rowId] || [];

            return (
              <TableRow key={p.rowId} className="align-top">
                {/* 4-A. Datos básicos */}
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.codigoBarras}</TableCell>
                <TableCell>S/ {p.precioAnterior.toFixed(2)}</TableCell>

                {/* 4-B. Precio actual + pop-over de precios */}
                <TableCell className="space-y-1">
                  {/* Input costo */}
                  <Input
                    type="number"
                    className="w-24"
                    value={p.precioActual}
                    onChange={e =>
                      actualizarProducto(p.rowId, { precioActual: parseFloat(e.target.value) || 0 })
                    }
                    onBlur={() => upsertCambio(p.rowId, p.precioActual)}
                  />

{/* ─ Pop-over editor de precios ─ */}
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm" className="w-36 text-xs">
      {selected.length === 0 ? "Editar precios" : `${selected.length} prec. sel.`}
    </Button>
  </PopoverTrigger>

  <PopoverContent
    className="p-3 w-80"
    onOpenAutoFocus={e => e.preventDefault()}
    onInteractOutside={() => {
      /* guarda al cerrar */
      setCambiosPrecio(prev => {
        const ids = selecciones[p.rowId] || [];
        if (!ids.length) return prev;

        const pack = ids.map(id => ({
          rowId     : p.rowId,
          precio_id : id,
          nuevoVenta: preciosEditados[id] ??
                      priceList.find(x => x.precio_id === id)!.precio_venta,
        }));
        const resto = prev.filter(c =>
          !(c.rowId === p.rowId && ids.includes((c as any).precio_id))
        );
        return [...resto, ...pack];
      });
    }}
  >
    {/* ─ Barra de acciones ─ */}
    <div className="flex items-center gap-2 mb-2 text-xs font-semibold">
      <span className="flex-1">Ubicación</span>

      {/* ⇄ Costo → conserva margen */}
      <Button
        variant="outline"
        size="xs"
        className="h-6 px-2"
        onClick={() => {
          const det = detallesExtendidos[p.rowId];
          if (!det) return;

          const piezasTot = p.cantidad * p.cantidadPorPresentacion;
          const costNew   = p.precioActual / piezasTot;          // ← NUEVO costo / pieza

          det.precios.forEach(pr => {
            /* costo anterior / pieza */
            const inv     = det.inventarios.find(i => i.ubicacion_nombre === pr.ubicacion_nombre);
            const costOld = inv?.precio_costo ?? costNew;

            /* margen $ anterior */
            const margen  = pr.precio_venta - costOld;
            const venta   = +(costNew + margen).toFixed(2);

            setPreciosEditados(prev => ({ ...prev, [pr.precio_id]: venta }));
            setSelecciones(prev => ({
              ...prev,
              [p.rowId]: Array.from(new Set([...(prev[p.rowId] ?? []), pr.precio_id])),
            }));
          });
        }}
      >
        ⇄ Costo
      </Button>

      {/* incremento % o $ */}
      <input
        type="text"
        placeholder="% / $"
        className="h-6 w-16 text-right border rounded px-1"
        onKeyDown={e => {
          if (e.key !== "Enter") return;
          const raw = e.currentTarget.value.trim();
          if (!raw) return;
          const pct   = raw.includes("%");
          const delta = parseFloat(raw.replace(/%/g, "")) || 0;
          if (!delta) return;

          priceList.forEach(pr => {
            const base  = preciosEditados[pr.precio_id] ?? pr.precio_venta;
            const nuevo = pct
              ? +(base * (1 + delta / 100)).toFixed(2)
              : +(base + delta).toFixed(2);
            setPreciosEditados(prev => ({ ...prev, [pr.precio_id]: nuevo }));
          });
          e.currentTarget.value = "";
        }}
      />

      <span className="w-20 text-right">Nuevo $</span>
    </div>

    {/* ─ Filas de ubicaciones ─ */}
    {priceList.map(pr => {
      const det          = detallesExtendidos[p.rowId];
      const checked       = selected.includes(pr.precio_id);

      /* COSTO NUEVO POR PIEZA: $Actual ÷ (cantidad total de piezas) */
      const piezasTotales = p.cantidad * p.cantidadPorPresentacion;
      const costNew       = +(p.precioActual / piezasTotales).toFixed(4);

      /* COSTO ANTERIOR POR PIEZA (o costNew si no existe) */
      const inv = det?.inventarios.find(i => i.ubicacion_nombre === pr.ubicacion_nombre);
      const costOld = inv?.precio_costo ?? costNew;

      /* margen original y sugerido */
      const margen  = pr.precio_venta - costOld;
      const sugerido = +(costNew + margen).toFixed(2);

      const nuevoVenta = preciosEditados[pr.precio_id] ?? sugerido;

      /* Colores según comparación costoNuevo vs ventaAnterior */
      const diff = costNew - pr.precio_venta;
      const colorVenta =
        diff >  0.001 ? "text-red-500"    // costo subió, venta < costo
      : diff < -0.001 ? "text-yellow-500" // costo bajó, venta > costo
      :                 "text-green-600"; // iguales

      return (
        <div key={pr.precio_id} className="flex items-center gap-2 py-1 border-t first:border-t-0 text-xs">
          {/* seleccionar fila */}
          <input
            type="checkbox"
            checked={checked}
            onChange={() =>
              setSelecciones(prev => {
                const set = new Set(prev[p.rowId] || []);
                checked ? set.delete(pr.precio_id) : set.add(pr.precio_id);
                return { ...prev, [p.rowId]: Array.from(set) };
              })
            }
          />

          {/* datos */}
          <div className="flex-1">
            <p>{pr.ubicacion_nombre}</p>
            <p className={`${colorVenta} text-[11px]`}>
              Venta: {pr.precio_venta.toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Costo ant.: {costOld.toFixed(2)}
            </p>
          </div>

          {/* input editable */}
          <Input
            type="number"
            className="h-7 w-20 text-right"
            value={nuevoVenta}
            onChange={e =>
              setPreciosEditados(prev => ({
                ...prev,
                [pr.precio_id]: parseFloat(e.target.value) || 0,
              }))
            }
          />
        </div>
      );
    })}

    {priceList.length === 0 && (
      <p className="text-muted-foreground text-xs">Sin precios cargados</p>
    )}
  </PopoverContent>
</Popover>

                </TableCell>

                {/* 4-C. IVA */}
                <TableCell>
                  <Input
                    type="number"
                    className="w-20"
                    min={0}
                    max={100}
                    value={p.iva}
                    onChange={e =>
                      actualizarProducto(p.rowId, { iva: parseFloat(e.target.value) || 0 })
                    }
                  />
                </TableCell>

                {/* 4-D. Cantidad */}
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    className="w-20"
                    value={p.cantidad}
                    onChange={e =>
                      actualizarProducto(p.rowId, { cantidad: parseInt(e.target.value) || 1 })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {p.cantidad} × {p.cantidadPorPresentacion} = {piezas} pz
                  </p>
                </TableCell>

                {/* 4-E. Presentación */}
                <TableCell>
                  <Select
                    value={p.presentacionId?.toString() ?? "0"}
                    onOpenChange={async open => {
                      if (open && !presentacionesPorDetalle[p.id]) {
                        const data = await api.presentaciones(p.id);
                        setPresentacionesPorDetalle(prev => ({ ...prev, [p.id]: data.data ?? [] }));
                      }
                    }}
                    onValueChange={async val => {
                      const idPres = parseInt(val);

                      // — Sin presentación
                      if (idPres === 0) {
                        return actualizarProducto(p.rowId, {
                          presentacionId: null,
                          cantidadPorPresentacion: 1,
                        });
                      }

                      // — Otra presentación
                      const { data } = await api.presentacionById(idPres);
                      actualizarProducto(p.rowId, {
                        presentacionId: idPres,
                        cantidadPorPresentacion: parseFloat(data?.cantidad) || 1,
                      });
                    }}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue>{presentacionLabel(p)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sin presentación — 1 pz</SelectItem>
                      {(presentacionesPorDetalle[p.id] || []).map(pr => (
                        <SelectItem key={pr.id} value={pr.id.toString()}>
                          {pr.nombre} — {pr.cantidad} pz
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* 4-F. Detalles inventario + precios */}
                <TableCell>
                  {detalle && (
                    <div className="space-y-1 text-xs">
                      {/* Inventarios */}
                      {detalle.inventarios.map((i, idx) => (
                        <div key={idx}>
                          📦 {i.ubicacion_nombre} — {i.stock_actual} pz — $
                          {i.precio_costo.toFixed(2)}
                        </div>
                      ))}

                      {/* Precios */}
                      {detalle.precios.map((pr, idx) => (
                        <div key={idx}>
                          💲 {pr.precio_venta} — Cliente tipo {pr.tipo_cliente_id}
                        </div>
                      ))}
                    </div>
                  )}
                </TableCell>

                {/* 4-G. Acciones */}
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => borrarProducto(p.rowId)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>

    {/* ────────────────────────────────────────────────
     *  5. Totales + acción enviar
     * ──────────────────────────────────────────────── */}
    <footer className="flex justify-between items-center border-t pt-4">
      <div className="space-y-1 text-sm">
        <div>Subtotal: S/ {subtotal.toFixed(2)}</div>
        <div>Impuesto: S/ {impuesto.toFixed(2)}</div>
        <div className="font-semibold">
          Total: S/ {(subtotal + impuesto).toFixed(2)}
        </div>
      </div>

      <Button
        onClick={async () => {
          /* 1. Guardar compra */
          await guardarCompra(productos, factura, proveedor);

          /* 2. Actualizar precios seleccionados */
          if (cambiosPrecio.length) {
            await fetch(`${API_BASE_URL}/api/precio/actualizar-lote`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cambios: cambiosPrecio }),
            }).then(json);
          }

          alert("Compra registrada y precios actualizados");
        }}
      >
        Enviar
      </Button>
    </footer>
  </main>
);
} /* ← cierre de ComprasPage */
