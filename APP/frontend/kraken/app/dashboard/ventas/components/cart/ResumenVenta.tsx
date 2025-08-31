// app/dashboard/ventas/components/cart/ResumenVenta.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

// TablaVenta la tienes en components raíz
import TablaVenta from "../cart/TablaVenta";
// ModalCobro está en ../ModalCobro relativo a /components/cart
import ModalCobro from "../payments/ModalCobro";

// Tipos locales (evita importar de "./types" que no existe en esta carpeta)
export interface ProductoVenta {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  descuento?: number;
  descuentoRaw?: string;
  iva?: number;
  presentacion_id?: number;
  inventarios?: number[];
}
export interface VentaPendiente {
  id: string;
  cliente: string;
  vendedor: string;
  descuento: number;
  productos: ProductoVenta[];
  timestamp: string;
}

interface Props {
  cliente: string; setCliente: (v: string) => void;
  vendedor: string; setVendedor: (v: string) => void;
  descuento: number; setDescuento: (n: number) => void;
  subtotal: number;
  venta: ProductoVenta[]; setVenta: (v: ProductoVenta[]) => void;
  ventasPendientes: VentaPendiente[];
  agregarVentaPendiente: () => void;
  cargarVentaPendiente: (v: VentaPendiente) => void;
  eliminarVentaPendiente: (id: string) => void;
  mostrarModal: boolean; setMostrarModal: (b: boolean) => void;
  total: number;
  handleCobrar: (pagos: { metodo: string; monto: number }[], imprimir: boolean) => void;
  handleImprimirCotizacion: () => void;
}

