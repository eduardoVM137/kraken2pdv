"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductoCard } from "@/components/producto/ProductoCard";
import { getProductos } from "@/lib/fetchers/productos";

export default function ProductosPage() {
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    getProductos().then(setProductos).catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Catálogo de Productos</h1>
        <Button asChild>
          <Link href="/dashboard/productos/nuevo">+ Nuevo producto</Link>
        </Button>
      </div>

      {productos.length === 0 ? (
        <p className="text-muted-foreground">No hay productos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
