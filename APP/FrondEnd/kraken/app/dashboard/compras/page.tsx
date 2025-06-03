"use client";
import { useState, useMemo, useCallback } from "react";
import { Input }        from "@/components/ui/input";
import { Label }        from "@/components/ui/label";
import { Button }       from "@/components/ui/button";
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

import Papa from "papaparse";

/* --------------------------------------------------
 *  Tipos
 * ------------------------------------------------*/
interface Producto {
  /** Identificador único de la fila (igual al detalle_producto_id) */
  rowId: string;
  /** detalle_producto_id real */
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
  precios: { precio_venta: number; tipo_cliente_id: number }[];
  inventarios: { ubicacion_nombre: string; stock_actual: number }[];
}

interface Presentacion { id: number; nombre: string; cantidad: number; }
interface FilaImportada { codigo: string; cantidad?: number; precio?: number; iva?: number; }

/* --------------------------------------------------
 *  API helpers
 * ------------------------------------------------*/
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const json = (r: Response) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); };
const api = {
  buscarPorCodigo: (c: string) => fetch(`${API_BASE_URL}/api/detalle-producto/buscar-general/${c}`).then(json),
  detalleExpandido: (id: string) => fetch(`${API_BASE_URL}/api/detalle-producto/detalle-expandido/${id}`).then(json),
  presentaciones: (id: string) => fetch(`${API_BASE_URL}/api/presentacion/detalle/${id}`).then(json),
  presentacionById: (id: number) => fetch(`${API_BASE_URL}/api/presentacion/${id}`).then(json),
  productoUbicacion: (id: string) => fetch(`${API_BASE_URL}/api/producto-ubicacion/buscar-precio-inventario/${id}`).then(json),
};

/* --------------------------------------------------
 *  Componente principal
 * ------------------------------------------------*/
export default function ComprasPage() {
  /* ---------------- state ---------------- */
  const [factura, setFactura] = useState("001");
  const [proveedor, setProveedor] = useState("Proveedor General");
  const [codigo, setCodigo] = useState("");
  const [filtro, setFiltro] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [detallesExtendidos, setDetallesExtendidos] = useState<Record<string, DetalleExtendido>>({});
  const [presentacionesPorDetalle, setPresentacionesPorDetalle] = useState<Record<string, Presentacion[]>>({});

  /* ---------------- derivadas ---------------- */
  const productosFiltrados = useMemo(() => {
    if (!filtro) return productos;
    const f = filtro.toLowerCase();
    return productos.filter(p => p.nombre.toLowerCase().includes(f) || p.codigoBarras.includes(f));
  }, [productos, filtro]);

  const { subtotal, impuesto } = useMemo(() => {
    return productosFiltrados.reduce((acc, p) => {
      const piezas = p.cantidad * p.cantidadPorPresentacion;
      const sub = p.precioActual * piezas;
      acc.subtotal += sub;
      acc.impuesto += (sub * p.iva) / 100;
      return acc;
    }, { subtotal: 0, impuesto: 0 });
  }, [productosFiltrados]);

  /* ---------------- helpers ---------------- */
  const actualizarProducto = (rowId: string, cambios: Partial<Producto>) =>
    setProductos(prev => prev.map(p => p.rowId === rowId ? { ...p, ...cambios } : p));
  const borrarProducto = (rowId: string) =>
    setProductos(prev => prev.filter(p => p.rowId !== rowId));
  /* ---------------- agregar producto ---------------- */
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
        precioActual: fila?.precio !== undefined ? Number(fila.precio) : (parseFloat(data.precio_actual) || 0),
        iva: fila?.iva !== undefined ? Number(fila.iva) : (parseFloat(data.iva) || 0),
        cantidad: fila?.cantidad !== undefined ? Number(fila.cantidad) : 1,
        presentacionId: data.presentacion_id ?? null,
        cantidadPorPresentacion: parseFloat(data.cantidad_presentacion) || 1,
        presentacionNombre: data.presentacion_nombre || "Sin presentación",
      };
      return [...prev, nuevo];
    });
    return status;
  }, []);


  /* ---------------- detalles extendidos ---------------- */
