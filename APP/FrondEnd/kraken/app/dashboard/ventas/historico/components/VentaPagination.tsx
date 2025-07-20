// app/dashboard/ventas/historico/components/VentaPagination.tsx
"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  pageIndex: number;
  totalPages: number;
  onPageChange: (idx: number) => void;
}

const VentaPagination: FC<Props> = ({
  pageIndex,
  totalPages,
  onPageChange,
}) => (
  <div className="flex justify-between items-center mt-4">
    <Button
      size="sm"
      disabled={pageIndex <= 1}
      onClick={() => onPageChange(pageIndex - 1)}
    >
      Anterior
    </Button>
    <span>
      Página {pageIndex} de {totalPages}
    </span>
    <Button
      size="sm"
      disabled={pageIndex >= totalPages}
      onClick={() => onPageChange(pageIndex + 1)}
    >
      Siguiente
    </Button>
  </div>
);

export default VentaPagination;
