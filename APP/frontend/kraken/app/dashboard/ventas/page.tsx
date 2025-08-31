// app/dashboard/ventas/page.tsx
"use client";

import { useEffect, useRef, useState, useDeferredValue, useTransition } from "react";
import Script from "next/script";
import { ShoppingCart } from "lucide-react";

import GridProducto from "./components/products/GridProducto";
import BuscadorProductos from "./components/search/BuscadorProductos";
import ResumenVenta from "./components/cart/ResumenVenta";

import { getProductos, buscarProductosPorAlias, crearVenta } from "@/lib/fetchers/ventas";

// ⬇️ Utils de impresión (si los moviste a lib/printing, cambia las rutas)
import {
  imprimirLoteTexto,
  OpcionesImpresion,
} from "@/app/utils/imprimir-pos";
import { generarLineasPOS } from "@/app/utils/generarTicket";

// ⬇️ UI
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// ⬇️ Hooks modulares del feature (carrito, pendientes, impresoras)
import { useCart } from "./hooks/useCart";
import { usePendingSales } from "./hooks/usePendingSales";
import { usePrinters } from "./hooks/usePrinters";
import PrinterPanel from "./components/settings/PrinterPanel";

export default function VentasPage() {
  const inputRef = useRef<HTMLInputElement>(null);
    const lastScan = useRef<{ key: string; t: number }>({ key: "", t: 0 });

  const [abrirCarritoMovil, setAbrirCarritoMovil] = useState(false);

  // 🔌 Impresoras POS (QZ)
const {
  impresoras,       // verificadas por QZ
  visibles,         // QZ + defaults Windows
  noVerificadas,
  nombreImpresora, setNombreImpresora,
  tamanoPapel, setTamanoPapel,
  refreshPrinters,
  pos58Disponible,
  seleccionDisponible,
  panelColapsado, setPanelColapsado,
} = usePrinters("58mm");

  // 🛒 Carrito (modular)
  const {
    venta, setVenta, agregarProducto, limpiar,
    descuento, setDescuento,
    pagos, setPagos,
    subtotal, total,
  } = useCart();

  // 📝 Ventas pendientes (modular)
  const { ventasPendientes, guardar, eliminar, limpiarTodo } = usePendingSales();

  // 📦 Productos origen
  const [productos, setProductos] = useState<any[]>([]);
  const [productosOriginales, setProductosOriginales] = useState<any[]>([]);

  // 🔎 Búsqueda/paginación
  const [busqueda, setBusqueda] = useState("");
  const [buscarPorAlias, setBuscarPorAlias] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);

  // 👤 Encabezado
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
 

// [SEARCH-OPT] deferred & transition
const deferredBusqueda = useDeferredValue(busqueda);
const [isSearching, startTransition] = useTransition();

// [SEARCH-OPT] cache + cancelación para alias
const aliasCache = useRef<Map<string, any[]>>(new Map());
const lastCtrl = useRef<AbortController | null>(null);


  // ▶️ Carga inicial de productos
  useEffect(() => {
    getProductos()
      .then((data) => { setProductos(data); setProductosOriginales(data); })
      .catch(console.error);
  }, []);

  // 🔍 Filtro reactivo (local o por alias vía API)
useEffect(() => {
  const term = deferredBusqueda.trim().toLowerCase();

  // 1) Sin término → restaurar catálogo original
  if (!term) {
    startTransition(() => {
      setProductos(productosOriginales);
      setPaginaActual(1);
    });
    return;
  }

  // 2) Modo NOMBRE → filtrado local
  if (!buscarPorAlias) {
    startTransition(() => {
      const next = productosOriginales.filter((p) =>
        (p.nombre_calculado || "").toLowerCase().includes(term)
      );
      setProductos(next);
      setPaginaActual(1);
    });
    return;
  }

  // 3) Modo ALIAS → caché cliente
  if (aliasCache.current.has(term)) {
    startTransition(() => {
      setProductos(aliasCache.current.get(term)!);
      setPaginaActual(1);
    });
    return;
  }

  // 4) Modo ALIAS → llamada a API con cancelación
  lastCtrl.current?.abort();
  const ctrl = new AbortController();
  lastCtrl.current = ctrl;

  (async () => {
    try {
 const lista = await buscarProductosPorAlias(term, { signal: ctrl.signal });


      aliasCache.current.set(term, lista);
      startTransition(() => {
        setProductos(lista);
        setPaginaActual(1);
      });
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error("Alias search error:", err);
      }
    }
  })();

  return () => ctrl.abort();
}, [deferredBusqueda, buscarPorAlias, productosOriginales, setPaginaActual, setProductos]);
  // ⌨️ Enter en buscador (=calc y 5*alias)
 // ENTER en CONSULTA: nunca agrega, solo busca
