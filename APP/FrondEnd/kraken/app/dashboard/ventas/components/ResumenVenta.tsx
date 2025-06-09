"use client";
import { Input } from "@/components/ui/input";
import TablaVenta from "@/components/TablaVenta";
import { ProductoVenta, VentaPendiente } from "../types";

interface Props {
  cliente: string;
  setCliente: (value: string) => void;
  vendedor: string;
  setVendedor: (value: string) => void;
  descuento: number;
  setDescuento: (value: number) => void;
  subtotal: number;
  venta: ProductoVenta[];
  setVenta: (venta: ProductoVenta[]) => void;
  ventasPendientes: VentaPendiente[];
  agregarVentaPendiente: (productos: ProductoVenta[]) => void;
  cargarVentaPendiente: (productos: ProductoVenta[]) => void;
  eliminarVentaPendiente: (id: string) => void;
}

export default function ResumenVenta({
  cliente, setCliente, vendedor, setVendedor, descuento, setDescuento,
  subtotal, venta, setVenta, ventasPendientes,
  agregarVentaPendiente, cargarVentaPendiente, eliminarVentaPendiente
}: Props) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Resumen de venta</h2>
      <div className="flex gap-2">
        <Input placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
        <Input placeholder="Vendedor" value={vendedor} onChange={(e) => setVendedor(e.target.value)} />
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-sm">Descuento:</label>
        <Input
          type="number"
          value={descuento}
          min={0}
          onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">Subtotal: ${subtotal.toFixed(2)}</span>
      </div>
      <TablaVenta
        productos={venta}
        setProductos={setVenta}
        agregarVentaPendiente={agregarVentaPendiente}
        ventasPendientes={ventasPendientes}
        cargarVentaPendiente={cargarVentaPendiente}
        eliminarVentaPendiente={eliminarVentaPendiente}
      />
    </>
  );
}
