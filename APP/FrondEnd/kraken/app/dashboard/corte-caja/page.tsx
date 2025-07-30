// src/components/CorteCajaForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/**
 * Componente para realizar el Corte de Caja.
 * - Captura fechas automáticamente.
 * - Obtiene totales de ventas y retiros vía API.
 * - Solo imprime el texto plano en papel de 58mm.
 */
const CorteCajaForm: React.FC = () => {
  const [empleadoId, setEmpleadoId] = useState<number | "">("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [fondoInicial, setFondoInicial] = useState<number>(0);
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [totalRetiros, setTotalRetiros] = useState<number>(0);
  const [totalEntregado, setTotalEntregado] = useState<number>(0);
  const preRef = useRef<HTMLPreElement>(null);

  // Inicializar fechas al cargar
  useEffect(() => {
    const now = new Date();
    const iso = now.toISOString().slice(0, 16);
    setFechaInicio(iso);
    setFechaFin(iso);
  }, []);

  // Pedir totales vía API
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      fetch(
        `/api/corte-caja/resumen?from=${encodeURIComponent(fechaInicio)}&to=${encodeURIComponent(fechaFin)}`
      )
        .then((res) => res.json())
        .then((data) => {
          setTotalVentas(data.totalVentas ?? 0);
          setTotalRetiros(data.totalRetiros ?? 0);
        })
        .catch(() => {
          setTotalVentas(0);
          setTotalRetiros(0);
        });
    }
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
    const lines: string[] = [];
    const add = (txt = "") => lines.push(txt);
    add("COMPROBANTE DE CORTE");
    add("Mi Negocio S.A. de C.V.");
    add("RFC: XXXXXXXXXXXXX");
    add("------------------------------");
    add(`ID Empleado: ${empleadoId}`);
    add(`Inicio     : ${fechaInicio ? new Date(fechaInicio).toLocaleString() : "-"}`);
    add(`Fin        : ${fechaFin ? new Date(fechaFin).toLocaleString() : "-"}`);
    add("------------------------------");
    add(`Fondo Init.: $${fondoInicial.toFixed(2)}`);
    add(`Ventas     : $${totalVentas.toFixed(2)}`);
    add(`Retiros    : $${totalRetiros.toFixed(2)}`);
    add("------------------------------");
    add(`Entregado  : $${totalEntregado.toFixed(2)}`);
    add("------------------------------");
    add("Este comprobante no tiene valor fiscal.");
    add("");
    add("Firma: ________________");
    add("");
    add(`Emitido: ${new Date().toLocaleString()}`);

    preRef.current.textContent = lines.join("\n");
    window.print();
  };

  return (
    <>
      {/* ——— UI solo en pantalla ——— */}
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
              onChange={(e) =>
                setEmpleadoId(e.target.value === "" ? "" : +e.target.value)
              }
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

      {/* ——— Comprobante solo en impresión ——— */}
      <pre
        ref={preRef}
        className="hidden print:block font-mono whitespace-pre-wrap m-0 p-0"
      />
    </>
  );
};

export default CorteCajaForm;
