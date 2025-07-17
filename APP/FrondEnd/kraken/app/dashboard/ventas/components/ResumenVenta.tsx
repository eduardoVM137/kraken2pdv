"use client";

import { Input } from "@/components/ui/input";
import TablaVenta from "@/components/TablaVenta";
import ModalCobro from "./ModalCobro";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ProductoVenta, VentaPendiente } from "./types";

interface Props {
  cliente: string;
  setCliente: (v: string) => void;
  vendedor: string;
  setVendedor: (v: string) => void;
  descuento: number;
  setDescuento: (n: number) => void;
  subtotal: number;
  venta: ProductoVenta[];
  setVenta: (v: ProductoVenta[]) => void;
  ventasPendientes: VentaPendiente[];
  agregarVentaPendiente: (v: ProductoVenta[]) => void;
  cargarVentaPendiente: (v: ProductoVenta[]) => void;
  eliminarVentaPendiente: (id: string) => void;
  mostrarModal: boolean;
  setMostrarModal: (b: boolean) => void;
  total: number;
  pagos: { metodo: string; monto: number }[];
  setPagos: (v: any) => void;
  handleCobrar: () => void;
}

export default function ResumenVenta(props: Props) {
  const {
    cliente,
    setCliente,
    vendedor,
    setVendedor,
    descuento,
    setDescuento,
    subtotal,
    venta,
    setVenta,
    ventasPendientes,
    agregarVentaPendiente,
    cargarVentaPendiente,
    eliminarVentaPendiente,
    mostrarModal,
    setMostrarModal,
    total,
    pagos,
    setPagos,
    handleCobrar,
  } = props;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Cabecera fija */}
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Resumen de venta</h2>

        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="flex-1 min-w-[140px]"
          />
          <Input
            placeholder="Vendedor"
            value={vendedor}
            onChange={(e) => setVendedor(e.target.value)}
            className="flex-1 min-w-[140px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Descuento:</span>
          <Input
            type="number"
            value={descuento}
            min={0}
            onChange={(e) => setDescuento(Number(e.target.value) || 0)}
            className="w-24"
          />
          <span className="text-sm text-muted-foreground">
            Subtotal: ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Lista con scroll */}
      <ScrollArea className="flex-1 min-h-0 px-4">
        <TablaVenta
          productos={venta}
          setProductos={setVenta}
          agregarVentaPendiente={agregarVentaPendiente}
          ventasPendientes={ventasPendientes}
          cargarVentaPendiente={cargarVentaPendiente}
          eliminarVentaPendiente={eliminarVentaPendiente}
        />
      </ScrollArea>

      {/* Botón de Cobrar siempre al fondo */}
      <div className="sticky bottom-0 p-4 border-t bg-white z-10">
        <ModalCobro
          open={mostrarModal}
          setOpen={setMostrarModal}
          total={total}
          pagos={pagos}
          setPagos={setPagos}
          handleCobrar={handleCobrar}
          disabled={venta.length === 0}
        />
      </div>
    </div>
  );
}
