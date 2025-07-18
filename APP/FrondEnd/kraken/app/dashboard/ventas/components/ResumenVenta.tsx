"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import TablaVenta from "@/components/TablaVenta";
import ModalCobro from "./ModalCobro";

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
  agregarVentaPendiente: () => void;
  cargarVentaPendiente: (v: VentaPendiente) => void;
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

  const [showPendientes, setShowPendientes] = useState(true);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Cabecera */}
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

      {/* Ventas pendientes */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Ventas pendientes</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPendientes((s) => !s)}
          >
            {showPendientes ? "Ocultar" : "Mostrar"}
          </Button>
        </div>
        {showPendientes && (
          <div className="max-h-24 overflow-y-auto mb-4">
            <div className="flex flex-wrap gap-2">
              {ventasPendientes.map((p) => (
                <Badge
                  key={p.id}
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() => {
                    if (
                      venta.length > 0 &&
                      !window.confirm(
                        "Cargar esta venta pendiente borrará la nota actual. ¿Continuar?"
                      )
                    )
                      return;
                    cargarVentaPendiente(p);
                  }}
                >
                  <span className="truncate max-w-[120px]">
                    {p.timestamp}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-red-600 p-0 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          "¿Seguro que deseas eliminar esta venta pendiente?"
                        )
                      ) {
                        eliminarVentaPendiente(p.id);
                      }
                    }}
                  >
                    ✕
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabla de venta */}
      <ScrollArea className="flex-1 min-h-0 px-4">
        <TablaVenta
          productos={venta}
          setProductos={setVenta}
          agregarVentaPendiente={() => agregarVentaPendiente()}
        />
      </ScrollArea>

      {/* Botón de Cobrar */}
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
