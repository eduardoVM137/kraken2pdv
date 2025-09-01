"use client";
import { Button } from "@/components/ui/button";

interface Props {
  totalPaginas: number;
  paginaActual: number;
  setPaginaActual: (value: number) => void;
}

export default function PaginacionProductos({
  totalPaginas,
  paginaActual,
  setPaginaActual,
}: Props) {
  const generarBotones = () => {
    const botones = [];
    const maxVisible = 7;

    if (totalPaginas <= maxVisible) {
      for (let i = 1; i <= totalPaginas; i++) botones.push(i);
    } else {
      botones.push(1);
      if (paginaActual > 4) botones.push("...");

      const start = Math.max(2, paginaActual - 1);
      const end = Math.min(totalPaginas - 1, paginaActual + 1);

      for (let i = start; i <= end; i++) botones.push(i);

      if (paginaActual < totalPaginas - 3) botones.push("...");
      botones.push(totalPaginas);
    }

    return botones;
  };

  return (
    <div className="flex justify-center gap-1 mt-2 text-xs">
      <Button
        size="icon"
        variant="ghost"
        disabled={paginaActual === 1}
        onClick={() => setPaginaActual(1)}
      >
        «
      </Button>

      {generarBotones().map((n, i) =>
        typeof n === "number" ? (
          <Button
            key={i}
            size="icon"
            variant={paginaActual === n ? "default" : "outline"}
            onClick={() => setPaginaActual(n)}
          >
            {n}
          </Button>
        ) : (
          <span key={i} className="px-1">
            …
          </span>
        )
      )}

      <Button
        size="icon"
        variant="ghost"
        disabled={paginaActual === totalPaginas}
        onClick={() => setPaginaActual(totalPaginas)}
      >
        »
      </Button>
    </div>
  );
}
