// src/components/CorteCajaForm.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  inicializarQZTray,
  listarImpresorasDisponibles,
  imprimirLoteTexto,
  OpcionesImpresion,
} from "../../utils/imprimir-pos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";

declare global {
  interface Window { qz: any }
}

export default function CorteCajaForm() {
  const preRef = useRef<HTMLPreElement>(null);

  // — Estados de datos del corte —
  const [empleadoId, setEmpleadoId] = useState<number | "">("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [fondoInicial, setFondoInicial] = useState<number>(0);
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [totalRetiros, setTotalRetiros] = useState<number>(0);
  const [totalEntregado, setTotalEntregado] = useState<number>(0);

  // — Estados de impresión —
  const [impresoras, setImpresoras] = useState<string[]>([]);
  const [nombreImpresora, setNombreImpresora] = useState<string>("");
  const [tamanoPapel, setTamanoPapel] = useState<"58mm" | "80mm">("58mm");

  // Inicializar fechas al montar
  useEffect(() => {
    const now = new Date().toISOString().slice(0, 16);
    setFechaInicio(now);
    setFechaFin(now);
  }, []);

  // Recalcular entregado
  useEffect(() => {
    setTotalEntregado(
      parseFloat((fondoInicial + totalVentas - totalRetiros).toFixed(2))
    );
  }, [fondoInicial, totalVentas, totalRetiros]);

  // Traer resumen de ventas/retiros
  useEffect(() => {
    if (!fechaInicio || !fechaFin) return;
    fetch(
      `/api/corte-caja/resumen?from=${encodeURIComponent(
        fechaInicio
      )}&to=${encodeURIComponent(fechaFin)}`
    )
      .then((r) => r.json())
      .then((data) => {
        setTotalVentas(data.totalVentas ?? 0);
        setTotalRetiros(data.totalRetiros ?? 0);
      })
      .catch(() => {
        setTotalVentas(0);
        setTotalRetiros(0);
      });
  }, [fechaInicio, fechaFin]);

  // Inicializar QZ Tray y cargar lista de impresoras
   useEffect(() => {
  async function loadPrinters() {
    try {
      if (!window.qz) {
        console.error("❌ QZ Tray no cargado aún");
        return;
      }

      // === PARCHE NECESARIO ===
      if (qz.api?.setPromiseType) {
        qz.api.setPromiseType((resolver) => new Promise(resolver));
      }

      if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
      }

      const lista = await qz.printers.find();
      setImpresoras(lista);
      if (lista.length) setNombreImpresora(lista[0]);
    } catch (err) {
      console.error("Error cargando impresoras:", err);
    }
  }

  loadPrinters();
}, []);


  // Genera el array de líneas ESC/POS
  const generarLineas = (): string[] => [
    "\n",
    "COMPROBANTE DE CORTE",
    "Mi Negocio S.A. de C.V.",
    `Empleado : ${empleadoId || "-"}`,
    `Desde   : ${
      fechaInicio ? new Date(fechaInicio).toLocaleString() : "-"
    }`,
    `Hasta   : ${
      fechaFin ? new Date(fechaFin).toLocaleString() : "-"
    }`,
    "------------------------------",
    `Fondo Init : $${fondoInicial.toFixed(2)}`,
    `Ventas     : $${totalVentas.toFixed(2)}`,
    `Retiros    : $${totalRetiros.toFixed(2)}`,
    "------------------------------",
    `Entregado  : $${totalEntregado.toFixed(2)}`,
    "------------------------------",
    `Emitido    : ${new Date().toLocaleString()}`,
    "Firma      : ____________",
    "\n",
  ];

  // Dispara la impresión
  const handleImprimir = async () => {
    const lineas = generarLineas();
    if (preRef.current) preRef.current.textContent = lineas.join("\n");

    const opciones: OpcionesImpresion = { nombreImpresora, tamanoPapel };
    try {
      await imprimirLoteTexto(lineas, opciones);
    } catch (err: any) {
      console.error("Error imprimiendo:", err);
      alert("❌ Falló la impresión. Mira la consola.");
    }
  };

  return (
    <>
      {/* 1) Cargamos QZ Tray antes de interactuar */}
      <Script
        src="https://unpkg.com/qz-tray@2.2.5/qz-tray.js"
        strategy="beforeInteractive"
      />

      <div className="print:hidden p-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Corte de Caja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Formulario de fechas, empleado y fondo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Empleado (ID)</Label>
                <Input
                  type="number"
                  placeholder="ID empleado"
                  value={empleadoId}
                  onChange={(e) =>
                    setEmpleadoId(e.target.value === "" ? "" : +e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Fondo Inicial</Label>
                <Input
                  type="number"
                  placeholder="$0.00"
                  step="0.01"
                  value={fondoInicial}
                  onChange={(e) => setFondoInicial(+e.target.value)}
                />
              </div>
              <div>
                <Label>Fecha y Hora Inicio</Label>
                <Input
                  type="datetime-local"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div>
                <Label>Fecha y Hora Fin</Label>
                <Input
                  type="datetime-local"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            {/* Totales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Ventas</p>
                <p className="text-xl font-bold">
                  ${totalVentas.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Retiros</p>
                <p className="text-xl font-bold">
                  ${totalRetiros.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entregado</p>
                <p className="text-xl font-bold">
                  ${totalEntregado.toFixed(2)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Configuración de impresora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Impresora</Label>
                <Select
                  value={nombreImpresora}
                  onValueChange={setNombreImpresora}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona impresora" />
                  </SelectTrigger>
                  <SelectContent>
                    {impresoras.map((imp) => (
                      <SelectItem key={imp} value={imp}>
                        {imp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tamaño papel</Label>
                <Select
                  value={tamanoPapel}
                  onValueChange={(v) => setTamanoPapel(v as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="58mm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58 mm</SelectItem>
                    <SelectItem value="80mm">80 mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botón imprimir */}
            <div className="flex justify-end space-x-2">
              <Button variant="primary" onClick={handleImprimir}>
                Imprimir Corte
              </Button>
              <Link href="/dashboard/corte-caja/componentes">
                <Button variant="outline">Ir a Historial</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Para impresión real (media print) */}
      <pre
        ref={preRef}
        className="hidden print:block font-mono text-[8px] leading-tight whitespace-pre-wrap m-0 p-0"
      />
    </>
  );
}