const cargarDetallesExtendidos = useCallback(async () => {
  const map: Record<string, DetalleExtendido> = {};

  await Promise.all(productos.map(async p => {
    try {
      const res = await api.productoUbicacion(p.id);
      const data = res.data;

      const inventarios = data.map((item: any) => ({
        ubicacion_nombre: item.ubicacion_nombre,
        stock_actual: parseFloat(item.stock_actual),
        stock_minimo: parseFloat(item.stock_minimo),
        precio_costo: parseFloat(item.precio_costo),
        precio_venta_sugerido: parseFloat(item.precio_venta),
      }));

      const precios = data.map((item: any) => ({
        precio_id: item.precio_id,
        precio_venta: parseFloat(item.precio_venta),
        tipo_cliente_id: item.tipo_cliente_id,
      }));

      map[p.rowId] = { inventarios, precios };
    } catch (err) {
      console.error(`Error al cargar detalles de producto ${p.id}`, err);
    }
  }));

  setDetallesExtendidos(map);
}, [productos]);

    /* ---------------- import CSV ---------------- */
  const handleFileImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // PapaParse: usamos la callback complete para obtener los datos
    const filas: FilaImportada[] = await new Promise((resolve, reject) => {
      Papa.parse<FilaImportada>(file, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data }) => resolve(data),
        error: err => reject(err),
      });
    });

    let added = 0, inc = 0, nf = 0;
    for (const fila of filas) {
      const st = await agregarProductoPorCodigo(fila.codigo, fila);
      if (st === "added") added++; else if (st === "incremented") inc++; else nf++;
    }

    alert(`Importación terminada.
            Nuevos: ${added}
            Cantidad aumentada: ${inc}
            No encontrados: ${nf}`);
                e.target.value = "";
              };

    /* ---------------- UI helpers ---------------- */
  const presentacionLabel = (p: Producto) => {
    const lista = presentacionesPorDetalle[p.id];
    if (!lista || p.presentacionId == null) return `${p.presentacionNombre} — ${p.cantidadPorPresentacion} pz`;
    const m = lista.find(pr => pr.id === p.presentacionId);
    return m ? `${m.nombre} — ${m.cantidad} pz` : `ID ${p.presentacionId}`;
  };
  
    /* ---------------- render ---------------- */
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Panel de Compras</h1>

      {/* Encabezado */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Factura</Label>
          <Input value={factura} onChange={e => setFactura(e.target.value)} />
        </div>

        <div>
          <Label>Proveedor</Label>
          <Select value={proveedor} onValueChange={setProveedor}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione proveedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Proveedor General">Proveedor General</SelectItem>
              <SelectItem value="Proveedor Alterno">Proveedor Alterno</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

      {/* Filtro + import */}
      <section className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
        <Input
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="max-w-xs"
          placeholder="Filtrar por nombre o código"
        />

        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={cargarDetallesExtendidos}>
            Ver detalles
          </Button>

          <input
            id="fileInput"
            type="file"
            accept=".csv,text/csv,application/vnd.ms-excel"
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

      {/* Tabla */}
      <Table>
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

        <TableBody>
          {productosFiltrados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                No hay productos que coincidan.
              </TableCell>
            </TableRow>
          ) : (
            productosFiltrados.map(p => {
              const piezas = p.cantidad * p.cantidadPorPresentacion;
              const detalle = detallesExtendidos[p.rowId];

              return (
                <TableRow key={p.rowId} className="align-top">
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.codigoBarras}</TableCell>
                  <TableCell>S/ {p.precioAnterior.toFixed(2)}</TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      className="w-24"
                      value={p.precioActual}
                      onChange={e =>
                        actualizarProducto(p.rowId, { precioActual: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </TableCell>

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
                        if (idPres === 0) {
                          return actualizarProducto(p.rowId, {
                            presentacionId: null,
                            cantidadPorPresentacion: 1,
                          });
                        }
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

                  <TableCell>
       {detalle && (
                    <div className="space-y-1 text-xs">
                      {detalle.inventarios.map((i, idx) => (
                        <div key={idx}>📦 {i.ubicacion_nombre} — {i.stock_actual} pz — ${parseFloat(i.precio_costo ?? "0").toFixed(2)}</div>
                      ))}
                      {detalle.precios.map((pr, idx) => (
                        <div key={idx}>💲 {pr.precio_venta} — Cliente tipo {pr.tipo_cliente_id}</div>
                      ))}
                    </div>
                  )}<
                  </TableCell>

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
                {/* Totales */}
      <footer className="flex justify-between items-center border-t pt-4">
        <div className="space-y-1 text-sm">
          <div>Subtotal: S/ {subtotal.toFixed(2)}</div>
          <div>Impuesto: S/ {impuesto.toFixed(2)}</div>
          <div className="font-semibold">Total: S/ {(subtotal + impuesto).toFixed(2)}</div>
        </div>
        <Button onClick={() => console.log("TODO: guardarCompra")}>Enviar</Button>
      </footer>
    </main>
  );
}
