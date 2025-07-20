// app/dashboard/ventas/historico/components/VentaFilters.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

const ALL_STATES = ["pendiente", "pagado", "cancelado", "devuelto"] as const;

export type VentaFiltersProps = {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  stateFilter: string[];
  onStateChange: (arr: string[]) => void;
  clienteFilter: string;
  onClienteChange: (v: string) => void;
  vendedorFilter: string;
  onVendedorChange: (v: string) => void;
  minTotal: string;
  onMinTotalChange: (v: string) => void;
  maxTotal: string;
  onMaxTotalChange: (v: string) => void;
  paymentFilter: string;
  onPaymentChange: (v: string) => void;
};

export default function VentaFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  stateFilter,
  onStateChange,
  clienteFilter,
  onClienteChange,
  vendedorFilter,
  onVendedorChange,
  minTotal,
  onMinTotalChange,
  maxTotal,
  onMaxTotalChange,
  paymentFilter,
  onPaymentChange,
}: VentaFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleState = (s: string) =>
    onStateChange(
      stateFilter.includes(s)
        ? stateFilter.filter((x) => x !== s)
        : [...stateFilter, s]
    );

  return (
    <div className="space-y-4">
      {/* --> Filtros básicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Desde</label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.currentTarget.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Hasta</label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.currentTarget.value)}
          />
        </div>
        <div className="flex items-center">
          <Button
            variant="link"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            {showAdvanced ? "Ocultar filtros" : "Más filtros"}
          </Button>
        </div>
      </div>

      {/* --> Filtros avanzados (colapsable) */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-opacity duration-200">
          {/* Estados */}
          <div>
            <label className="block text-sm mb-1">Estados</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {stateFilter.length
                    ? stateFilter.join(", ")
                    : "Seleccionar estados"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filtrar estados</DropdownMenuLabel>
                {ALL_STATES.map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    checked={stateFilter.includes(s)}
                    onCheckedChange={() => toggleState(s)}
                  >
                    {s}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-sm mb-1">Cliente</label>
            <Input
              value={clienteFilter}
              onChange={(e) => onClienteChange(e.currentTarget.value)}
              placeholder="ID o nombre"
            />
          </div>

          {/* Vendedor */}
          <div>
            <label className="block text-sm mb-1">Vendedor</label>
            <Input
              value={vendedorFilter}
              onChange={(e) => onVendedorChange(e.currentTarget.value)}
              placeholder="ID o nombre"
            />
          </div>

          {/* Total min/max */}
          <div>
            <label className="block text-sm mb-1">Total (min / max)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={minTotal}
                onChange={(e) =>
                  onMinTotalChange(e.currentTarget.value)
                }
                placeholder="0.00"
              />
              <Input
                type="number"
                value={maxTotal}
                onChange={(e) =>
                  onMaxTotalChange(e.currentTarget.value)
                }
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Forma de pago */}
          <div className="md:col-span-2 lg:col-span-2">
            <label className="block text-sm mb-1">Forma de pago</label>
            <Select
              value={paymentFilter}
              onValueChange={onPaymentChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Efectivo">Efectivo</SelectItem>
                <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                <SelectItem value="Transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
