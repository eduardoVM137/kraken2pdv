// src/components/CorteCajaForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CorteCajaForm: React.FC = () => {
  const [empleadoId, setEmpleadoId] = useState<number | "">("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [fondoInicial, setFondoInicial] = useState<number>(0);
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [totalRetiros, setTotalRetiros] = useState<number>(0);
  const [totalEntregado, setTotalEntregado] = useState<number>(0);
  const preRef = useRef<HTMLPreElement>(null);

  // Fechas iniciales
  useEffect(() => {
    const now = new Date().toISOString().slice(0, 16);
    setFechaInicio(now);
    setFechaFin(now);
  }, []);

  // Traer totales
  useEffect(() => {
    if (!fechaInicio || !fechaFin) return;
    fetch(`/api/corte-caja/resumen?from=${encodeURIComponent(fechaInicio)}&to=${encodeURIComponent(fechaFin)}`)
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

  // Calcular entregado
  useEffect(() => {
    setTotalEntregado(parseFloat((fondoInicial + totalVentas - totalRetiros).toFixed(2)));
  }, [fondoInicial, totalVentas, totalRetiros]);

  const handleCloseCaja = async () => {
    await fetch("/api/corte-caja", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idempleado_usuario: empleadoId,
        fecha_hora_inicio: fechaInicio,
        fecha_hora_fin: fechaFin,
        fondo_inicial: fondoInicial,
        total_ventas: totalVentas,
        total_retiros: totalRetiros,
        total_entregado: totalEntregado,
      }),
    });
  };

  const handlePrint = () => {
    if (!preRef.current) return;
    const lines = [
      "COMPROBANTE DE CORTE",
      "Mi Negocio S.A. de C.V.",
      "RFC: XXXXXXXXXXXXX",
      "------------------------------",
      `ID Empleado: ${empleadoId}`,
      `Inicio     : ${fechaInicio ? new Date(fechaInicio).toLocaleString() : "-"}`,
      `Fin        : ${fechaFin    ? new Date(fechaFin).toLocaleString()     : "-"}`,
      "------------------------------",
      `Fondo Init.: $${fondoInicial.toFixed(2)}`,
      `Ventas     : $${totalVentas.toFixed(2)}`,
      `Retiros    : $${totalRetiros.toFixed(2)}`,
      "------------------------------",
      `Entregado  : $${totalEntregado.toFixed(2)}`,
      "------------------------------",
      "Este comprobante no tiene valor fiscal.",
      "Firma: ________________",
      `Emitido: ${new Date().toLocaleString()}`,
    ];
    preRef.current.textContent = lines.join("\n").trimEnd();
    window.print();
  };

  return (
    <>
      {/* inyectamos SOLO @page para la impresora */}
      <style jsx global>{`
        @media print {
          @page {
            size: 58mm auto portrait;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>

      {/* — Pantalla: todo menos el pre — */}
      <div className="space-y-6 p-6 print:hidden">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Corte de Caja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Empleado (ID)</Label>
            <Input
              type="number"
              value={empleadoId}
              onChange={(e) => setEmpleadoId(e.target.value === "" ? "" : +e.target.value)}
            />
            <Label>Fecha y Hora Inicio</Label>
            <Input
              type="datetime-local"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <Label>Fecha y Hora Fin</Label>
            <Input
              type="datetime-local"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <Separator />
            <Label>Fondo Inicial</Label>
            <Input
              type="number"
              step="0.01"
              value={fondoInicial}
              onChange={(e) => setFondoInicial(+e.target.value)}
            />
            <Label>Total Ventas</Label>
            <Input type="number" value={totalVentas} readOnly />
            <Label>Total Retiros</Label>
            <Input type="number" value={totalRetiros} readOnly />
            <Label>Total Entregado</Label>
            <Input type="number" value={totalEntregado} readOnly />
            <div className="flex justify-between pt-4">
              <Button onClick={handleCloseCaja}>Cerrar Caja</Button>
              <Button variant="outline" onClick={handlePrint}>
                Imprimir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* — Impresión: sólo este <pre> — */}
<pre
  ref={preRef}
  className={`
    hidden
    print:block
    font-mono
    text-[8px]
    leading-tight
    whitespace-pre-wrap
    m-0
    p-0
  `}
/>


    </>
  );
};

export default CorteCajaForm;
