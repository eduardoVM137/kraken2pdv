
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface Pago {
  metodo: string;
  monto: number;
}

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  total: number;
  handleCobrar: (pagos: Pago[], imprimir: boolean) => void;
  disabled?: boolean;

  /** Opcionales: si los pasas, el componente funciona en modo controlado */
  pagos?: Pago[];
  setPagos?: (p: Pago[]) => void;
}

export default function ModalCobro({
  open,
  setOpen,
  total,
  handleCobrar,
  disabled,
  pagos: pagosCtrl,
  setPagos: setPagosCtrl,
}: Props) {
  // Estado interno si no vienen controlados por props
  const [pagosLocal, setPagosLocal] = useState<Pago[]>([]);
  const pagos = pagosCtrl ?? pagosLocal;
  const setPagos = setPagosCtrl ?? setPagosLocal;

  const [metodo, setMetodo] = useState<string>("Efectivo");
  const [monto, setMonto] = useState<string>(total.toFixed(2));
  const [imprimir, setImprimir] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derivados
  const abonado = useMemo(() => pagos.reduce((s, p) => s + p.monto, 0), [pagos]);
  const montoNum = parseFloat(monto) || 0;
  const totalAbonado = abonado + montoNum;
  const restante = total - totalAbonado;

  // Al abrir: enfocar y precargar monto; resetear impresión a true
  useEffect(() => {
    if (open) {
      setImprimir(true);
      const txt = total.toFixed(2);
      setMonto(txt);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [open, total]);

  const addAbono = () => {
    if (montoNum <= 0) return;
    setPagos([...pagos, { metodo, monto: montoNum }]);
    setMonto(Math.max(0, total - (abonado + montoNum)).toFixed(2));
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const removeAbono = (idx: number) => {
    setPagos(pagos.filter((_, i) => i !== idx));
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const doCobrar = () => {
    const pagosFinales = [...pagos];
    if (montoNum > 0) pagosFinales.push({ metodo, monto: montoNum });

    const totalAb = pagosFinales.reduce((s, p) => s + p.monto, 0);
    if (totalAb < total) {
      const continuar = window.confirm(
        `⚠️ El total abonado ($${totalAb.toFixed(2)}) es menor al total a pagar ($${total.toFixed(
          2
        )}).\n\n¿Deseas continuar con la venta de todos modos?`
      );
      if (!continuar) return;
    }

    handleCobrar(pagosFinales, imprimir);

    // Si es estado interno, reseteamos aquí
    if (!pagosCtrl) setPagos([]);
    setMonto("0.00");
    setImprimir(true);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      pagos.length > 0 ? addAbono() : doCobrar();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-lg py-3" disabled={disabled}>
          Cobrar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Registrar Cobro</DialogTitle>
        </DialogHeader>

        {/* Lista de abonos */}
        {pagos.length > 0 && (
          <div className="space-y-2">
            <div className="text-lg font-medium">Abonos</div>
            <ul className="divide-y">
              {pagos.map((p, i) => (
                <li key={i} className="flex justify-between items-center py-2">
                  <span className="text-base">{p.metodo}</span>
                  <span className="text-base">${p.monto.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => removeAbono(i)}
                  >
                    ✕
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-2 text-base">
              <span>Total abonado:</span>
              <span className="font-medium">${abonado.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Nuevo abono */}
        <div className="flex gap-3 items-center">
          <Select value={metodo} onValueChange={setMetodo} className="flex-1">
            <SelectTrigger className="h-10 text-base">{metodo}</SelectTrigger>
            <SelectContent>
              <SelectItem value="Efectivo">Efectivo</SelectItem>
              <SelectItem value="Tarjeta">Tarjeta</SelectItem>
              <SelectItem value="Mixto">Mixto</SelectItem>
            </SelectContent>
          </Select>
          <Input
            ref={inputRef}
            type="number"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-28 h-10 text-base"
          />
          <Button onClick={addAbono} disabled={montoNum <= 0}>
            Abonar
          </Button>
        </div>

        {/* Restante / Cambio */}
        {restante >= 0 ? (
          <div className="flex justify-between text-xl font-semibold">
            <span>Restante:</span>
            <span className="text-red-600">${restante.toFixed(2)}</span>
          </div>
        ) : (
          <div className="flex justify-between text-xl font-semibold">
            <span>Cambio:</span>
            <span className="text-green-700">${Math.abs(restante).toFixed(2)}</span>
          </div>
        )}

        {/* Toggle imprimir (por venta vuelve a true) */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="imprimir"
            checked={imprimir}
            onChange={(e) => setImprimir(e.target.checked)}
            className="accent-black w-4 h-4"
          />
          <label htmlFor="imprimir" className="text-sm select-none">
            Imprimir
          </label>
        </div>

        <Button className="w-full text-lg py-3" onClick={doCobrar} disabled={disabled}>
          Cobrar
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// interface Pago {
//   metodo: string;
//   monto: number;
// }

// interface Props {
//   open: boolean;
//   setOpen: (v: boolean) => void;
//   total: number;
//   handleCobrar: (pagos: Pago[],imprimir: boolean) => void;
//   disabled?: boolean;
// }

// export default function ModalCobro({
//   open,
//   setOpen,
//   total,
//   handleCobrar,
//   disabled,
// }: Props) {
//   const [pagos, setPagos] = useState<Pago[]>([]);
//   const [metodo, setMetodo] = useState<string>("Efectivo");
//   const [monto, setMonto] = useState<string>(total.toFixed(2));
//   const inputRef = useRef<HTMLInputElement>(null);
// const [imprimir, setImprimir] = useState(true);

//   // cálculos
//   const abonado = pagos.reduce((s, p) => s + p.monto, 0);
//   const montoNum = parseFloat(monto) || 0;
//   const totalAbonado = abonado + montoNum;
//   const restante = total - totalAbonado;

//   useEffect(() => {
//     if (open) {
//       const txt = total.toFixed(2);
//       setMonto(txt);
//       setTimeout(() => {
//         inputRef.current?.focus();
//         inputRef.current?.select();
//       }, 0);
//     }
//   }, [open, total]);

//   const addAbono = () => {
//     if (montoNum <= 0) return;
//     setPagos([...pagos, { metodo, monto: montoNum }]);
//     setMonto(Math.max(0, total - (abonado + montoNum)).toFixed(2));
//     inputRef.current?.focus();
//     inputRef.current?.select();
//   };

//   const removeAbono = (idx: number) => {
//     setPagos(pagos.filter((_, i) => i !== idx));
//     inputRef.current?.focus();
//     inputRef.current?.select();
//   };
// const doCobrar = () => {
//   const pagosFinales = [...pagos];

//   if (montoNum > 0) {
//     pagosFinales.push({ metodo, monto: montoNum });
//   }

//   const totalAbonado = pagosFinales.reduce((s, p) => s + p.monto, 0);

//   if (totalAbonado < total) {
//     const continuar = window.confirm(
//       `⚠️ El total abonado ($${totalAbonado.toFixed(2)}) es menor al total a pagar ($${total.toFixed(2)}).\n\n¿Deseas continuar con la venta de todos modos?`
//     );
//     if (!continuar) return;
//   }

//   handleCobrar(pagosFinales, imprimir);

//   setPagos([]);
//   setMonto("0.00");
//   setImprimir(true);
//   setOpen(false);
// }; 


//   const onKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       pagos.length > 0 ? addAbono() : doCobrar();
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="w-full text-lg py-3" disabled={disabled}>
//           Cobrar
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-md p-6 space-y-6">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-semibold">
//             Registrar Cobro
//           </DialogTitle>
//         </DialogHeader>

//         {/* Lista de abonos */}
//         {pagos.length > 0 && (
//           <div className="space-y-2">
//             <div className="text-lg font-medium">Abonos</div>
//             <ul className="divide-y">
//               {pagos.map((p, i) => (
//                 <li
//                   key={i}
//                   className="flex justify-between items-center py-2"
//                 >
//                   <span className="text-base">{p.metodo}</span>
//                   <span className="text-base">${p.monto.toFixed(2)}</span>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-red-600"
//                     onClick={() => removeAbono(i)}
//                   >
//                     ✕
//                   </Button>
//                 </li>
//               ))}
//             </ul>
//             <div className="flex justify-between pt-2 text-base">
//               <span>Total abonado:</span>
//               <span className="font-medium">${abonado.toFixed(2)}</span>
//             </div>
//           </div>
//         )}

//         {/* Nuevo abono */}
//         <div className="flex gap-3 items-center">
//           <Select
//             value={metodo}
//             onValueChange={setMetodo}
//             className="flex-1"
//           >
//             <SelectTrigger className="h-10 text-base">
//               {metodo}
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Efectivo">Efectivo</SelectItem>
//               <SelectItem value="Tarjeta">Tarjeta</SelectItem>
//               <SelectItem value="Mixto">Mixto</SelectItem>
//             </SelectContent>
//           </Select>
//           <Input
//             ref={inputRef}
//             type="number"
//             step="0.01"
//             value={monto}
//             onChange={(e) => setMonto(e.target.value)}
//             onKeyDown={onKeyDown}
//             className="w-28 h-10 text-base"
//           />
//           <Button onClick={addAbono} disabled={montoNum <= 0}>
//             Abonar
//           </Button>
//         </div>

//         {/* Restante */}
//        {restante >= 0 ? (
//             <div className="flex justify-between text-xl font-semibold">
//               <span>Restante:</span>
//               <span className="text-red-600">${restante.toFixed(2)}</span>
//             </div>
//           ) : (
//             <div className="flex justify-between text-xl font-semibold">
//               <span>Cambio:</span>
//               <span className="text-green-700">${Math.abs(restante).toFixed(2)}</span>
//             </div>
//           )}

//        <div className="flex items-center space-x-2">
//   <input
//     type="checkbox"
//     id="imprimir"
//     checked={imprimir}
//     onChange={(e) => setImprimir(e.target.checked)}
//     className="accent-black w-4 h-4"
//   />
//   <label htmlFor="imprimir" className="text-sm select-none">
//     Imprimir
//   </label>
// </div>


//         {/* Botón Cobrar */}
//         <Button
//           className="w-full text-lg py-3"
//           onClick={doCobrar}
//           disabled={disabled}
//         >
//           Cobrar
//         </Button>
//       </DialogContent>
//     </Dialog>
//   );
// }
