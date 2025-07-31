
// frontend/components/producto/ProductoCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductoCardProps {
  producto: {
    id: number;
    nombre_calculado: string;
    medida: string;
    unidad_medida: string;
    descripcion?: string;
    activo?: boolean;
    fotos?: string[];
  };
}

export const ProductoCard = ({ producto }: ProductoCardProps) => {
  return (
    <Card className="shadow-md">
      {producto.fotos?.[0] && (
        <img
          src={producto.fotos[0]}
          alt={producto.nombre_calculado}
          className="w-full h-40 object-cover rounded-t-md"
        />
      )}

      <CardHeader>
        <CardTitle className="text-lg">
          {producto.nombre_calculado} ({producto.medida} {producto.unidad_medida})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {producto.descripcion && (
          <p className="text-sm text-muted-foreground">
            {producto.descripcion}
          </p>
        )}

        <div className="flex justify-between items-center mt-4">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              producto.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {producto.activo ? "Activo" : "Inactivo"}
          </span>

          <Button size="sm" variant="outline" asChild>
            <Link href={`/dashboard/productos/${producto.id}`}>Editar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
