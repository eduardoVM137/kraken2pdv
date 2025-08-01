"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EntitySelect from "@/app/dashboard/ventas/historico/components/EntitySelect";

interface Detalle {
  detalle_ingreso_id: number;
  detalle_producto_id: number;
  nombre_calculado: string;
  cantidad: string;
  precio_venta: string;
  iva: string;
}

interface Compra {
  id: number;
  usuario_id: number | null;
  proveedor_id: number | null;
  fecha: string;
  total: string;
  metodo_pago: string;
  comprobante: string;
  estado: string;
}

interface Props {
  compra: Compra;
  detalles: Detalle[];
}

export default function CompraDetalle({ compra, detalles }: Props) {
  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle>Detalle de Compra #{compra.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <EntitySelect
            label="Proveedor"
            apiUrl="http://localhost:3001/api/proveedor"
            value={compra.proveedor_id ?? ""}
            onChange={() => {}}
            placeholder="ID o nombre"
          />
          <EntitySelect
            label="Usuario"
            apiUrl="http://localhost:3001/api/usuario"
            value={compra.usuario_id ?? ""}
            onChange={() => {}}
            placeholder="ID o nombre"
          />
          <div>
            <label className="block mb-1">Fecha</label>
            <input
              type="date"
              value={compra.fecha.slice(0, 10)}
              readOnly
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Método de pago</label>
            <input
              type="text"
              value={compra.metodo_pago ?? ""}
              readOnly
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="border px-2 py-1">Producto</th>
              <th className="border px-2 py-1">Cantidad</th>
              <th className="border px-2 py-1">Precio</th>
              <th className="border px-2 py-1">IVA</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d) => (
              <tr key={d.detalle_ingreso_id}>
                <td className="border px-2 py-1">{d.nombre_calculado}</td>
                <td className="border px-2 py-1">{d.cantidad}</td>
                <td className="border px-2 py-1">${d.precio_venta}</td>
                <td className="border px-2 py-1">{d.iva}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
