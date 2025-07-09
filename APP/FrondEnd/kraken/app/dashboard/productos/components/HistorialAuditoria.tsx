"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/custom/DateRangePicker"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface MovimientoStock {
  id: number
  cantidad: string
  precio_costo: string
  tipo_movimiento: string
  motivo: string
  fecha: string
}

interface MovimientoPrecio {
  id: number
  precio_venta: string
  precio_base: string
  tipo_movimiento: string
  motivo: string
  fecha: string
}

interface Props {
  detalleProductoId: number
  movimientos: {
    movimientos_stock: MovimientoStock[]
    movimientos_precio: MovimientoPrecio[]
  }
}

export default function HistorialAuditoria({ detalleProductoId, movimientos }: Props) {
  const [tipoMovimiento, setTipoMovimiento] = useState("todos")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const movimientos_stock = movimientos.movimientos_stock ?? []
  const movimientos_precio = movimientos.movimientos_precio ?? []

  const tiposUnicos = useMemo(() => {
    const tipos = new Set(movimientos_stock.map(m => m.tipo_movimiento))
    return Array.from(tipos)
  }, [movimientos_stock])

  const stockFiltrado = useMemo(() => {
    return movimientos_stock.filter(mov => {
      const matchTipo = tipoMovimiento === "todos" || mov.tipo_movimiento === tipoMovimiento
      const matchFecha =
        !dateRange?.from ||
        !dateRange?.to ||
        (new Date(mov.fecha) >= dateRange.from && new Date(mov.fecha) <= dateRange.to)
      return matchTipo && matchFecha
    })
  }, [movimientos_stock, tipoMovimiento, dateRange])

  const limpiarFiltros = () => {
    setTipoMovimiento("todos")
    setDateRange(undefined)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* FILTROS */}
      <Card className="p-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 shadow-sm">
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-medium text-muted-foreground">Tipo de movimiento</label>
          <Select onValueChange={setTipoMovimiento} value={tipoMovimiento}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {tiposUnicos.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-muted-foreground">Rango de fechas</label>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        <div className="flex justify-start md:justify-end w-full md:w-auto">
          <Button variant="outline" onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        </div>
      </Card>

      {/* MOVIMIENTOS DE STOCK */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-blue-600">Movimientos de Stock</h3>
          {stockFiltrado.length > 0 && (
            <span className="text-sm text-muted-foreground">
              Mostrando {stockFiltrado.length} de {movimientos_stock.length}
            </span>
          )}
        </div>

        {stockFiltrado.length > 0 ? (
          <div className="overflow-x-auto rounded-md border shadow-sm">
            <table className="min-w-full table-auto text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Costo</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stockFiltrado.map((mov) => (
                  <tr key={mov.id} className="hover:bg-accent">
                    <td className="p-3">{format(new Date(mov.fecha), "dd/MM/yyyy HH:mm")}</td>
                    <td className="p-3">{mov.cantidad}</td>
                    <td className="p-3">${mov.precio_costo}</td>
                    <td className="p-3">{mov.tipo_movimiento}</td>
                    <td className="p-3">{mov.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No hay movimientos de stock registrados.</p>
        )}
      </div>

      {/* MOVIMIENTOS DE PRECIO */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-green-600">Movimientos de Precio</h3>
        {movimientos_precio.length > 0 ? (
          <div className="overflow-x-auto rounded-md border shadow-sm">
            <table className="min-w-full table-auto text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Precio Venta</th>
                  <th className="p-3">Precio Base</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {movimientos_precio.map((mov) => (
                  <tr key={mov.id} className="hover:bg-accent">
                    <td className="p-3">{format(new Date(mov.fecha), "dd/MM/yyyy HH:mm")}</td>
                    <td className="p-3">${mov.precio_venta}</td>
                    <td className="p-3">${mov.precio_base}</td>
                    <td className="p-3">{mov.tipo_movimiento}</td>
                    <td className="p-3">{mov.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No hay movimientos de precio registrados.</p>
        )}
      </div>
    </div>
  )
}
