"use client";

import { useEffect, useState } from "react";
import { getProductos } from "@/lib/fetchers/productos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import TablaVenta from "@/components/TablaVenta";
import FormaPago from "@/components/FormaPago";
import { generarTicketPDF } from "@/app/utils/generarTicket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductoVenta {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
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

  // NUEVO: control de descuento y usuario vendedor
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
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [venta]);

  const agregarProducto = (producto: any) => {
    setVenta((prev) => {
      const index = prev.findIndex((i) => i.producto.id === producto.id);
      if (index >= 0) {
        const nuevaVenta = [...prev];
        nuevaVenta[index].cantidad += 1;
        return nuevaVenta;
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

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
      if (confirmar) {
        const ventaFormateada: ProductoVenta[] = venta.map((v) => ({
          id: v.producto.id,
          nombre: v.producto.nombre,
          precio: parseFloat(v.producto.producto_ubicaciones?.[0]?.precio?.precio_venta || "0"),
          cantidad: v.cantidad,
        }));
        agregarVentaPendiente(ventaFormateada);
      } else {
        const continuar = confirm("¿Deseas descartar la venta actual?");
        if (!continuar) return;
      }
    }
    setVenta(productos.map((p) => ({ producto: productos.find(x => x.id === p.id) || p, cantidad: p.cantidad })));
  };

  const eliminarVentaPendiente = (id: string) => {
    setVentasPendientes((prev) => prev.filter((venta) => venta.id !== id));
  };

  const subtotal = venta.reduce((acc, item) => {
    const precio = parseFloat(item.producto.producto_ubicaciones?.[0]?.precio?.precio_venta || "0");
    return acc + precio * item.cantidad;
  }, 0);

  const total = subtotal - descuento;

  const productosFiltrados = productos.filter((p) => {
    const nombre = p.nombre?.toLowerCase() || "";
    const codigos = p.etiqueta_producto?.map((e: any) => e.alias?.toLowerCase()) || [];
    const criterio = busqueda.toLowerCase();
    return nombre.includes(criterio) || codigos.some((c: string) => c.includes(criterio));
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  const handleCobrar = () => {
    setMostrarModal(false);
    const ventaFormateada = venta.map((item) => ({
      nombre: item.producto.nombre,
      cantidad: item.cantidad,
      precio_unitario: parseFloat(item.producto.producto_ubicaciones?.[0]?.precio?.precio_venta || "0"),
    }));
    const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
    generarTicketPDF(ventaFormateada, pagos, total, totalPagado);
    setVenta([]);
    setPagos([]);
    setCliente("");
    setVendedor("");
    setDescuento(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <div className="flex gap-2 mb-6">
          <Input placeholder="Código o nombre" className="w-full" value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }} />
          <Button onClick={() => setPaginaActual(1)}>Buscar</Button>
        </div>
        <ScrollArea className="h-[600px] pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {productosPaginados.map((producto) => {
              const precio = parseFloat(producto.producto_ubicaciones?.[0]?.precio?.precio_venta || "0");
              const stock = parseFloat(producto.producto_ubicaciones?.[0]?.inventario?.stock_actual || "0");
              return (
                <Card key={producto.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => agregarProducto(producto)}>
                  <CardContent className="flex flex-col items-center p-4 space-y-2">
                    <img src={producto.fotos?.[0]?.url_archivo || "/default-product.jpg"} alt={producto.nombre} className="h-24 object-contain" />
                    <h3 className="text-center font-semibold text-sm">{producto.nombre}</h3>
                    <p className="text-xs text-muted-foreground">${precio.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Stock: {stock}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <Button key={i + 1} size="sm" variant={paginaActual === i + 1 ? "default" : "outline"} onClick={() => setPaginaActual(i + 1)}>{i + 1}</Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md shadow-md p-6 flex flex-col justify-between h-[700px]">
        <div className="space-y-3">
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
            productos={venta.map((v) => ({
              id: v.producto.id,
              nombre: v.producto.nombre,
              precio: parseFloat(v.producto.producto_ubicaciones?.[0]?.precio?.precio_venta || "0"),
              cantidad: v.cantidad,
            }))}
            setProductos={(items) => {
              setVenta(items.map((i) => ({
                producto: productos.find((p) => p.id === i.id),
                cantidad: i.cantidad,
              })));
            }}
            agregarVentaPendiente={agregarVentaPendiente}
            ventasPendientes={ventasPendientes}
            cargarVentaPendiente={cargarVentaPendiente}
            eliminarVentaPendiente={eliminarVentaPendiente}
          />
          <div className="pt-4">
            <Dialog open={mostrarModal} onOpenChange={setMostrarModal}>
              <DialogTrigger asChild>
                <Button className="w-full" disabled={venta.length === 0}>
                  Cobrar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Formas de pago</DialogTitle>
                </DialogHeader>
                <FormaPago
                  total={total}
                  pagos={pagos}
                  setPagos={setPagos}
                  onCobrar={handleCobrar}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
