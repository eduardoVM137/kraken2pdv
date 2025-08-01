// app/dashboard/ventas/page.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { getProductos, buscarProductosPorAlias, crearVenta } from "@/lib/fetchers/ventas";
import GridProducto from "./components/GridProducto";
import BuscadorProductos from "./components/BuscadorProductos";
import ResumenVenta from "./components/ResumenVenta";
// Utilidades de impresión POS
import {
  inicializarQZTray,
  listarImpresorasDisponibles,
  imprimirLoteTexto,
  OpcionesImpresion,
} from "@/app/utils/imprimir-pos";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Script from "next/script";
import { generarLineasPOS } from "@/app/utils/generarTicket"; // ajusta la ruta si está en otro archivo

// Componentes UI para Select
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function VentasPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  // — Impresoras POS —
  const [impresoras, setImpresoras] = useState<string[]>(["POS-58"]);
  const [nombreImpresora, setNombreImpresora] = useState<string>("POS-58");
  const [tamanoPapel, setTamanoPapel] = useState<"58mm" | "80mm">("58mm");

  // ─── Estados de productos y venta ──────────────────────────
  const [productos, setProductos] = useState<any[]>([]);
  const [productosOriginales, setProductosOriginales] = useState<any[]>([]);
  const [venta, setVenta] = useState<any[]>([]);

  // ─── Estados de búsqueda ───────────────────────────────────
  const [busqueda, setBusqueda] = useState("");
  const [buscarPorAlias, setBuscarPorAlias] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);

  // ─── Datos de cliente/vendedor/descuento/pagos ────────────
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [pagos, setPagos] = useState<{ metodo: string; monto: number }[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  // ─── Ventas pendientes (drafts) ───────────────────────────
  const [ventasPendientes, setVentasPendientes] = useState<any[]>([]);

  // Carga inicial de ventas pendientes desde localStorage
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

  // Autoguardado de borrador
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

  // Previene pérdida de datos al recargar si hay productos en el carrito
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (venta.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [venta]);

  // Fetch inicial de productos
  useEffect(() => {
    getProductos()
      .then((data) => {
        setProductos(data);
        setProductosOriginales(data);
      })
      .catch(console.error);
  }, []);

  // Filtrado dinámico de productos
  useEffect(() => {
    const term = busqueda.trim().toLowerCase();
    if (buscarPorAlias && term) {
      buscarProductosPorAlias(term).then(setProductos).catch(console.error);
    } else if (!term) {
      setProductos(productosOriginales);
    }
  }, [busqueda, buscarPorAlias, productosOriginales]);

  // Manejo de Enter en buscador
  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const raw = busqueda.trim();
    if (!raw) return;

    // 1) Expresiones de cálculo rápido "=..."
    if (raw.startsWith("=")) {
      const expr = raw.slice(1);
      try {
        // eslint-disable-next-line no-new-func
        const res = Function(`"use strict"; return (${expr})`)();
        alert(`${res} = ${expr}`);
      } catch {
        alert("Expresión inválida");
      }
      inputRef.current?.select();
      return;
    }

    if (!buscarPorAlias) return;

    // 2) Manejo de multiplicador "5*alias"
    let multiplier = 1;
    let term = raw;
    const m = raw.match(/^(\d+)\*(.+)$/);
    if (m) {
      multiplier = +m[1];
      term = m[2];
    }

    buscarProductosPorAlias(term)
      .then((lista) => {
        if (lista.length === 1) {
          const prod = lista[0];
          handleAgregarProducto({
            id: prod.detalle_producto_id,
            nombre: prod.nombre_calculado,
            precio: +prod.precios?.[0]?.precio_venta || 0,
            cantidad: multiplier,
            presentacion_id: prod.presentaciones?.[0]?.presentacion_id,
            inventarios: prod.inventarios,
          });
          inputRef.current?.select();
          setPaginaActual(1);
        } else if (lista.length) {
          alert(`Se encontraron ${lista.length} coincidencias`);
        } else {
          alert("No se encontró ningún producto");
        }
      })
      .catch(console.error);
  };

  // Teclas rápidas F2/F5/F8/F9
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "F5":
          e.preventDefault();
          setMostrarModal(true);
          break;
        case "F8":
          e.preventDefault();
          if (confirm("¿Limpiar carrito?")) handleLimpiarCarrito();
          break;
        case "F2":
          e.preventDefault();
          agregarVentaPendiente();
          break;
        case "F9":
          e.preventDefault();
          if (confirm("¿Eliminar todas las ventas pendientes?")) {
            setVentasPendientes([]);
            localStorage.removeItem("ventasPendientes");
          }
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [venta, pagos, ventasPendientes]);

  // Helpers: limpiar carrito y manejar pendientes
  const handleLimpiarCarrito = () => {
    setVenta([]);
    setPagos([]);
    inputRef.current?.focus();
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
    const arr = [...ventasPendientes, nueva];
    setVentasPendientes(arr);
    localStorage.setItem("ventasPendientes", JSON.stringify(arr));
  };
  const cargarVentaPendiente = (p: any) => {
    setVenta(p.productos);
    setCliente(p.cliente);
    setVendedor(p.vendedor);
    setDescuento(p.descuento);
  };
  const eliminarVentaPendiente = (id: string) => {
    if (!confirm("¿Eliminar esta venta pendiente?")) return;
    const filtradas = ventasPendientes.filter((v) => v.id !== id);
    setVentasPendientes(filtradas);
    localStorage.setItem("ventasPendientes", JSON.stringify(filtradas));
  };

  // Agregar producto al carrito
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

  // Cálculo de totales
  const subtotal = venta.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const total = subtotal - descuento;

  // ─── Lógica de QZ Tray ─────────────────────────────────────
  const onLoadQZ = async () => {
    try {
      await inicializarQZTray();
      const lista = await listarImpresorasDisponibles();
      const union = Array.from(new Set(["POS-58", ...lista]));
      setImpresoras(union);
      if (!union.includes(nombreImpresora)) {
        setNombreImpresora(union[0]);
      }
    } catch (e) {
      console.error("No se pudo inicializar QZ o listar impresoras:", e);
    }
  };
