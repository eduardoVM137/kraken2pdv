"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Eye,
  Edit,
  QrCode,
  LockKeyhole,
  ScrollText,
  MapPinIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getListaProductos,
  getProductosCriticos,
  getProductosPrioritarios,
  getProductosMetricas,
} from "@/lib/fetchers/productos";

interface Producto {
  id: number;
  nombre_calculado: string;
  sku: string;
  stock: number;
  precio: number;
  alias?: { etiqueta_id: number; alias: string | null; tipo: string | null }[];
  precios?: { precio_id: number; precio_venta: string; tipo_cliente?: string | null }[];
  categoria?: string;
  activo: "activo" | "inactivo" | "pendiente";
  total_vendido?: number;
  veces_vendido?: number;
  rotacion_prom_dias?: number;
  stock_minimo?: number;
  stock_minimo_recomendado?: number;
  tipoVista?: "critico" | "prioritario" | "metrica";
}

interface ProductTableProps {
  onVerAuditoria?: (detalle_producto_id: number) => void;
  onVerUbicacion?: (detalle_producto_id: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  onVerAuditoria,
  onVerUbicacion,
}) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [orderBy, setOrderBy] = useState<keyof Producto | "precio">("nombre_calculado");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [vistaExtra, setVistaExtra] = useState<"todos" | "criticos" | "prioritarios" | "metricas">("todos");
  const [cache, setCache] = useState<{ [key: string]: Producto[] }>({});

  const rowsPerPage = 10;

  const toggleSelection = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSort = (campo: keyof Producto | "precio") => {
    if (orderBy === campo) {
      setOrderDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(campo);
      setOrderDir("asc");
    }
  };

  const cargarProductos = async (tipo: typeof vistaExtra) => {
    setVistaExtra(tipo);

    const vista =
      tipo === "metricas" ? "metrica" :
      tipo === "prioritarios" ? "prioritario" :
      tipo === "criticos" ? "critico" :
      undefined;

    const mapConVista = (data: Producto[]) =>
      Array.from(
        new Map(
          data.map((p) => [p.id, { ...p, tipoVista: vista }])
        ).values()
      );

    if (cache[tipo]) {
      setProductos(mapConVista(cache[tipo]));
      return;
    }

    try {
      let data: Producto[] = [];

      if (tipo === "todos") {
        data = await getListaProductos();
      } else if (tipo === "criticos") {
        data = await getProductosCriticos();
      } else if (tipo === "prioritarios") {
        data = await getProductosPrioritarios();
      } else if (tipo === "metricas") {
        data = await getProductosMetricas();
      }

      const dataConVistaUnicos = mapConVista(data);

      setProductos(dataConVistaUnicos);
      setCache((prev) => ({ ...prev, [tipo]: dataConVistaUnicos }));
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos("todos");
  }, []);

  const filteredAndSorted = useMemo(() => {
    let filtered = productos.filter((p) => {
      const term = search.toLowerCase();
      const matchesSearch =
        p.nombre_calculado.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.alias?.some((a) => a.alias?.toLowerCase().includes(term)) ||
        p.precios?.some(
          (pr) =>
            typeof pr.tipo_cliente === "string" &&
            pr.tipo_cliente.toLowerCase().includes(term)
        );

      const matchesEstado = estadoFiltro === "todos" || p.activo === estadoFiltro;
      return matchesSearch && matchesEstado;
    });

    return filtered.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      if (orderBy === "precio") {
        aValue = Number(a.precios?.[0]?.precio_venta ?? 0);
        bValue = Number(b.precios?.[0]?.precio_venta ?? 0);
      } else {
        aValue = String(a[orderBy] ?? "").toLowerCase();
        bValue = String(b[orderBy] ?? "").toLowerCase();
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return orderDir === "asc" ? aValue - bValue : bValue - aValue;
      }

      return orderDir === "asc"
        ? aValue.localeCompare(String(bValue))
        : String(bValue).localeCompare(aValue);
    });
  }, [productos, search, estadoFiltro, orderBy, orderDir]);

  const totalPages = Math.ceil(filteredAndSorted.length / rowsPerPage);
  const paginated = filteredAndSorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const botonesVista = [
    { label: "Más vendidos", tipo: "prioritarios" },
    { label: "Márgenes bajos", tipo: "criticos" },
    { label: "Métricas de rotación", tipo: "metricas" },
    { label: "Todos", tipo: "todos" },
  ];

  return (
    <div className="relative space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Buscar por nombre, alias, SKU o tipo cliente..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        <select
          value={estadoFiltro}
          onChange={(e) => {
            setEstadoFiltro(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="todos">Todos</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="pendiente">Pendiente</option>
        </select>

        {botonesVista.map((b) => (
          <Button
            key={b.tipo}
            variant={vistaExtra === b.tipo ? "default" : "outline"}
            size="sm"
            onClick={() => cargarProductos(b.tipo as any)}
          >
            {b.label}
          </Button>
        ))}
      </div>

      <div className="overflow-auto rounded-md border bg-white shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-2 w-6"><Checkbox /></th>
              <th onClick={() => handleSort("nombre_calculado")} className="p-2 cursor-pointer select-none">
                <div className="flex items-center gap-1">
                  Nombre
                  {orderBy === "nombre_calculado" && (orderDir === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </div>
              </th>
              <th className="p-2">Alias</th>
              <th onClick={() => handleSort("precio")} className="p-2 cursor-pointer select-none">
                <div className="flex items-center gap-1">
                  Precios
                  {orderBy === "precio" && (orderDir === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </div>
              </th>
              {vistaExtra === "metricas" && (
                <>
                  <th className="p-2">Total Vendido</th>
                  <th className="p-2">Veces Vendido</th>
                  <th className="p-2">Rotación (días)</th>
                </>
              )}
              <th className="p-2">Estado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((producto) => (
              <tr key={`${producto.id}-${producto.tipoVista ?? "base"}`} className="border-b hover:bg-muted/50">
                <td className="p-2">
                  <Checkbox
                    checked={selected.includes(producto.id)}
                    onCheckedChange={() => toggleSelection(producto.id)}
                  />
                </td>
                <td className="p-2 font-medium">
                  {producto.nombre_calculado}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {producto.tipoVista === "prioritario" && (
                      <Badge variant="outline" className="text-xs text-blue-700 border-blue-700">Más vendido</Badge>
                    )}
                    {producto.tipoVista === "critico" && (
                      <Badge variant="outline" className="text-xs text-orange-700 border-orange-700">Margen bajo</Badge>
                    )}
                    {producto.tipoVista === "metrica" && (
                      <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-700">Métrico</Badge>
                    )}
                    {(producto.stock_minimo ?? 0) > producto.stock && (
                      <Badge variant="destructive" className="text-xs">Stock bajo</Badge>
                    )}
                  </div>
                </td>
                <td className="p-2">
                  {producto.alias?.length ? (
                    <div className="flex flex-col gap-1">
                      {producto.alias.map((a, i) => (
                        <span key={i} className="text-xs text-muted-foreground">
                          {a.alias || "—"}{a.tipo ? ` (${a.tipo})` : ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-2">
                  {producto.precios?.length ? (
                    <div className="flex flex-col gap-1">
                      {producto.precios.map((p, i) => (
                        <span key={i} className="text-xs text-muted-foreground">
                          ${Number(p.precio_venta).toFixed(2)}{p.tipo_cliente ? ` (${p.tipo_cliente})` : ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                {vistaExtra === "metricas" && (
                  <>
                    <td className="p-2">{producto.total_vendido ?? "—"}</td>
                    <td className="p-2">{producto.veces_vendido ?? "—"}</td>
                    <td className="p-2">
                      {producto.rotacion_prom_dias != null
                        ? Number(producto.rotacion_prom_dias).toFixed(2)
                        : "—"}
                    </td>
                  </>
                )}
                <td className="p-2">
                  <Badge className={{
                    activo: "bg-green-100 text-green-800",
                    inactivo: "bg-red-100 text-red-800",
                    pendiente: "bg-gray-200 text-gray-600",
                  }[producto.activo]}>
                    {producto.activo}
                  </Badge>
                </td>
                <td className="p-2 flex gap-1 flex-wrap">
                  <Button size="icon" variant="ghost" onClick={() => onVerAuditoria?.(producto.id)}><ScrollText className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => onVerUbicacion?.(producto.id)}><MapPinIcon className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost"><Eye className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost"><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost"><QrCode className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost"><LockKeyhole className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm mt-2">
        <div className="text-muted-foreground">
          Página {currentPage} de {totalPages} — {filteredAndSorted.length} resultado(s)
        </div>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
