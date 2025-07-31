// app/dashboard/ventas/historico/components/VentaTrazabilidad.tsx
"use client";

import { FC } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type Venta = {
  id: number;
  estado: string;
};

type DetalleVenta = {
  id: number;
  cantidad: string;
  precio_venta: string;
  subtotal: string;
};

type StateLog = {
  id: number;
  estado: string;
  fecha: string;
};

interface Props {
  venta: Venta;
  detalles: DetalleVenta[];
  logs: StateLog[];
}

const VentaTrazabilidad: FC<Props> = ({ venta, detalles, logs }) => (
  <div className="space-y-6">
    <h2 className="text-lg font-semibold">
      Venta #{venta.id} — {venta.estado}
    </h2>

    {/* Detalle de líneas */}
    <div>
      <h3 className="font-medium mb-2">Detalle de Venta</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cant.</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {detalles.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.id}</TableCell>
              <TableCell>{d.cantidad}</TableCell>
              <TableCell>
                ${parseFloat(d.precio_venta).toFixed(2)}
              </TableCell>
              <TableCell>
                ${parseFloat(d.subtotal).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {/* Historial de estados */}
    <div>
      <h3 className="font-medium mb-2">Historial de Estados</h3>
      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay cambios registrados.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell>
                  {new Date(l.fecha).toLocaleString()}
                </TableCell>
                <TableCell>{l.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  </div>
);

export default VentaTrazabilidad;
