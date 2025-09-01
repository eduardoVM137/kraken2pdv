// app/dashboard/compras/historico/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import CompraDetalle from "./CompraDetalle";
import Link from "next/link";

interface Compra {
  id: number;
  usuario_id: number | null;
  proveedor_id: number | null;
  fecha: string;
  total: number;
  metodo_pago: string;
  comprobante: string;
  iva: number;
  pagado: boolean;
  estado: string;
  usuario?: string;
  proveedor?: string;
}

interface Detalle {
  detalle_ingreso_id: number;
  detalle_producto_id: number;
  nombre_calculado: string;
  cantidad: string;
  precio_venta: string;
  iva: string;
}

export default function HistoricoComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroFecha, setFiltroFecha] = useState("");

  const [selected, setSelected] = useState<Compra | null>(null);
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [tab, setTab] = useState<"listado" | "detalle">("listado");

  useEffect(() => {
    fetch("http://localhost:3001/api/ingreso")
      .then((res) => res.json())
      .then((json) => {
        const raw = Array.isArray(json) ? json : json.data;
        const lista = raw.map((c: any) => ({
          ...c,
          total: parseFloat(c.total),
          iva: parseFloat(c.iva),
        }));
        setCompras(lista);
      });
  }, []);

  const handleViewDetail = async (compra: Compra) => {
    setSelected(compra);
    setTab("detalle");
    const res = await fetch(`http://localhost:3001/api/ingreso/detalle/${compra.id}`);
    const data = await res.json();
    setDetalles(data.detalles || []);
  };

  const comprasFiltradas = useMemo(() => {
    return compras.filter((c) => {
      const okProv =
        filtroProveedor === "" ||
        (c.proveedor ?? "")
          .toString()
          .toLowerCase()
          .includes(filtroProveedor.toLowerCase()) ||
        String(c.proveedor_id).includes(filtroProveedor);

      const okEst = filtroEstado === "todos" || (c.estado ?? "").toLowerCase() === filtroEstado;

      const okFecha = filtroFecha === "" || c.fecha.startsWith(filtroFecha);

      return okProv && okEst && okFecha;
    });
  }, [compras, filtroProveedor, filtroEstado, filtroFecha]);

  return (
    <div className="p-6 space-y-6">
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="listado">📋 Listado</TabsTrigger>
            <TabsTrigger value="detalle" disabled={!selected}>👁️ Detalle</TabsTrigger>
          </TabsList>

          <Link href="/dashboard/compras">
            <Button variant="outline">← Volver a Compras</Button>
          </Link>
        </div>

        <TabsContent value="listado" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-sm">Proveedor</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={filtroProveedor}
                onChange={(e) => setFiltroProveedor(e.target.value)}
                placeholder="ID o nombre"
              />
            </div>
            <div>
              <label className="text-sm">Estado</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Fecha</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-auto rounded-md border bg-white shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Comprobante</TableHead>
                  <TableHead>IVA</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comprasFiltradas.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{new Date(c.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{c.usuario ?? c.usuario_id}</TableCell>
                    <TableCell>${c.total.toFixed(2)}</TableCell>
                    <TableCell>{c.proveedor ?? c.proveedor_id}</TableCell>
                    <TableCell>{c.metodo_pago}</TableCell>
                    <TableCell>{c.comprobante}</TableCell>
                    <TableCell>{c.iva.toFixed(2)}%</TableCell>
                    <TableCell>{c.pagado ? "Sí" : "No"}</TableCell>
                    <TableCell>{c.estado}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(c)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="detalle" className="pt-4">
          {selected && <CompraDetalle compra={selected} detalles={detalles} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