export default function ResumenVenta(props: Props) {
  const {
    cliente, setCliente,
    vendedor, setVendedor,
    descuento, setDescuento,
    subtotal,
    venta, setVenta,
    ventasPendientes, agregarVentaPendiente, cargarVentaPendiente, eliminarVentaPendiente,
    mostrarModal, setMostrarModal,
    total,
    handleCobrar,
    handleImprimirCotizacion,
  } = props;

  const [showPendientes, setShowPendientes] = useState(true);

  return (
    <div className="flex flex-col h-full">
      {/* Cabecera fija */}
      <div className="p-4 space-y-4 border-b">
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/ventas/historico">
            <Button variant="outline">ir a historico</Button>
          </Link>
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

      {/* Cuerpo scrollable */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Pendientes */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Ventas pendientes</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPendientes(s => !s)}>
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
                      if (venta.length > 0 && !window.confirm(
                        "Cargar esta venta pendiente borrará la nota actual. ¿Continuar?"
                      )) return;
                      cargarVentaPendiente(p);
                    }}
                  >
                    <span className="truncate max-w-[120px]">{p.timestamp}</span>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-red-600 p-0 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("¿Seguro que deseas eliminar esta venta pendiente?")) {
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

        {/* Tabla de productos */}
        <div className="w-full overflow-x-auto">
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div>
                <TablaVenta
                  productos={venta}
                  setProductos={setVenta}
                  agregarVentaPendiente={agregarVentaPendiente}
                />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent align="end">
              <ContextMenuItem onSelect={handleImprimirCotizacion}>
                Imprimir cotización
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>


      </div>

      {/* Pie: total + botón Cobrar */}
      <div className="sticky bottom-0 z-10 border-t bg-white">
        <div className="px-4 pt-3 pb-2 text-center">
          <div className="text-xs uppercase tracking-wide text-red-500">Total a pagar</div>
          <div className="font-extrabold text-4xl text-red-600 leading-none mt-1">
            ${total.toFixed(2)}
          </div>
        </div>

        <div className="p-4 pt-2">
          <ModalCobro
            open={mostrarModal}
            setOpen={setMostrarModal}
            total={total}
            handleCobrar={handleCobrar}
            disabled={venta.length === 0}
          />
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   ContextMenu,
//   ContextMenuTrigger,
//   ContextMenuContent,
//   ContextMenuItem,
// } from "@/components/ui/context-menu";
// import TablaVenta from "@/app/dashboard/ventas/components/cart/TablaVenta";
// import ModalCobro from "../payments/ModalCobro";
// import { ProductoVenta, VentaPendiente } from "./types";
// import Link from "next/link";

// interface Props {
//   cliente: string;
//   setCliente: (v: string) => void;
//   vendedor: string;
//   setVendedor: (v: string) => void;
//   descuento: number;
//   setDescuento: (n: number) => void;
//   subtotal: number;
//   venta: ProductoVenta[];
//   setVenta: (v: ProductoVenta[]) => void;
//   ventasPendientes: VentaPendiente[];
//   agregarVentaPendiente: () => void;
//   cargarVentaPendiente: (v: VentaPendiente) => void;
//   eliminarVentaPendiente: (id: string) => void;
//   mostrarModal: boolean;
//   setMostrarModal: (b: boolean) => void;
//   total: number;
//   pagos: { metodo: string; monto: number }[];
//   setPagos: (v: any) => void;
//   handleCobrar: (
//     pagosSeleccionados: { metodo: string; monto: number }[],
//     imprimir: boolean
//   ) => void;
//   handleImprimirCotizacion: () => void;
// }

// export default function ResumenVenta(props: Props) {
//   const {
//     cliente,
//     setCliente,
//     vendedor,
//     setVendedor,
//     descuento,
//     setDescuento,
//     subtotal,
//     venta,
//     setVenta,
//     ventasPendientes,
//     agregarVentaPendiente,
//     cargarVentaPendiente,
//     eliminarVentaPendiente,
//     mostrarModal,
//     setMostrarModal,
//     total,
//     pagos,
//     setPagos,
//     handleCobrar,
//     handleImprimirCotizacion,
//   } = props;

//   const [showPendientes, setShowPendientes] = useState(true);

//   return (
//     <div className="flex flex-col h-full">
//       {/* Parte superior fija */}
//       <div className="p-4 space-y-4 border-b">
//         <h2 className="text-xl font-semibold">Resumen de venta</h2>
//         <div className="flex flex-wrap gap-2">
//           <Link href="/dashboard/ventas/historico">
//             <Button variant="outline">ir a historico</Button>
//           </Link>
//           <Input
//             placeholder="Cliente"
//             value={cliente}
//             onChange={(e) => setCliente(e.target.value)}
//             className="flex-1 min-w-[140px]"
//           />
//           <Input
//             placeholder="Vendedor"
//             value={vendedor}
//             onChange={(e) => setVendedor(e.target.value)}
//             className="flex-1 min-w-[140px]"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-sm">Descuento:</span>
//           <Input
//             type="number"
//             value={descuento}
//             min={0}
//             onChange={(e) => setDescuento(Number(e.target.value) || 0)}
//             className="w-24"
//           />
//           <span className="text-sm text-muted-foreground">
//             Subtotal: ${subtotal.toFixed(2)}
//           </span>
//         </div>
//       </div>

//       {/* Parte scrollable */}
//       <div className="flex-1 overflow-y-auto px-4">
//         {/* Ventas pendientes */}
//         <div className="mt-4">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="font-medium">Ventas pendientes</h3>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setShowPendientes((s) => !s)}
//             >
//               {showPendientes ? "Ocultar" : "Mostrar"}
//             </Button>
//           </div>
//           {showPendientes && (
//             <div className="max-h-24 overflow-y-auto mb-4">
//               <div className="flex flex-wrap gap-2">
//                 {ventasPendientes.map((p) => (
//                   <Badge
//                     key={p.id}
//                     className="flex items-center space-x-1 cursor-pointer"
//                     onClick={() => {
//                       if (
//                         venta.length > 0 &&
//                         !window.confirm(
//                           "Cargar esta venta pendiente borrará la nota actual. ¿Continuar?"
//                         )
//                       )
//                         return;
//                       cargarVentaPendiente(p);
//                     }}
//                   >
//                     <span className="truncate max-w-[120px]">
//                       {p.timestamp}
//                     </span>
//                     <Button
//                       variant="ghost"
//                       size="xs"
//                       className="text-red-600 p-0 ml-1"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (
//                           window.confirm(
//                             "¿Seguro que deseas eliminar esta venta pendiente?"
//                           )
//                         ) {
//                           eliminarVentaPendiente(p.id);
//                         }
//                       }}
//                     >
//                       ✕
//                     </Button>
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Tabla de productos */}
//         <div className="w-full overflow-x-auto">
//           <ContextMenu>
//             <ContextMenuTrigger asChild>
//               <div>
//                 <TablaVenta
//                   productos={venta}
//                   setProductos={setVenta}
//                   agregarVentaPendiente={agregarVentaPendiente}
//                 />
//               </div>
//             </ContextMenuTrigger>
//             <ContextMenuContent align="end">
//               <ContextMenuItem onSelect={handleImprimirCotizacion}>
//                 Imprimir cotización
//               </ContextMenuItem>
//             </ContextMenuContent>
//           </ContextMenu>
//         </div>

//         {/* Total gigante */}
//         <div className="mt-6 text-center">
//           <span className="text-red-600 text-4xl font-extrabold">
//             ${total.toFixed(2)}
//           </span>
//           <div className="uppercase text-sm text-red-500 tracking-wide">
//             Total a Pagar
//           </div>
//         </div>
//       </div>

//       {/* Botón cobrar fijo */}
//       <div className="sticky bottom-0 p-4 border-t bg-white z-10">
//         <ModalCobro
//           open={mostrarModal}
//           setOpen={setMostrarModal}
//           total={total}
//           pagos={pagos}
//           setPagos={setPagos}
//           handleCobrar={(pagosSeleccionados, imprimir) =>
//             handleCobrar(pagosSeleccionados, imprimir)
//           }
//           disabled={venta.length === 0}
//         />
//       </div>
//     </div>
//   );
// }
