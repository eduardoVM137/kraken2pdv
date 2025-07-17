// app/dashboard/ventas/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getProductos, buscarProductosPorAlias } from "@/lib/fetchers/ventas";
import GridProducto from "./components/GridProducto";
import BuscadorProductos from "./components/BuscadorProductos";
import ResumenVenta from "./components/ResumenVenta";
import { generarTicketPDF } from "@/app/utils/generarTicket";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export default function VentasPage() {
  // ─── Estados ──────────────────────────
  const [productos, setProductos] = useState<any[]>([]);
  const [productosOriginales, setProductosOriginales] = useState<any[]>([]);
  const [venta, setVenta] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [buscarPorAlias, setBuscarPorAlias] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);

  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [pagos, setPagos] = useState<{ metodo: string; monto: number }[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  // ─── Carga inicial de productos ────────
  useEffect(() => {
    getProductos()
      .then((data) => {
        setProductos(data);
        setProductosOriginales(data);
      })
      .catch(console.error);
  }, []);

  // ─── Filtrar por nombre o alias ────────
  useEffect(() => {
    const termino = busqueda.trim().toLowerCase();
    if (buscarPorAlias && termino !== "") {
      buscarProductosPorAlias(termino)
        .then(setProductos)
        .catch(console.error);
    } else if (termino === "") {
      setProductos(productosOriginales);
    }
  }, [busqueda, buscarPorAlias, productosOriginales]);

  // ─── Agregar producto al carrito ───────
  const handleAgregarProducto = (p: any) => {
    setVenta((prev) => {
      const idx = prev.findIndex(
        (x) =>
          x.id === p.id && x.presentacion_id === p.presentacion_id
      );
      if (idx >= 0) {
        const copia = [...prev];
        copia[idx].cantidad += p.cantidad;
        return copia;
      }
      return [...prev, p];
    });
  };

  // ─── Cálculo de subtotal y total ──────
  const subtotal = venta.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const total = subtotal - descuento;

  // ─── Manejar cobro ─────────────────────
  const handleCobrar = () => {
    setMostrarModal(false);
    const totalPagado = pagos.reduce((s, p) => s + p.monto, 0);
    generarTicketPDF(venta, pagos, total, totalPagado);

    // limpiar estado
    setVenta([]);
    setPagos([]);
    setCliente("");
    setVendedor("");
    setDescuento(0);
  };

  return (
        <div className="flex h-screen">
    <ResizablePanelGroup
      direction="horizontal"
      className="flex h-[100dvh] overflow-hidden"
    >
      {/* ─── Panel Productos (75%) ─── */}
      <ResizablePanel
        defaultSize={65}
        minSize={50}
        className="h-full min-h-0"
      >
        <div className="flex flex-col h-full min-h-0 p-6 bg-gray-50">
          <BuscadorProductos
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            buscarPorAlias={buscarPorAlias}
            setBuscarPorAlias={setBuscarPorAlias}
            setPaginaActual={setPaginaActual}
          />

           <div className="flex-1 min-h-0 overflow-y-auto">
                <ScrollArea className="flex-1 min-h-0">
              <GridProducto
                productos={productos}
                onAgregar={handleAgregarProducto}
                busqueda={busqueda}
                paginaActual={paginaActual}
                setPaginaActual={setPaginaActual}
                buscarPorAlias={buscarPorAlias}
              />
            </ScrollArea>
          </div>
          
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* ─── Panel Resumen (25%) ─── */}
      <ResizablePanel
        defaultSize={35}
        minSize={15}
        className="h-full min-h-0 hidden lg:block"
      >
        <div className="flex flex-col h-full min-h-0 bg-white">
          <ResumenVenta
            cliente={cliente}
            setCliente={setCliente}
            vendedor={vendedor}
            setVendedor={setVendedor}
            descuento={descuento}
            setDescuento={setDescuento}
            subtotal={subtotal}
            venta={venta}
            setVenta={setVenta}
            ventasPendientes={[]}
            agregarVentaPendiente={() => {}}
            cargarVentaPendiente={() => {}}
            eliminarVentaPendiente={() => {}}
            mostrarModal={mostrarModal}
            setMostrarModal={setMostrarModal}
            total={total}
            pagos={pagos}
            setPagos={setPagos}
            handleCobrar={handleCobrar}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup></div>
  );
}
