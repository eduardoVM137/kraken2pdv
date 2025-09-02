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
  Settings,
  Printer as PrinterIcon,
} from "lucide-react";

import {
  mostrarVentas,
  getDetalleVenta,
  getTrazabilidadVenta,
  actualizarEstadosVentas,
  getClientesYEmpleados,
} from "@/lib/fetchers/ventas";
import KPICards from "./components/KPICards";
import SalesChartCard from "./components/SalesChart";
import VentaFilters from "./components/VentaFilters";
import VentaPagination from "./components/VentaPagination";
import VentaDetalle, { Detalle } from "./components/VentaDetalle";
import VentaTrazabilidad, { StateLog } from "./components/VentaTrazabilidad";

// --- impresión/ticket (mismo set que Ventas principal) ---
import { exportTicketPDF, compactPOSLines } from "@/app/utils/print-ticket-pdf";
import {
  imprimirLoteTexto,
  OpcionesImpresion,
  // puede no existir en algunos builds -> hacemos fallback local
  isVirtualPdfPrinter as _isVirtualPdfPrinter,
} from "@/app/utils/imprimir-pos";
import { generarLineasPOS } from "@/app/utils/generarTicket";

// Panel de impresoras
import PrinterPanel from "@/app/dashboard/ventas/components/settings/PrinterPanel";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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

// ===== helpers seguros =====
const safeGet = (key: string, fallback: string) => {
  if (typeof window === "undefined") return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};
const safeSet = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {}
};

// detector local si el módulo no exporta la función
const localIsVirtual = (name: string) => {
  const n = (name || "").toLowerCase();
  return /pdf|xps|onenote|edge|fax/.test(n) || n.includes("microsoft print to pdf");
};
const isVirtualPrinter =
  typeof (_isVirtualPdfPrinter as unknown) === "function"
    ? (_isVirtualPdfPrinter as (n: string) => boolean)
    : localIsVirtual;

