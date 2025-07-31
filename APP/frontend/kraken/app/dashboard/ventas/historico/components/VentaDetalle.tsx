// app/dashboard/ventas/historico/components/VentaDetalle.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { editarVenta } from "@/lib/fetchers/ventas";
import EntitySelect from "./EntitySelect";

export interface Detalle {
  detalle_venta_id:    number;
  detalle_producto_id: number;
  nombre_calculado:    string;
  cantidad:            string;
  precio_venta:        string;
  descuento:           string;
}

interface Props {
  venta: {
    id:         number;
    cliente_id: number | null;
    usuario_id: number | null;
    fecha:      string;
    total:      string | null;
    forma_pago: string | null;
    estado:     string | null;
  };
  detalles: Detalle[];
}

interface VentaUpdate {
  cliente_id:  number;
  usuario_id:  number;
  fecha:       string;
  total:       string;
  forma_pago:  string;
  estado:      string;
  detalles: Array<{
    id:                  number;
    detalle_producto_id: number;
    cantidad:            string;
    precio_venta:        string;
    descuento:           string;
  }>;
}

export default function VentaDetalle({ venta, detalles }: Props) {
  const [form, setForm] = useState({
    cliente_id: venta.cliente_id ?? "",
    usuario_id: venta.usuario_id ?? "",
    fecha:      venta.fecha.slice(0, 10),
    total:      venta.total ?? "0",
    forma_pago: venta.forma_pago ?? "",
    estado:     venta.estado ?? "",
  });
  const [items, setItems] = useState<Detalle[]>(detalles);

  useEffect(() => {
    setItems(detalles);
  }, [detalles]);

  const handleSave = async () => {
    const payload: VentaUpdate = {
      cliente_id: form.cliente_id as number,
      usuario_id: form.usuario_id as number,
      fecha:      form.fecha,
      total:      form.total,
      forma_pago: form.forma_pago,
      estado:     form.estado,
      detalles:   items.map((d) => ({
        id:                  d.detalle_venta_id,
        detalle_producto_id: d.detalle_producto_id,
        cantidad:            d.cantidad,
        precio_venta:        d.precio_venta,
        descuento:           d.descuento,
      })),
    };
    if (await editarVenta(venta.id, payload)) {
      alert("Guardado correctamente");
    } else {
      alert("Error al guardar");
    }
  };

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle>Editar Venta #{venta.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <EntitySelect
            label="Cliente"
            apiUrl="http://localhost:3001/api/cliente"
            value={form.cliente_id}
            onChange={(id) => setForm({ ...form, cliente_id: id })}
            placeholder="Busca por ID o nombre"
          />
          <EntitySelect
            label="Usuario"
            apiUrl="http://localhost:3001/api/usuario"
            value={form.usuario_id}
            onChange={(id) => setForm({ ...form, usuario_id: id })}
            placeholder="Busca por ID o nombre"
          />
          <div>
            <label className="block mb-1">Fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Forma de Pago</label>
            <input
              type="text"
              value={form.forma_pago}
              onChange={(e) =>
                setForm({ ...form, forma_pago: e.target.value })
              }
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
              <th className="border px-2 py-1">Descuento</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d, i) => (
              <tr key={d.detalle_venta_id}>
                <td className="border px-2 py-1">{d.nombre_calculado}</td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={d.cantidad}
                    onChange={(e) => {
                      const a = [...items];
                      a[i].cantidad = e.target.value;
                      setItems(a);
                    }}
                    className="w-20 border rounded px-1 py-0.5"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={d.precio_venta}
                    onChange={(e) => {
                      const a = [...items];
                      a[i].precio_venta = e.target.value;
                      setItems(a);
                    }}
                    className="w-20 border rounded px-1 py-0.5"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={d.descuento}
                    onChange={(e) => {
                      const a = [...items];
                      a[i].descuento = e.target.value;
                      setItems(a);
                    }}
                    className="w-20 border rounded px-1 py-0.5"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right">
          <Button onClick={handleSave}>💾 Guardar cambios</Button>
        </div>
      </CardContent>
    </Card>
  );
}
