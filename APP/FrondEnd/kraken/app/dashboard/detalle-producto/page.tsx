// app/dashboard/detalle-producto/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DetalleProducto {
  id: number;
  producto_id: number;
  marca_id: string;
  medida: string;
  unidad_medida: string;
  descripcion: string | null;
  nombre_calculado: string;
  activo: boolean;
  atributo_id: number | null;
  state_id: number | null;
}

export default function DetalleProductoPage() {
  const [productos, setProductos] = useState<DetalleProducto[]>([]);
  const [filtros, setFiltros] = useState<{ producto_id: number | null; activo: boolean | null }>({ producto_id: null, activo: null });
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/detalle-producto")
      .then(res => res.json())
      .then(json => setProductos(json.data || []))
      .catch(err => console.error("Error al cargar detalle_producto:", err));
  }, []);

  const productosUnicos = [...new Set(productos.map(p => p.producto_id))];

  const productosFiltrados = productos.filter(p => {
    const porProducto = filtros.producto_id === null || p.producto_id === filtros.producto_id;
    const porActivo = filtros.activo === null || p.activo === filtros.activo;
    const porTexto = p.nombre_calculado.toLowerCase().includes(busqueda.toLowerCase());
    return porProducto && porActivo && porTexto;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-2">
        <Badge variant={filtros.producto_id === null ? "default" : "outline"} onClick={() => setFiltros(prev => ({ ...prev, producto_id: null }))}>
          Todos los productos
        </Badge>
        {productosUnicos.map(id => (
          <Badge
            key={id}
            variant={filtros.producto_id === id ? "default" : "outline"}
            onClick={() => setFiltros(prev => ({ ...prev, producto_id: id }))}
            className="cursor-pointer"
          >
            Producto #{id}
          </Badge>
        ))}
        <Badge variant={filtros.activo === null ? "default" : "outline"} onClick={() => setFiltros(prev => ({ ...prev, activo: null }))}>
          Todos
        </Badge>
        <Badge variant={filtros.activo === true ? "default" : "outline"} onClick={() => setFiltros(prev => ({ ...prev, activo: true }))}>
          Activos
        </Badge>
        <Badge variant={filtros.activo === false ? "default" : "outline"} onClick={() => setFiltros(prev => ({ ...prev, activo: false }))}>
          Inactivos
        </Badge>
      </div>

      <Input
        type="text"
        placeholder="Buscar por nombre..."
        className="max-w-sm"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {productosFiltrados.map(p => (
          <Card key={p.id}>
            <CardHeader className="font-semibold">{p.nombre_calculado}</CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{p.descripcion || "Sin descripción"}</p>
              <p className="text-xs mt-2">
                Medida: {p.medida} {p.unidad_medida} • Producto #{p.producto_id}
              </p>
              <p className={`text-xs font-bold mt-1 ${p.activo ? "text-green-600" : "text-red-600"}`}>{p.activo ? "Activo" : "Inactivo"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
