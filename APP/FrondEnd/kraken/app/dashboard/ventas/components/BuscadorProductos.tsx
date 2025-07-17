"use client";

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
}

export default function BuscadorProductos({
  busqueda,
  setBusqueda,
  setPaginaActual,
  buscarPorAlias,
  setBuscarPorAlias,
}: Props) {
  return (
    <div className="flex gap-4 flex-wrap items-center mb-6">
      <Input
        placeholder="Buscar producto..."
        className="flex-1 min-w-[200px]"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setPaginaActual(1);
        }}
      />
      <Button onClick={() => setPaginaActual(1)}>Buscar</Button>
      <div className="flex flex-col items-start text-sm">
        <div className="flex items-center gap-2">
          <Switch
            checked={buscarPorAlias}
            onCheckedChange={(checked) => {
              setBuscarPorAlias(checked);
              setPaginaActual(1);
            }}
          />
          <Label>{`Actualmente buscando por: ${buscarPorAlias ? "Alias" : "Nombre"}`}</Label>
        </div>
      </div>
    </div>
  );
}
