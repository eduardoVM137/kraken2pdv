"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { ProductStats } from "./components/ProductStats";
import { ProductToolbar } from "./components/ProductToolbar";
import { ProductTable } from "./components/ProductTable";
import HistorialAuditoria from "./components/HistorialAuditoria";
import DetalleUbicacion from "./components/DetalleUbicacion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getListaProductos } from "@/lib/fetchers/productos";
import { verAuditoriaProducto } from "@/lib/fetchers/auditoria";

export default function ProductosPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [tabActiva, setTabActiva] = useState("catalogo");
  const [detalleProductoSeleccionado, setDetalleProductoSeleccionado] = useState<number | null>(null);
  const [movimientos, setMovimientos] = useState<{
    movimientos_stock: any[];
    movimientos_precio: any[];
  } | null>(null);

  useEffect(() => {
    getListaProductos()
      .then(setProductos)
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  const verAuditoria = async (detalle_producto_id: number) => {
    try {
      const data = await verAuditoriaProducto(detalle_producto_id);
      setMovimientos({
        movimientos_stock: data.movimientos_stock,
        movimientos_precio: data.movimientos_precio,
      });
      setDetalleProductoSeleccionado(detalle_producto_id);
      setTabActiva("auditoria");
    } catch (err) {
      console.error("Error al cargar auditoría:", err);
      alert("Error al cargar movimientos");
    }
  };

  const verUbicacion = (detalle_producto_id: number) => {
    setDetalleProductoSeleccionado(detalle_producto_id);
    setTabActiva("ubicacion");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-primary">Productos</h1>

      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="w-full flex justify-start flex-wrap gap-2 mb-4">
          <TabsTrigger value="catalogo">Gestión general del producto</TabsTrigger>
          <TabsTrigger value="ubicacion">Detalle de producto / Ubicación</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoría y estado</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogo" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">Top Sellers</Button>
            <Button variant="secondary" size="sm">Low Margin Alerts</Button>
            <Button variant="secondary" size="sm">Inactive Log</Button>
            <Button variant="secondary" size="sm">Enable Online Sales</Button>
            <Button variant="secondary" size="sm">Expiration Control</Button>
          </div>

<ProductStats productos={productos} />
          <ProductToolbar productos={productos} />
          <ProductTable
            productos={productos}
            onVerAuditoria={verAuditoria}
            onVerUbicacion={verUbicacion}
          />
        </TabsContent>

        <TabsContent value="ubicacion">
          {detalleProductoSeleccionado ? (
            <DetalleUbicacion detalleProductoId={detalleProductoSeleccionado} />
          ) : (
            <p className="text-muted-foreground">Selecciona un producto desde el catálogo.</p>
          )}
        </TabsContent>

        <TabsContent value="auditoria">
          {movimientos ? (
            <HistorialAuditoria
              detalleProductoId={detalleProductoSeleccionado!}
              movimientos={movimientos}
            />
          ) : (
            <p className="text-muted-foreground">
              Selecciona un producto desde el catálogo para ver su historial.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
