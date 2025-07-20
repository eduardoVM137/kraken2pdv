// app/dashboard/ventas/historico/components/VentaDetalle.tsx
"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export interface Detalle {
  id: number;
  detalle_producto_id: number;
  cantidad: string;
  precio_venta: string;
  subtotal: string;
}

interface Props {
  detalles: Detalle[];
}

export default function VentaDetalle({ detalles }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Detalle de Venta</h2>
      <div className="overflow-auto rounded-md border bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detalles.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell>{d.detalle_producto_id}</TableCell>
                <TableCell>{d.cantidad}</TableCell>
                <TableCell>
                  ${(parseFloat(d.precio_venta) || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  ${(parseFloat(d.subtotal) || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
