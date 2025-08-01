// app/dashboard/ventas/historico/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  Printer,
  Eye,
  Clock,
  Edit,
  CornerUpLeft,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Mail,
  FileText,
} from "lucide-react";

import {
  mostrarVentas,
  getDetalleVenta,
  getTrazabilidadVenta,actualizarEstadosVentas,getClientesYEmpleados 
} from "@/lib/fetchers/ventas";
import KPICards from "./components/KPICards";
import SalesChartCard from "./components/SalesChart";
import VentaFilters from "./components/VentaFilters";
import VentaPagination from "./components/VentaPagination";
import VentaDetalle, { Detalle } from "./components/VentaDetalle";
import VentaTrazabilidad, { StateLog } from "./components/VentaTrazabilidad"; 

import Link from "next/link";

interface Venta {
  id: number;
  fecha: string;
  cliente_id: number | null;
  usuario_id: number | null;
  total: string | null;
  estado: string | null;
  forma_pago: string | null;
}

const ESTADOS = ["pendiente", "pagado", "cancelado", "devuelto"] as const;

export default function HistoricoVentasPage() {
  const router = useRouter();

  // — Datos y filtros —
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [filtered, setFiltered] = useState<Venta[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [clienteFilter, setClienteFilter] = useState("");
  const [usuarioFilter, setUsuarioFilter] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("todos");

    const [clientes, setClientes] = useState<Cliente[]>([]);
  const [usuarios,setUsuarios] = useState<Usuario[]>([]);

  // — Paginación —
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  // — Selección y pestañas —
  const [selected, setSelected] = useState<Venta | null>(null);
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [logs, setLogs] = useState<StateLog[]>([]);
  const [tab, setTab] = useState<"listado" | "detalle" | "trazabilidad">(
    "listado"
  );

  // — Ordenamiento —
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Venta;
    direction: "asc" | "desc";
  } | null>(null);

  // 1) Carga inicial
  useEffect(() => {
    mostrarVentas()
      .then((data) => {
        setVentas(data);
        setFiltered(data);
      })
      .catch(console.error);
  }, []);
    useEffect(() => {
    getClientesYEmpleados().then(({ clientes, usuarios }) => {
      setClientes(clientes);
      setUsuarios(usuarios);
    }).catch(console.error);
  }, []);

  // 2) Filtros
  useEffect(() => {
    let tmp = [...ventas];
    if (dateFrom) tmp = tmp.filter((v) => new Date(v.fecha) >= new Date(dateFrom));
    if (dateTo) tmp = tmp.filter((v) => new Date(v.fecha) <= new Date(dateTo));
    if (stateFilter.length)
      tmp = tmp.filter((v) => v.estado && stateFilter.includes(v.estado));
    if (clienteFilter) tmp = tmp.filter((v) => String(v.cliente_id).includes(clienteFilter));
    if (usuarioFilter)
      tmp = tmp.filter((v) => String(v.usuario_id).includes(usuarioFilter));
    tmp = tmp.filter((v) => {
      const tot = parseFloat(v.total || "0") || 0;
      if (minTotal && tot < +minTotal) return false;
      if (maxTotal && tot > +maxTotal) return false;
      return true;
    });
    if (paymentFilter !== "todos")
      tmp = tmp.filter((v) => v.forma_pago === paymentFilter);
    setFiltered(tmp);
    setPageIndex(1);
  }, [
    ventas,
    dateFrom,
    dateTo,
    stateFilter,
    clienteFilter,
    usuarioFilter,
    minTotal,
    maxTotal,
    paymentFilter,
  ]);

  // 3) Ordenar
  const sortedVentas = useMemo(() => {
    if (!sortConfig) return filtered;
    const { key, direction } = sortConfig;
    return [...filtered].sort((a, b) => {
      let v1 = a[key],
        v2 = b[key];
      if (typeof v1 === "string") v1 = v1.toLowerCase();
      if (typeof v2 === "string") v2 = v2.toLowerCase();
      if (v1 == null) return 1;
      if (v2 == null) return -1;
      if (v1 < v2) return direction === "asc" ? -1 : 1;
      if (v1 > v2) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortConfig]);

  // datos para el gráfico
   const chartData = useMemo(() => {
    if (!filtered.length) return [];

    // convierte todos los fechas de ventas a timestamp
    const tiempos = filtered.map((v) => new Date(v.fecha).getTime());
    const minData = Math.min(...tiempos);
    const maxData = Math.max(...tiempos);

    // rango base: ventas o pickers si existen
    const start = dateFrom ? new Date(dateFrom).getTime() : minData;
    const end = dateTo ? new Date(dateTo).getTime() : maxData;

    // agrupa totales por fecha
    const agrupado: Record<string, number> = {};
    filtered.forEach((v) => {
      const t = new Date(v.fecha).getTime();
      if (t < start || t > end) return;
      const key = new Date(t).toLocaleDateString();
      agrupado[key] = (agrupado[key] || 0) + (parseFloat(v.total || "0") || 0);
    });

    // recorre el rango día a día
    const data: { date: string; total: number }[] = [];
    for (let t = start; t <= end; t += 86400_000) {
      const d = new Date(t);
      const key = d.toLocaleDateString();
      data.push({ date: key, total: agrupado[key] || 0 });
    }

    return data;
  }, [filtered, dateFrom, dateTo]);
  // cambio de estado
    const changeEstado = async (id: number, nuevo: string) => {
    const ok = await actualizarEstadosVentas([{ id, estado: nuevo }]);
    if (!ok) {
    console.error("No se pudo actualizar el estado");
    return;
    }
    const data = await mostrarVentas();
    setVentas(data);
    };
  // acciones
  const handleViewDetail = (v: Venta) => {
    setSelected(v);
    getDetalleVenta(v.id).then(setDetalles).catch(console.error);
    setTab("detalle");
  };
  const handleViewTrazability = (v: Venta) => {
    setSelected(v);
    getTrazabilidadVenta(v.id).then(setLogs).catch(console.error);
    setTab("trazabilidad");
  };
  const handleEdit = (v: Venta) => router.push(`/dashboard/ventas/editar/${v.id}`);
  const handleRefund = async (v: Venta) => {
    await fetch(`/api/venta/${v.id}/refund`, { method: "POST" });
    const data = await mostrarVentas();
    setVentas(data);
  };

  // paginación
  const totalPages = Math.ceil(sortedVentas.length / pageSize);
  const pageItems = sortedVentas.slice(
    (pageIndex - 1) * pageSize,
    (pageIndex - 1) * pageSize + pageSize
  );

  // export CSV
  const handleExportCSV = () => {
    const header = ["ID", "Fecha", "Cliente", "Vendedor", "Total", "Estado", "Pago"];
    const rows = filtered.map(v => [
      v.id,
      new Date(v.fecha).toLocaleString(),
      v.cliente_id ?? "-",
      v.usuario_id ?? "-",
      (parseFloat(v.total || "0") || 0).toFixed(2),
      v.estado ?? "-",
      v.forma_pago ?? "-"
    ]);
    const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ventas.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // columnas + iconos de sort
  const columns: { label: string; key: keyof Venta }[] = [
    { label: "ID", key: "id" },
    { label: "Fecha", key: "fecha" },
    { label: "Cliente", key: "cliente_id" },
    { label: "Vendedor", key: "usuario_id" },
    { label: "Total", key: "total" },
    { label: "Estado", key: "estado" },
    { label: "Pago", key: "forma_pago" },
  ];
  const renderSortIcon = (key: keyof Venta) =>
    sortConfig?.key === key ? (
      sortConfig.direction === "asc" ? (
        <ChevronUp className="inline ml-1 h-4 w-4" />
      ) : (
        <ChevronDown className="inline ml-1 h-4 w-4" />
      )
    ) : null;

  return (
    <div className="p-6 space-y-6">
      
  {/* GRID RESPONSIVO: 4 o 5 columnas según tamaño de pantalla */}
     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 py-4">
       {/* KPICards renderiza 4 cards: Total, Importe, Ticket, Estados */}
       <KPICards ventas={ventas} />
       {/* Y aquí la tarjeta de la gráfica */}
       <SalesChartCard data={chartData} />
     </div>

      {/* Tabs/Listado */}
      <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between mb-2">

        <TabsList>
          <TabsTrigger value="listado">📋 Listado</TabsTrigger>
          <TabsTrigger value="detalle" disabled={!selected}> 👁️ Detalle</TabsTrigger>
          <TabsTrigger value="trazabilidad" disabled={!selected}>⏱️ Trazabilidad</TabsTrigger>
        </TabsList>
        
      {/* CSV / Imprimir */}
            <div className="flex space-x-2">
      <Button onClick={handleExportCSV} size="sm" variant="outline" className="flex items-center px-3 py-1.5 bg-black hover:bg-gray-900 text-white rounded text-sm">
        <Download className="mr-1 h-4 w-4"/> CSV
      </Button>
      <Button onClick={() => window.print()} size="sm" variant="outline">
        <Printer className="mr-1 h-4 w-4"/> Imprimir
      </Button>
       <Link href="/dashboard/ventas">
                <Button variant="outline">Regresar a Ventas</Button>
              </Link>
    </div>
  </div>

        <TabsContent value="listado" className="space-y-4 pt-4">
          <VentaFilters
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            stateFilter={stateFilter}
            onStateChange={setStateFilter}
            clienteFilter={clienteFilter}
            onClienteChange={setClienteFilter}
            usuarioFilter={usuarioFilter}
            onUsuarioChange={setUsuarioFilter}
            minTotal={minTotal}
            onMinTotalChange={setMinTotal}
            maxTotal={maxTotal}
            onMaxTotalChange={setMaxTotal}
            paymentFilter={paymentFilter}
            onPaymentChange={setPaymentFilter}
          />

          <div className="overflow-auto rounded-md border bg-white shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map(({ label, key }) => (
                    <TableHead
                      key={key}
                      className="cursor-pointer"
                      onClick={() =>
                        setSortConfig((curr) =>
                          curr?.key === key
                            ? { key, direction: curr.direction === "asc" ? "desc" : "asc" }
                            : { key, direction: "asc" }
                        )
                      }
                    >
                      {label}
                      {renderSortIcon(key)}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>{new Date(v.fecha).toLocaleString()}</TableCell>
                    <TableCell>{v.cliente_id ?? "-"}</TableCell>
                    <TableCell>{v.usuario_id ?? "-"}</TableCell>
                    <TableCell>
                      ${(parseFloat(v.total || "0") || 0).toFixed(2)}
                    </TableCell>
                    {/* Estado: sólo badge */}
                    <TableCell>
                      <Badge
                        variant={
                          v.estado === "pagado"
                            ? "success"
                            : v.estado === "cancelado"
                            ? "destructive"
                            : "warning"
                        }
                      >
                        {v.estado ?? "-"}
                      </Badge>
                    </TableCell>
                    {/* Pago: badge */}
                    <TableCell>
                      <Badge variant="secondary">
                        {v.forma_pago ?? "-"}
                      </Badge>
                    </TableCell>

                    {/* Acciones con menú ⋯ que incluye “Cambiar Estado” */}
                    <TableCell className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetail(v)}>
                                              <Eye className="h-5 w-5"/>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleViewTrazability(v)}>
                                              <Clock className="h-5 w-5"/>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(v)}>
                                              <Edit className="h-5 w-5"/>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleRefund(v)}>
                                              <CornerUpLeft className="h-5 w-5"/>
                                            </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                       
                          <DropdownMenuItem onSelect={() => handleRefund(v)}>
                            <CornerUpLeft className="mr-2 h-4 w-4" /> Devolver
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs">
                            Cambiar Estado
                          </DropdownMenuLabel>
                          {ESTADOS.map((e) => (
                            <DropdownMenuItem
                              key={e}
                              onSelect={() => changeEstado(v.id, e)}
                            >
                              {e.charAt(0).toUpperCase() + e.slice(1)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <VentaPagination
            pageIndex={pageIndex}
            totalPages={totalPages}
            onPageChange={setPageIndex}
          />
        </TabsContent>

          <TabsContent value="detalle" className="pt-4">
            {selected && (
              <VentaDetalle
                venta={selected}
                detalles={detalles}
              />
            )}
          </TabsContent>

        <TabsContent value="trazabilidad" className="pt-4">
          {selected && <VentaTrazabilidad venta={selected} logs={logs} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
