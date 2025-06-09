"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  busqueda: string;
  setBusqueda: (value: string) => void;
  setPaginaActual: (value: number) => void;
}

export default function BuscadorProductos({ busqueda, setBusqueda, setPaginaActual }: Props) {
  return (
    <div className="flex gap-2 mb-6">
      <Input
        placeholder="Código o nombre"
        className="w-full"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setPaginaActual(1);
        }}
      />
      <Button onClick={() => setPaginaActual(1)}>Buscar</Button>
    </div>
  );
}