const handleCobrar = async (
  pagosSeleccionados: { metodo: string; monto: number }[],  imprimir = true

) => {
  setMostrarModal(false);
  const totalPagado = pagosSeleccionados.reduce((s, p) => s + p.monto, 0);

  // 1) Crear venta
  const payload = {
    usuario_id: 1,
    cliente_id: 1,
    forma_pago: pagosSeleccionados.map((p) => p.metodo).join(","),
    comprobante: `TKT-${Date.now()}`,
    iva: 16,
    pagado: totalPagado >= total,
    estado: "pagado",
    state_id: 1,
    descuento,
    detalle: venta.map((item) => ({
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
  if (imprimir) {
    // 2) Imprimir con diseño nuevo
    const lineas = generarLineasPOS(
      venta,
      pagosSeleccionados,
      total,
      totalPagado,
      false // venta real
    );
    const opciones: OpcionesImpresion = { nombreImpresora, tamanoPapel };

    try {
      await imprimirLoteTexto(lineas, opciones);
    } catch (err: any) {
      console.error(err);
      alert("❌ No se pudo imprimir: " + err.message);
    }
  }

    // 3) Reset
    setVenta([]);
    setPagos([]);
    setDescuento(0);
    alert(`✅ Venta #${nuevaVenta.id} registrada e impresa!`);
  } catch (err: any) {
    console.error(err);
    alert("❌ No se pudo registrar la venta:\n" + err.message);
  }
};

  const handleImprimirCotizacion = async () => {
  if (venta.length === 0) return;

  const totalCotizado = venta.reduce((s, i) => s + i.precio * i.cantidad, 0);

  const lineas = generarLineasPOS(
    venta,
    [],
    totalCotizado,
    0,
    true // isCotizacion = true
  );

  await imprimirLoteTexto(lineas, {
    nombreImpresora,
    tamanoPapel,
  });
};



  return (
    <>
      {/* 1) Cargamos QZ Tray */}
      <Script
        src="https://unpkg.com/qz-tray@2.2.5/qz-tray.js"
        strategy="beforeInteractive"
        onLoad={onLoadQZ}
      />


      {/* 3) Layout principal */}
      <div className="flex h-screen">
        <ResizablePanelGroup direction="horizontal" className="flex h-full overflow-hidden">
          <ResizablePanel defaultSize={65} minSize={50} className="h-full min-h-0">
            <div className="flex flex-col h-full min-h-0 p-6 bg-gray-50">
              <BuscadorProductos
                ref={inputRef}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                buscarPorAlias={buscarPorAlias}
                setBuscarPorAlias={setBuscarPorAlias}
                setPaginaActual={setPaginaActual}
                onSearchEnter={handleSearchEnter}
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
                  handleImprimirCotizacion={handleImprimirCotizacion}

              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
