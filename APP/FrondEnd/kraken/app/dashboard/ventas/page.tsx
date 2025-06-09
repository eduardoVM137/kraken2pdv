"use client";

import { useEffect, useState } from "react";
import { getProductos } from "@/lib/fetchers/productos";
import BuscadorProductos from "./components/BuscadorProductos";
import PaginacionProductos from "./components/PaginacionProductos";
import ResumenVenta from "./components/ResumenVenta";
import ModalCobro from "./components/ModalCobro";
import { generarTicketPDF } from "@/app/utils/generarTicket";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductoCard from "./components/ProductoCard";

interface ProductoVenta {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  presentacion_id?: number;
}

interface VentaPendiente {
  id: string;
  timestamp: string;
  productos: ProductoVenta[];
}

export default function VentasPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [venta, setVenta] = useState<any[]>([]);
  const [ventasPendientes, setVentasPendientes] = useState<VentaPendiente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;
  const [pagos, setPagos] = useState<{ metodo: string; monto: number }[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [descuento, setDescuento] = useState<number>(0);
  const [vendedor, setVendedor] = useState<string>("");
  const [cliente, setCliente] = useState<string>("");

  useEffect(() => {
    getProductos().then(setProductos).catch(console.error);
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (venta.length > 0) {
        e.preventDefault();
        e.returnValue = "Tienes una venta en curso. Se perderán los cambios si sales.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [venta]);

  const productosFiltrados = productos.filter((p) => {
    const nombre = p.nombre_calculado?.toLowerCase() || "";
    const criterio = busqueda.toLowerCase();
    return nombre.includes(criterio);
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  const subtotal = venta.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const total = subtotal - descuento;

  const agregarVentaPendiente = (productos: ProductoVenta[]) => {
    const nuevaVenta: VentaPendiente = {
      id: `venta-${Date.now()}`,
      timestamp: new Date().toISOString(),
      productos: [...productos],
    };
    setVentasPendientes((prev) => [...prev, nuevaVenta]);
    setVenta([]);
  };

  const cargarVentaPendiente = (productos: ProductoVenta[]) => {
    if (venta.length > 0) {
      const confirmar = confirm("Tienes una venta en curso. ¿Deseas guardarla como pendiente antes de cargar otra?");
      if (confirmar) agregarVentaPendiente(venta);
      else {
        const continuar = confirm("¿Deseas descartar la venta actual?");
        if (!continuar) return;
      }
    }
    setVenta(productos);
  };

  const eliminarVentaPendiente = (id: string) => {
    setVentasPendientes((prev) => prev.filter((venta) => venta.id !== id));
  };

  const handleCobrar = () => {
    setMostrarModal(false);
    const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
    generarTicketPDF(venta, pagos, total, totalPagado);
    setVenta([]);
    setPagos([]);
    setCliente("");
    setVendedor("");
    setDescuento(0);
  };

  const handleAgregarProducto = (data: ProductoVenta) => {
    setVenta((prev) => {
      const index = prev.findIndex(
        (item) => item.id === data.id && item.presentacion_id === data.presentacion_id
      );
      if (index >= 0) {
        const nuevo = [...prev];
        nuevo[index].cantidad += data.cantidad;
        return nuevo;
      }
      return [...prev, data];
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <BuscadorProductos busqueda={busqueda} setBusqueda={setBusqueda} setPaginaActual={setPaginaActual} />
        <ScrollArea className="h-[600px] pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {productosPaginados.map((producto) => (
              <ProductoCard
                key={producto.detalle_producto_id + "-card"}
                producto={producto}
                onAgregar={handleAgregarProducto}
              />
            ))}
          </div>
        </ScrollArea>
        <PaginacionProductos totalPaginas={totalPaginas} paginaActual={paginaActual} setPaginaActual={setPaginaActual} />
      </div>

      <div className="bg-white rounded-md shadow-md p-6 flex flex-col justify-between h-[700px]">
        <div className="space-y-3">
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
          />
          <div className="pt-4">
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
      </div>
    </div>
  );
}