const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key !== "Enter") return;
  e.preventDefault();

  let raw = busqueda.trim();
  if (!raw) return;

  // Calc rápida "=500+2"
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

  // Si viene "8*code" o "code*8": NO agregar -> solo buscar por "code"
  const isNum = (s: string) => /^(\d+(\.\d*)?|\.\d+)$/.test(s.replace(",", "."));
  if (raw.includes("*")) {
    const [a, b] = raw.split("*").map(s => s.trim());
    if (a && b) {
      if (isNum(a) && !isNum(b)) raw = b;        // qty*code
      else if (!isNum(a) && isNum(b)) raw = a;   // code*qty
    }
  }

  setBusqueda(raw);       // fuerza búsqueda inmediata
  setPaginaActual(1);
  inputRef.current?.select(); // deja el texto seleccionado para sobreescribir
};
 // Agregar desde el escáner: code puede venir como "ABC", "5*ABC" o "ABC*0.5" ya parseado 
const handleScanEnter = async ({ code, qty }: { code: string; qty: number }) => {
  // Dedupe global: si llega el mismo code|qty en <350 ms, ignorar
  const key = `${code}|${qty}`;
  const now = Date.now();
  if (key === lastScan.current.key && now - lastScan.current.t < 350) return;
  lastScan.current = { key, t: now };

  const term = code.trim().toLowerCase();
  if (!term) return;

  try {
    const lista = await buscarProductosPorAlias(term);
    if (lista.length === 1) {
      const prod = lista[0];
      agregarProducto({
        id: prod.detalle_producto_id,
        nombre: prod.nombre_calculado,
        precio: +prod.precios?.[0]?.precio_venta || 0,
        cantidad: qty,
        presentacion_id: prod.presentaciones?.[0]?.presentacion_id,
        inventarios: prod.inventarios,
      });
      setPaginaActual(1);
    } else if (lista.length > 1) {
      alert(`Se encontraron ${lista.length} coincidencias para "${term}".`);
    } else {
      alert("No se encontró ningún producto");
    }
  } catch (err) {
    console.error(err);
    alert("Error buscando producto por alias");
  }
};
  // ⚡ Atajos
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "F5": e.preventDefault(); setMostrarModal(true); break;
        case "F8": e.preventDefault(); if (confirm("¿Limpiar carrito?")) limpiar(); break;
        case "F2": e.preventDefault(); guardar(venta, cliente, vendedor, descuento); break;
        case "F9": e.preventDefault(); if (confirm("¿Eliminar todas las ventas pendientes?")) limpiarTodo(); break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [venta, pagos, descuento, cliente, vendedor, limpiar, guardar, limpiarTodo]);
useEffect(() => {
  aliasCache.current.clear();
  if (!busqueda.trim() && buscarPorAlias) {
    setProductos(productosOriginales);
    setPaginaActual(1);
  }
}, [buscarPorAlias]); // eslint-disable-line
  // 🗂️ Pendientes helpers (adaptadores para ResumenVenta)
  const agregarVentaPendiente = () => guardar(venta, cliente, vendedor, descuento);
  const cargarVentaPendiente = (p: any) => {
    setVenta(p.productos); setCliente(p.cliente); setVendedor(p.vendedor); setDescuento(p.descuento);
  };
  const eliminarVentaPendiente = (id: string) => {
    if (!confirm("¿Eliminar esta venta pendiente?")) return;
    eliminar(id);
  };

  // 🖨️ Cobro + impresión
  const handleCobrar = async (
    pagosSeleccionados: { metodo: string; monto: number }[],
    imprimir = true
  ) => {
    setMostrarModal(false);
    const totalPagado = pagosSeleccionados.reduce((s, p) => s + p.monto, 0);

    const payload = {
      usuario_id: 1, cliente_id: 1,
      forma_pago: pagosSeleccionados.map((p) => p.metodo).join(","),
      comprobante: `TKT-${Date.now()}`,
      iva: 16, pagado: totalPagado >= total, estado: "pagado", state_id: 1,
      descuento,
      detalle: venta.map((item) => ({
        detalle_producto_id: item.id,
        precio_venta: item.precio,
        cantidad: item.cantidad,
        descuento: item.descuento ?? 0,
        empleado_id: 1,
        inventario_id: item.inventarios?.[0],
      })),
    };

    try {
      const nuevaVenta = await crearVenta(payload);
      localStorage.removeItem("ventaDraft");

      if (imprimir) {
        const lineas = generarLineasPOS(
          venta, pagosSeleccionados, total, totalPagado, false, nuevaVenta.id, cliente, vendedor
        );
        const opciones: OpcionesImpresion = { nombreImpresora, tamanoPapel } as any;
        try { await imprimirLoteTexto(lineas, opciones); }
        catch (err: any) { console.error(err); alert("❌ No se pudo imprimir: " + err.message); }
      }

      setVenta([]); setPagos([]); setDescuento(0);
      alert(`✅ Venta #${nuevaVenta.id} registrada${imprimir ? " e impresa" : ""}!`);
    } catch (err: any) {
      console.error(err);
      alert("❌ No se pudo registrar la venta:\n" + err.message);
    }
  };

  // 🧾 Cotización (sin pagos)
  const handleImprimirCotizacion = async () => {
    if (venta.length === 0) return;
    const totalCotizado = venta.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const lineas = generarLineasPOS(venta, [], totalCotizado, 0, true);
    await imprimirLoteTexto(lineas, { nombreImpresora, tamanoPapel } as any);
  };

  return (
    <>
      {/* Carga QZ-Tray (init lo maneja usePrinters) */}
      <Script src="https://unpkg.com/qz-tray@2.2.5/qz-tray.js" strategy="beforeInteractive" />

      <div className="flex h-screen">
        <ResizablePanelGroup direction="horizontal" className="flex h-full overflow-hidden">

          {/* Panel de productos */}
          <ResizablePanel defaultSize={65} minSize={50} className="h-full min-h-0">
            <div className="flex flex-col h-full min-h-0 p-6 bg-gray-50">
              <BuscadorProductos
                ref={inputRef}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                buscarPorAlias={buscarPorAlias}
  setBuscarPorAlias={(v) => { setBuscarPorAlias(v); aliasCache.current.clear(); }}
                setPaginaActual={setPaginaActual}
                onSearchEnter={handleSearchEnter}
                  onScanEnter={handleScanEnter}   // <-- NUEVO

              />
              <div className="flex-1 min-h-0 overflow-y-auto">
                <ScrollArea className="flex-1 min-h-0">
      <GridProducto
  productos={productos}
  onAgregar={agregarProducto}
  busqueda={busqueda}
  buscarPorAlias={buscarPorAlias}
  paginaActual={paginaActual}
  setPaginaActual={setPaginaActual}
  productosPorPagina={24}
  isSearching={isSearching}
/>

                </ScrollArea>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Panel carrito (desktop) */}