export default function HistoricoVentasPage() {
  const router = useRouter();

  // ===== Impresoras (panel + prefs) =====
  const [showPrinters, setShowPrinters] = useState(false);
  const [panelColapsado, setPanelColapsado] = useState(false);

  const [nombreImpresora, setNombreImpresora] = useState<string>(() =>
    safeGet("posPrinterName", "")
  );
  const [tamanoPapel, setTamanoPapel] = useState<"58mm" | "80mm">(
    () => (safeGet("posPaperSize", "58mm") === "80mm" ? "80mm" : "58mm")
  );

  useEffect(() => safeSet("posPrinterName", nombreImpresora), [nombreImpresora]);
  useEffect(() => safeSet("posPaperSize", tamanoPapel), [tamanoPapel]);

  // listas para el panel (QZ + fallback)
  const [visibles, setVisibles] = useState<string[]>([]);
  const [verificadas, setVerificadas] = useState<string[]>([]);
  const [noVerificadas, setNoVerificadas] = useState<string[]>([]);
  const [cargandoPrinters, setCargandoPrinters] = useState(false);

  const refreshPrinters = async () => {
    if (typeof window === "undefined") return;
    setCargandoPrinters(true);
    try {
      const names: string[] = [];
      const qz = (window as any).qz;

      // 1) si QZ está disponible, intentamos su listado
      if (qz?.printers?.find) {
        try {
          const found = await qz.printers.find(); // array de nombres
          if (Array.isArray(found)) names.push(...found);
        } catch (e) {
          console.warn("QZ printers.find() falló:", e);
        }
      }

      // 2) fallback: si no hay QZ o devolvió vacío, dejamos arrays vacíos
      setVisibles(names);
      setVerificadas(names); // lo que devuelve QZ lo consideramos verificado
      // si el usuario tiene una impresora guardada pero QZ no la ve -> no verificada
      setNoVerificadas(
        nombreImpresora && !names.includes(nombreImpresora) ? [nombreImpresora] : []
      );
    } finally {
      setCargandoPrinters(false);
    }
  };

  // abre el panel refrescando listado (evita panel vacío)
  useEffect(() => {
    if (showPrinters) refreshPrinters();
  }, [showPrinters]);

  const seleccionDisponible =
    !nombreImpresora || verificadas.includes(nombreImpresora) || visibles.includes(nombreImpresora);
  const pos58Disponible = visibles.some((n) => /58|pos/i.test(n));

  // ===== Datos y filtros =====
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
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // paginación
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  // selección y pestañas
  const [selected, setSelected] = useState<Venta | null>(null);
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [logs, setLogs] = useState<StateLog[]>([]);
  const [tab, setTab] = useState<"listado" | "detalle" | "trazabilidad">("listado");

  // ordenamiento
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Venta;
    direction: "asc" | "desc";
  } | null>(null);

  // 1) carga inicial
  useEffect(() => {
    mostrarVentas()
      .then((data) => {
        setVentas(data);
        setFiltered(data);
      })
      .catch(console.error);
  }, []);
  useEffect(() => {
    getClientesYEmpleados()
      .then(({ clientes, usuarios }) => {
        setClientes(clientes);
        setUsuarios(usuarios);
      })
      .catch(console.error);
  }, []);

  // 2) filtros
  useEffect(() => {
    let tmp = [...ventas];
    if (dateFrom) tmp = tmp.filter((v) => new Date(v.fecha) >= new Date(dateFrom));
    if (dateTo) tmp = tmp.filter((v) => new Date(v.fecha) <= new Date(dateTo));
    if (stateFilter.length) tmp = tmp.filter((v) => v.estado && stateFilter.includes(v.estado));
    if (clienteFilter) tmp = tmp.filter((v) => String(v.cliente_id).includes(clienteFilter));
    if (usuarioFilter) tmp = tmp.filter((v) => String(v.usuario_id).includes(usuarioFilter));
    tmp = tmp.filter((v) => {
      const tot = parseFloat(v.total || "0") || 0;
      if (minTotal && tot < +minTotal) return false;
      if (maxTotal && tot > +maxTotal) return false;
      return true;
    });
    if (paymentFilter !== "todos") tmp = tmp.filter((v) => v.forma_pago === paymentFilter);
    setFiltered(tmp);
    setPageIndex(1);
  }, [ventas, dateFrom, dateTo, stateFilter, clienteFilter, usuarioFilter, minTotal, maxTotal, paymentFilter]);

  // 3) ordenar
  const sortedVentas = useMemo(() => {
    if (!sortConfig) return filtered;
    const { key, direction } = sortConfig;
    return [...filtered].sort((a, b) => {
      let v1: any = a[key],
        v2: any = b[key];
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
    const tiempos = filtered.map((v) => new Date(v.fecha).getTime());
    const minData = Math.min(...tiempos);
    const maxData = Math.max(...tiempos);
    const start = dateFrom ? new Date(dateFrom).getTime() : minData;
    const end = dateTo ? new Date(dateTo).getTime() : maxData;
    const agrupado: Record<string, number> = {};
    filtered.forEach((v) => {
      const t = new Date(v.fecha).getTime();
      if (t < start || t > end) return;
      const key = new Date(t).toLocaleDateString();
      agrupado[key] = (agrupado[key] || 0) + (parseFloat(v.total || "0") || 0);
    });
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

  // ===== REIMPRIMIR (mismo formato que handleCobrar) =====
  const handleReimprimirVenta = async (v: Venta, imprimir = true) => {
    try {
      const dets = await getDetalleVenta(v.id);

      const ventaItems = dets.map((d: any) => ({
        id: d.detalle_producto_id ?? d.id ?? 0,
        nombre: d.nombre_calculado ?? `#${d.detalle_producto_id}`,
        precio: parseFloat(d.precio_venta ?? "0"),
        cantidad: parseFloat(d.cantidad ?? "0"),
        descuento: parseFloat(d.descuento ?? "0"),
        presentacion_id: d.presentacion_id ?? undefined,
        inventarios: d.inventario_id ? [d.inventario_id] : undefined,
      }));

      const total = parseFloat(v.total || "0") || 0;
      const pagosSeleccionados =
        (v.forma_pago?.split(",").map((m) => m.trim()).filter(Boolean) ?? []).length > 0
          ? [{ metodo: v.forma_pago!, monto: total }]
          : [{ metodo: "Efectivo", monto: total }];
      const totalPagado = pagosSeleccionados.reduce((s, p) => s + p.monto, 0);

      const clienteNom =
        clientes.find((c: any) => c.id === v.cliente_id)?.nombre_usuario ??
        String(v.cliente_id ?? "-");
      const vendedorNom =
        usuarios.find((u: any) => u.id === v.usuario_id)?.nombre_usuario ??
        String(v.usuario_id ?? "-");

      const lineas = generarLineasPOS(
        ventaItems,
        pagosSeleccionados,
        total,
        totalPagado,
        false, // isCotizacion
        v.id,
        clienteNom,
        vendedorNom
      );

      const widthMm = tamanoPapel === "80mm" ? 80 : 58;

      if (imprimir) {
        if (isVirtualPrinter(nombreImpresora)) {
          exportTicketPDF(compactPOSLines(lineas), {
            widthMm,
            fileName: `TKT-${v.id}.pdf`,
            openInsteadOfDownload: true,
          });
          alert("Impresora virtual detectada. Generé un PDF para imprimir desde el visor.");
        } else {
          const opciones: OpcionesImpresion = { nombreImpresora, tamanoPapel } as any;
          try {
            await imprimirLoteTexto(lineas, opciones);
          } catch (err) {
            console.error("QZ falló, generando PDF de respaldo:", err);
            exportTicketPDF(compactPOSLines(lineas), {
              widthMm,
              fileName: `TKT-${v.id}.pdf`,
              openInsteadOfDownload: true,
            });
            alert("No se pudo imprimir por QZ. Generé un PDF de respaldo.");
          }
        }
      } else {
        exportTicketPDF(compactPOSLines(lineas), {
          widthMm,
          fileName: `TKT-${v.id}.pdf`,
          openInsteadOfDownload: true,
        });
      }

      alert(`🔁 Reimpreso ticket #${v.id}${imprimir ? "" : " (PDF abierto)"}!`);
    } catch (err: any) {
      console.error(err);
      alert("❌ No se pudo reimprimir el ticket:\n" + (err?.message ?? err));
    }
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
    const rows = filtered.map((v) => [
      v.id,
      new Date(v.fecha).toLocaleString(),
      v.cliente_id ?? "-",
      v.usuario_id ?? "-",
      (parseFloat(v.total || "0") || 0).toFixed(2),
      v.estado ?? "-",
      v.forma_pago ?? "-",
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ventas.csv";
    a.click();
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
        <KPICards ventas={ventas} />
        <SalesChartCard data={chartData} />
      </div>

      {/* Tabs/Listado */}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="listado">📋 Listado</TabsTrigger>
            <TabsTrigger value="detalle" disabled={!selected}>👁️ Detalle</TabsTrigger>
            <TabsTrigger value="trazabilidad" disabled={!selected}>⏱️ Trazabilidad</TabsTrigger>
          </TabsList>

          {/* CSV / Imprimir / Impresoras / Regresar */}
          <div className="flex space-x-2">
            <Button
              onClick={handleExportCSV}
              size="sm"
              variant="outline"
              className="flex items-center px-3 py-1.5 bg-black hover:bg-gray-900 text-white rounded text-sm"
            >
              <Download className="mr-1 h-4 w-4" /> CSV
            </Button>
            <Button onClick={() => window.print()} size="sm" variant="outline">
              <Printer className="mr-1 h-4 w-4" /> Imprimir
            </Button>
            <Button
              onClick={() => setShowPrinters(true)}
              size="sm"
              variant="outline"
              className="flex items-center"
            >
              <Settings className="mr-1 h-4 w-4" /> Impresoras
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
                    <TableCell>${(parseFloat(v.total || "0") || 0).toFixed(2)}</TableCell>
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
                    <TableCell>
                      <Badge variant="secondary">{v.forma_pago ?? "-"}</Badge>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(v)}>
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleViewTrazability(v)}>
                        <Clock className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(v)}>
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRefund(v)}>
                        <CornerUpLeft className="h-5 w-5" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleReimprimirVenta(v)}>
                            <PrinterIcon className="mr-2 h-4 w-4" /> Reimprimir
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => handleRefund(v)}>
                            <CornerUpLeft className="mr-2 h-4 w-4" /> Devolver
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs">
                            Cambiar Estado
                          </DropdownMenuLabel>
                          {ESTADOS.map((e) => (
                            <DropdownMenuItem key={e} onSelect={() => changeEstado(v.id, e)}>
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
          {selected && <VentaDetalle venta={selected} detalles={detalles} />}
        </TabsContent>

        <TabsContent value="trazabilidad" className="pt-4">
          {selected && <VentaTrazabilidad venta={selected} logs={logs} />}
        </TabsContent>
      </Tabs>

      {/* Panel lateral de impresoras */}
      <Sheet open={showPrinters} onOpenChange={setShowPrinters}>
        <SheetContent side="right" className="w-[420px] sm:w-[480px]">
          <SheetHeader>
            <SheetTitle>Configuración de impresión</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <PrinterPanel
              visibles={visibles}
              verificadas={verificadas}
              noVerificadas={noVerificadas}
              nombreImpresora={nombreImpresora}
              setNombreImpresora={setNombreImpresora}
              tamanoPapel={tamanoPapel}
              setTamanoPapel={setTamanoPapel}
              cargando={cargandoPrinters}
              pos58Disponible={pos58Disponible}
              seleccionDisponible={seleccionDisponible}
              panelColapsado={panelColapsado}
              setPanelColapsado={setPanelColapsado}
              refreshPrinters={refreshPrinters}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
