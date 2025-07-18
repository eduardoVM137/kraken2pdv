// app/dashboard/ventas/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getProductos, buscarProductosPorAlias, crearVenta } from "@/lib/fetchers/ventas";
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

  // ─── Múltiples ventas pendientes ───────
  const [ventasPendientes, setVentasPendientes] = useState<any[]>([]);

  // Al montar cargamos ventas pendientes
  useEffect(() => {
    const stored = localStorage.getItem("ventasPendientes");
    if (stored) {
      try {
        setVentasPendientes(JSON.parse(stored));
      } catch {
        localStorage.removeItem("ventasPendientes");
      }
    }
  }, []);

  // Para persistirlas
  const persistPendientes = (arr: any[]) => {
    setVentasPendientes(arr);
    localStorage.setItem("ventasPendientes", JSON.stringify(arr));
  };

  const agregarVentaPendiente = () => {
    const nueva = {
      id: Date.now().toString(),
      cliente,
      vendedor,
      descuento,
      productos: venta,
      timestamp: new Date().toLocaleString(),
    };
    persistPendientes([...ventasPendientes, nueva]);
  };

  const cargarVentaPendiente = (p: any) => {
    setVenta(p.productos);
    setCliente(p.cliente);
    setVendedor(p.vendedor);
    setDescuento(p.descuento);
  };

  const eliminarVentaPendiente = (id: string) => {
    const filtradas = ventasPendientes.filter((v) => v.id !== id);
    persistPendientes(filtradas);
  };

  // ─── Auto‑guardado draft ────────────────
  useEffect(() => {
    const draft = localStorage.getItem("ventaDraft");
    if (draft) {
      try {
        setVenta(JSON.parse(draft));
      } catch {
        localStorage.removeItem("ventaDraft");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ventaDraft", JSON.stringify(venta));
  }, [venta]);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if ((venta ?? []).length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [venta]);

  // ─── Fetch inicial de productos ────────
  useEffect(() => {
    getProductos()
      .then((data) => {
        setProductos(data);
        setProductosOriginales(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const t = busqueda.trim().toLowerCase();
    if (buscarPorAlias && t !== "") {
      buscarProductosPorAlias(t).then(setProductos).catch(console.error);
    } else if (t === "") {
      setProductos(productosOriginales);
    }
  }, [busqueda, buscarPorAlias, productosOriginales]);

  // ─── Agregar al carrito ─────────────────
  const handleAgregarProducto = (p: any) => {
    setVenta((prev) => {
      const idx = prev.findIndex(
        (x) => x.id === p.id && x.presentacion_id === p.presentacion_id
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
  const safeVenta = Array.isArray(venta) ? venta : [];
  const subtotal = safeVenta.reduce(
    (acc, i) => acc + i.precio * i.cantidad,
    0
  );
  const total = subtotal - descuento;
// Antes: no recibía pagos como parámetro
// const handleCobrar = async () => { … }

// Ahora:
const handleCobrar = async (pagosSeleccionados: { metodo: string; monto: number }[]) => {
  setMostrarModal(false);

  // Usamos el array que nos pasan desde el modal
  const totalPagado = pagosSeleccionados.reduce((s, p) => s + p.monto, 0);
  const pagado = totalPagado >= total;

  const payload = {
    usuario_id: 1,
    cliente_id: 1,
    forma_pago: pagosSeleccionados.map((p) => p.metodo).join(","),
    comprobante: `TKT-${Date.now()}`,
    iva: 16,
    pagado,
    estado: "pagado",
    state_id: 1,
    descuento,
    detalle: safeVenta.map((item) => ({
      detalle_producto_id: item.id,
      precio_venta: item.precio,
      cantidad: item.cantidad,
      descuento: 0,
      empleado_id: 2,
      inventario_id: item.inventarios[0],
    })),
  };

  try {
    const nuevaVenta = await crearVenta(payload);
    localStorage.removeItem("ventaDraft");
    // Imprimimos usando los pagos del modal
    generarTicketPDF(safeVenta, pagosSeleccionados, total, totalPagado, false);
    setVenta([]);
    setPagos([]);     // si quieres seguir guardando estado
    setDescuento(0);
    alert(`✅ Venta #${nuevaVenta.id} registrada!\nTotal: $${total.toFixed(2)}`);
  } catch (err: any) {
    console.error(err);
    alert("❌ No se pudo registrar la venta:\n" + err.message);
  }
};

  return (
    <div className="flex h-screen">
      <ResizablePanelGroup direction="horizontal" className="flex h-[100dvh] overflow-hidden">
        <ResizablePanel defaultSize={65} minSize={50} className="h-full min-h-0">
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

        <ResizablePanel defaultSize={35} minSize={15} className="h-full min-h-0 hidden lg:block">
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
              ventasPendientes={ventasPendientes}
              agregarVentaPendiente={agregarVentaPendiente}
              cargarVentaPendiente={cargarVentaPendiente}
              eliminarVentaPendiente={eliminarVentaPendiente}
              mostrarModal={mostrarModal}
              setMostrarModal={setMostrarModal}
              total={total}
              pagos={pagos}
              setPagos={setPagos}
              handleCobrar={handleCobrar}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
