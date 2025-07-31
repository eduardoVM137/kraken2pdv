"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getHistorialAuditoria } from "@/lib/fetchers/auditoria"; // ⚠️ debes crear este fetcher

export function AuditTab() {
  const [filtros, setFiltros] = useState({ productoId: "", tipo: "" });
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getHistorialAuditoria(filtros).then(setData);
  }, [filtros]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Auditoría</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="space-y-1">
            <Label>Producto</Label>
            <Input
              placeholder="ID o nombre"
              value={filtros.productoId}
              onChange={e => setFiltros(f => ({ ...f, productoId: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Tipo de cambio</Label>
            <Select
              value={filtros.tipo}
              onValueChange={v => setFiltros(f => ({ ...f, tipo: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="precio">Precio</SelectItem>
                <SelectItem value="stock">Inventario</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de cambios</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="stock" stroke="#8884d8" name="Stock" />
              <Line type="monotone" dataKey="precio" stroke="#82ca9d" name="Precio" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registro detallado</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto max-h-[400px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Motivo</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b">
                  <td>{row.fecha}</td>
                  <td>{row.tipo}</td>
                  <td>{row.cantidad ?? "-"}</td>
                  <td>{row.precio ?? "-"}</td>
                  <td>{row.motivo ?? "-"}</td>
                  <td>{row.usuario ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
