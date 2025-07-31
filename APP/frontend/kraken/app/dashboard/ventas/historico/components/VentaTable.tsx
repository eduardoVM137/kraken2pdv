// app/dashboard/ventas/historico/components/VentaTable.tsx
"use client";

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
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Edit, CornerUpLeft, ChevronUp, ChevronDown } from "lucide-react";

type Venta = {
  id: number;
  fecha: string;
  cliente_id: number | null;
  usuario_id: number | null;
  total: string | null;
  estado: string | null;
  forma_pago: string | null;
};

type SortConfig = {
  key: keyof Venta;
  direction: "asc" | "desc";
} | null;

type Props = {
  ventas: Venta[];
  onViewDetail: (v: Venta) => void;
  onEdit: (v: Venta) => void;
  onRefund: (v: Venta) => void;
  sortConfig: SortConfig;
  onSortChange: (cfg: SortConfig) => void;
};

export default function VentaTable({
  ventas,
  onViewDetail,
  onEdit,
  onRefund,
  sortConfig,
  onSortChange,
}: Props) {
  const handleSort = (key: keyof Venta) => {
    if (sortConfig?.key === key) {
      // toggle direction
      onSortChange({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      onSortChange({ key, direction: "asc" });
    }
  };

  const renderSortIcon = (key: keyof Venta) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="inline-block ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="inline-block ml-1 h-4 w-4" />
    );
  };

  return (
    <div className="overflow-auto rounded-md border bg-white shadow">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              { label: "ID", key: "id" as const },
              { label: "Fecha", key: "fecha" as const },
              { label: "Cliente", key: "cliente_id" as const },
              { label: "Vendedor", key: "usuario_id" as const },
              { label: "Total", key: "total" as const },
              { label: "Estado", key: "estado" as const },
              { label: "Pago", key: "forma_pago" as const },
            ].map(({ label, key }) => (
              <TableHead key={key} className="cursor-pointer" onClick={() => handleSort(key)}>
                {label}
                {renderSortIcon(key)}
              </TableHead>
            ))}
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {ventas.map((v) => (
            <TableRow key={v.id}>
              <TableCell>{v.id}</TableCell>
              <TableCell>{new Date(v.fecha).toLocaleString()}</TableCell>
              <TableCell>{v.cliente_id ?? "-"}</TableCell>
              <TableCell>{v.usuario_id ?? "-"}</TableCell>
              <TableCell>${((parseFloat(v.total || "0") || 0).toFixed(2))}</TableCell>
              <TableCell>{v.estado ?? "-"}</TableCell>
              <TableCell>{v.forma_pago ?? "-"}</TableCell>
              <TableCell className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onViewDetail(v)}>
                      <Eye className="mr-2 h-4 w-4" /> Ver detalle
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onEdit(v)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onRefund(v)}>
                      <CornerUpLeft className="mr-2 h-4 w-4" /> Devolución
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
