// app/dashboard/ventas/historico/components/KPICards.tsx
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
    (acc, v) => acc + (parseFloat(v.total || "0") || 0),
    0
  );
  const ticketPromedio = totalVentas
    ? (sumaImportes / totalVentas).toFixed(2)
    : "0.00";
  const pendientes = ventas.filter((v) => v.estado === "pendiente").length;
  const pagadas = ventas.filter((v) => v.estado === "pagado").length;
  const canceladas = ventas.filter((v) => v.estado === "cancelado").length;
  const devueltas = ventas.filter((v) => v.estado === "devuelto").length;

  // Clase común de tarjeta compacta
  const base = "bg-white border rounded shadow-sm p-3 h-24";

  return (
    <>
      <Card className={`${base} border-blue-600`}>
        <CardHeader className="p-0 mb-1">
          <CardTitle className="text-xs font-semibold uppercase text-blue-600">
            Total Ventas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-xl font-bold text-gray-900">{totalVentas}</p>
        </CardContent>
      </Card>

      <Card className={`${base} border-gray-600`}>
        <CardHeader className="p-0 mb-1">
          <CardTitle className="text-xs font-semibold uppercase text-gray-800">
            Importe Total
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-xl font-bold text-gray-900">
            S/ {sumaImportes.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card className={`${base} border-blue-800`}>
        <CardHeader className="p-0 mb-1">
          <CardTitle className="text-xs font-semibold uppercase text-blue-800">
            Ticket Prom.
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-xl font-bold text-gray-900">
            S/ {ticketPromedio}
          </p>
        </CardContent>
      </Card>

      <Card className={`${base} border-indigo-600`}>
        <CardHeader className="p-0 mb-1">
          <CardTitle className="text-xs font-semibold uppercase text-indigo-600">
            Estados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 text-[0.75rem] text-gray-700 space-y-0.5">
          <p>Pendientes: {pendientes}</p>
          <p>Pagadas: {pagadas}</p>
          <p>Canceladas: {canceladas}</p>
          <p>Devueltas: {devueltas}</p>
        </CardContent>
      </Card>
    </>
  );
}
