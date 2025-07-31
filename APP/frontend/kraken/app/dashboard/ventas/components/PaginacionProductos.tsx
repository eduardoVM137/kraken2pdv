"use client";
import { Button } from "@/components/ui/button";

interface Props {
  totalPaginas: number;
  paginaActual: number;
  setPaginaActual: (value: number) => void;
}

export default function PaginacionProductos({ totalPaginas, paginaActual, setPaginaActual }: Props) {
  return (
    <div className="flex justify-center gap-1 mt-4">
      {Array.from({ length: totalPaginas }, (_, i) => (
        <Button
          key={i + 1}
          size="sm"
          variant={paginaActual === i + 1 ? "default" : "outline"}
          onClick={() => setPaginaActual(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
