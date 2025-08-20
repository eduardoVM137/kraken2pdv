// app/dashboard/ventas/components/BuscadorProductos.tsx
"use client";

import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  busqueda: string;
  setBusqueda: (value: string) => void;
  setPaginaActual: (value: number) => void;
  buscarPorAlias: boolean;
  setBuscarPorAlias: (value: boolean) => void;
  onSearchEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const BuscadorProductos = forwardRef<HTMLInputElement, Props>(
  (
    {
      busqueda,
      setBusqueda,
      setPaginaActual,
      buscarPorAlias,
      setBuscarPorAlias,
      onSearchEnter,
    },
    ref
  ) => {
    return (
      <div className="flex gap-4 flex-wrap items-center mb-6">
    <Input
  ref={ref}
  placeholder="Buscar producto..."
  className="flex-1 min-w-[200px]"
  value={busqueda}
  onChange={(e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  }}
  onKeyDown={(e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setBuscarPorAlias((prev) => !prev);
    }
    onSearchEnter(e); // ← sigue funcionando Enter
  }}
/>

        <Button onClick={() => setPaginaActual(1)}>Buscar</Button>
        <div className="flex flex-col items-start text-sm">
          <div className="flex items-center gap-2">
 <div
  onClick={() => {
    setBuscarPorAlias((prev) => {
      setPaginaActual(1);
      return !prev;
    });
  }}
  className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${
    buscarPorAlias ? "bg-black" : "bg-gray-400"
  }`}
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      setBuscarPorAlias((prev) => {
        setPaginaActual(1);
        return !prev;
      });
    }
  }}
>
  <div
    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
      buscarPorAlias ? "translate-x-6" : "translate-x-0"
    }`}
  />
</div>


            <Label>{`Actualmente buscando por: ${
              buscarPorAlias ? "Alias" : "Nombre"
            }`}</Label>
          </div>
        </div>
      </div>
    );
  }
);

BuscadorProductos.displayName = "BuscadorProductos";

export default BuscadorProductos;
