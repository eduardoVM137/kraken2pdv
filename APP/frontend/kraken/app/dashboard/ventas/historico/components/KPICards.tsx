"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface Venta {
  total: string | null;
  estado: string | null;
}

interface Props {
  ventas: Venta[];
}

export default function KPICards({ ventas }: Props) {
  const totalVentas = ventas.length;
  const sumaImportes = ventas.reduce(
    (sum, v) => sum + (parseFloat(v.total || "0") || 0),
    0
  );
  const ticketPromedio = totalVentas
    ? (sumaImportes / totalVentas).toFixed(2)
    : "0.00";

  const pendientes = ventas.filter((v) => v.estado === "pendiente").length;
  const pagadas = ventas.filter((v) => v.estado === "pagado").length;
  const canceladas = ventas.filter((v) => v.estado === "cancelado").length;
  const devueltas = ventas.filter((v) => v.estado === "devuelto").length;

  const baseCard = "bg-white border border-gray-300 rounded shadow-sm p-4 h-52 flex flex-col";
  const titleCls = "text-xs font-semibold uppercase text-gray-600";
  const valueCls = "text-2xl font-bold text-gray-900";

  return (
    <>
      <Card className={baseCard}>
        <CardHeader className="p-0 mb-2">
          <CardTitle className={titleCls}>Total Ventas</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex items-center">
          <p className={valueCls}>{totalVentas}</p>
        </CardContent>
      </Card>

      <Card className={baseCard}>
        <CardHeader className="p-0 mb-2">
          <CardTitle className={titleCls}>Importe Total</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex items-center">
          <p className={valueCls}>S/ {sumaImportes.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card className={baseCard}>
        <CardHeader className="p-0 mb-2">
          <CardTitle className={titleCls}>Ticket Prom.</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex items-center">
          <p className={valueCls}>S/ {ticketPromedio}</p>
        </CardContent>
      </Card>

      <Card className={baseCard + " overflow-y-auto"}>
        <CardHeader className="p-0 mb-2">
          <CardTitle className={titleCls}>Estados</CardTitle>
        </CardHeader>
        <CardContent className="p-0 text-sm text-gray-700 space-y-1">
          <ul className="list-disc list-inside">
            <li>Pendientes: {pendientes}</li>
            <li>Pagadas: {pagadas}</li>
            <li>Canceladas: {canceladas}</li>
            <li>Devueltas: {devueltas}</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