<ResizablePanel defaultSize={35} minSize={15} className="h-full min-h-0 hidden lg:block">
  <div className="flex flex-col h-full min-h-0 bg-white">
    <PrinterPanel
      visibles={visibles}
      verificadas={impresoras}
      noVerificadas={noVerificadas}
      nombreImpresora={nombreImpresora}
      setNombreImpresora={setNombreImpresora}
      tamanoPapel={tamanoPapel}
      setTamanoPapel={setTamanoPapel}
      cargando={false}
      pos58Disponible={pos58Disponible}
      seleccionDisponible={seleccionDisponible}
      panelColapsado={panelColapsado}
      setPanelColapsado={setPanelColapsado}
      refreshPrinters={refreshPrinters}
    />

    
              <ResumenVenta
                cliente={cliente} setCliente={setCliente}
                vendedor={vendedor} setVendedor={setVendedor}
                descuento={descuento} setDescuento={setDescuento}
                subtotal={subtotal}
                venta={venta} setVenta={setVenta}
                ventasPendientes={ventasPendientes}
                agregarVentaPendiente={agregarVentaPendiente}
                cargarVentaPendiente={cargarVentaPendiente}
                eliminarVentaPendiente={eliminarVentaPendiente}
                mostrarModal={mostrarModal} setMostrarModal={setMostrarModal}
                total={total}
                pagos={pagos} setPagos={setPagos}
                handleCobrar={handleCobrar}
                handleImprimirCotizacion={handleImprimirCotizacion}
              />
            </div>
            
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Carrito móvil */}
        <Sheet open={abrirCarritoMovil} onOpenChange={setAbrirCarritoMovil}>
          <SheetTrigger asChild>
            <button
              className="fixed bottom-4 right-4 z-50 lg:hidden bg-black text-white px-4 py-2 rounded-full shadow"
              onClick={() => setAbrirCarritoMovil(true)}
            >
              <ShoppingCart className="w-5 h-5 inline mr-1" />
              Ver carrito ({venta.reduce((sum, p) => sum + p.cantidad, 0)})
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm p-0">
            <SheetHeader className="p-4"><SheetTitle>Resumen de venta</SheetTitle></SheetHeader>
            <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
              <ResumenVenta
                cliente={cliente} setCliente={setCliente}
                vendedor={vendedor} setVendedor={setVendedor}
                descuento={descuento} setDescuento={setDescuento}
                subtotal={subtotal}
                venta={venta} setVenta={setVenta}
                ventasPendientes={ventasPendientes}
                agregarVentaPendiente={agregarVentaPendiente}
                cargarVentaPendiente={cargarVentaPendiente}
                eliminarVentaPendiente={eliminarVentaPendiente}
                mostrarModal={mostrarModal} setMostrarModal={setMostrarModal}
                total={total}
                pagos={pagos} setPagos={setPagos}
                handleCobrar={handleCobrar}
                handleImprimirCotizacion={handleImprimirCotizacion}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}


