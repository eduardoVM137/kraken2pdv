
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
  getTrazabilidadVenta,
} from "@/lib/fetchers/ventas";
import KPICards from "./components/KPICards";
import SalesChartCard from "./components/SalesChart";

import VentaFilters from "./components/VentaFilters";
import VentaPagination from "./components/VentaPagination";
import VentaDetalle, { Detalle } from "./components/VentaDetalle";
import VentaTrazabilidad, { StateLog } from "./components/VentaTrazabilidad";

interface Venta {
  id: number;
  fecha: string;
  cliente_id: number | null;
  usuario_id: number | null;
  total: string | null;
  estado: string | null;
  forma_pago: string | null;
}

export default function HistoricoVentasPage() {
  const router = useRouter();

  // — Datos y filtros —
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [filtered, setFiltered] = useState<Venta[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [clienteFilter, setClienteFilter] = useState("");
  const [vendedorFilter, setVendedorFilter] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("todos");

  // — Paginación —
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  // — Selección y pestañas —
  const [selected, setSelected] = useState<Venta | null>(null);
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [logs, setLogs] = useState<StateLog[]>([]);
  const [tab, setTab] = useState<"listado" | "detalle" | "trazabilidad">("listado");

  // — Ordenamiento —
  const [sortConfig, setSortConfig] = useState<{ key: keyof Venta; direction: "asc" | "desc" } | null>(null);

  // 1) Carga inicial
  useEffect(() => {
    mostrarVentas().then(data => {
      setVentas(data);
      setFiltered(data);
    }).catch(console.error);
  }, []);

  // 2) Filtros
  useEffect(() => {
    let tmp = [...ventas];
    if (dateFrom) tmp = tmp.filter(v => new Date(v.fecha) >= new Date(dateFrom));
    if (dateTo) tmp = tmp.filter(v => new Date(v.fecha) <= new Date(dateTo));
    if (stateFilter.length) tmp = tmp.filter(v => v.estado && stateFilter.includes(v.estado));
    if (clienteFilter) tmp = tmp.filter(v => String(v.cliente_id).includes(clienteFilter));
    if (vendedorFilter) tmp = tmp.filter(v => String(v.usuario_id).includes(vendedorFilter));
    tmp = tmp.filter(v => {
      const tot = parseFloat(v.total || "0") || 0;
      if (minTotal && tot < +minTotal) return false;
      if (maxTotal && tot > +maxTotal) return false;
      return true;
    });
    if (paymentFilter !== "todos") tmp = tmp.filter(v => v.forma_pago === paymentFilter);
    setFiltered(tmp);
    setPageIndex(1);
  }, [ventas, dateFrom, dateTo, stateFilter, clienteFilter, vendedorFilter, minTotal, maxTotal, paymentFilter]);

  // 3) Ordenar
  const sortedVentas = useMemo(() => {
    if (!sortConfig) return filtered;
    const { key, direction } = sortConfig;
    return [...filtered].sort((a, b) => {
      let v1 = a[key], v2 = b[key];
      if (typeof v1 === "string") v1 = v1.toLowerCase();
      if (typeof v2 === "string") v2 = v2.toLowerCase();
      if (v1 == null) return 1;
      if (v2 == null) return -1;
      if (v1 < v2) return direction === "asc" ? -1 : 1;
      if (v1 > v2) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortConfig]);

  // 4) Acciones
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

  // 5) Paginación
  const totalPages = Math.ceil(sortedVentas.length / pageSize);
  const pageItems = sortedVentas.slice(
    (pageIndex - 1) * pageSize,
    (pageIndex - 1) * pageSize + pageSize
  );

  // 6) CSV
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

  // Columnas y sort icons
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
 // Prepara datos agregados por fecha para la gráfica
  const chartData = useMemo(() => {
    const byDate: Record<string, number> = {};
    filtered.forEach((v) => {
      const d = new Date(v.fecha).toLocaleDateString();
      byDate[d] = (byDate[d] || 0) + (parseFloat(v.total || "0") || 0);
    });
    return Object.entries(byDate).map(([date, total]) => ({ date, total }));
  }, [filtered]);

  return (
    <div className="p-6 space-y-6"> 
  
      {/** BOTONES CSV / IMPRIMIR **/}
      <div className="flex items-center justify-end space-x-3">
        <Button
          onClick={handleExportCSV}
          className="flex items-center px-3 py-1.5 bg-black hover:bg-gray-900 text-white rounded text-sm"
        >
          <Download className="mr-2 h-4 w-4" /> CSV
        </Button>
        <Button
          onClick={() => window.print()}
          className="flex items-center px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm"
        >
          <Printer className="mr-2 h-4 w-4" /> Imprimir
        </Button>
      </div>

      {/** CARRUSEL de métricas + gráfica **/}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 3 KPIs + gráfico */}
        <KPICards ventas={ventas} /> 
      </div>


      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="listado">📋 Listado</TabsTrigger>
          <TabsTrigger value="detalle" disabled={!selected}>👁️ Detalle</TabsTrigger>
          <TabsTrigger value="trazabilidad" disabled={!selected}>⏱️ Trazabilidad</TabsTrigger>
        </TabsList>

        {/** LISTADO **/}
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
            vendedorFilter={vendedorFilter}
            onVendedorChange={setVendedorFilter}
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
                        setSortConfig(curr =>
                          curr?.key === key
                            ? { key, direction: curr.direction === "asc" ? "desc" : "asc" }
                            : { key, direction: "asc" }
                        )
                      }
                    >
                      {label}{renderSortIcon(key)}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>{new Date(v.fecha).toLocaleString()}</TableCell>
                    <TableCell>{v.cliente_id ?? "-"}</TableCell>
                    <TableCell>{v.usuario_id ?? "-"}</TableCell>
                    <TableCell>${(parseFloat(v.total || "0")||0).toFixed(2)}</TableCell>
                    <TableCell>{v.estado ?? "-"}</TableCell>
                    <TableCell>{v.forma_pago ?? "-"}</TableCell>
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
                            <MoreHorizontal className="h-5 w-5"/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => console.log("Generar reporte")}>
                            <Download className="mr-2 h-4 w-4"/> Generar Reporte
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => console.log("Enviar por correo")}>
                            <Mail className="mr-2 h-4 w-4"/> Enviar por correo
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => console.log("Ver historial completo")}>
                            <FileText className="mr-2 h-4 w-4"/> Ver Historial
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => console.log("Duplicar venta")}>
                            Duplicar venta
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <VentaPagination pageIndex={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
        </TabsContent>

        {/** DETALLE **/}
        <TabsContent value="detalle" className="pt-4">
          {selected && <VentaDetalle detalles={detalles}/>}
        </TabsContent>

        {/** TRAZABILIDAD **/}
        <TabsContent value="trazabilidad" className="pt-4">
          {selected && <VentaTrazabilidad venta={selected} logs={logs}/>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
