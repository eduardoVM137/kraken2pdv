"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MockProductoDetalle() {
  const producto = {
    id: 97,
    nombre: "Pepsi 1L retornable",
    descripcion: "Bebida gaseosa en botella retornable de 1 litro",
    alias: ["pepsi1", "p-retornable", "bebida-pepsi"],
    stock_total: 400,
    estado: "Activo",
    created_at: "2024-05-01",
    updated_at: "2025-06-01",
    precios: [
      { tipo_cliente: "Público", precio: 15.5 },
      { tipo_cliente: "Mayorista", precio: 13.0 },
    ],
    inventario: [
      { ubicacion: "Estante A1", cantidad: 120 },
      { ubicacion: "Bodega", cantidad: 280 },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Producto: {producto.nombre}</h1>
        <Button asChild>
          <Link href={`/dashboard/productos/editar/${producto.id}`}>Editar</Link>
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="detalle">Detalle</TabsTrigger>
          <TabsTrigger value="precios">Precios</TabsTrigger>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="estado">Estado</TabsTrigger>
          <TabsTrigger value="busqueda">Búsqueda</TabsTrigger>
          <TabsTrigger value="dashboard">Indicadores</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {producto.nombre}</p>
            <p><strong>Descripción:</strong> {producto.descripcion}</p>
            <p><strong>Alias:</strong> {producto.alias.join(", ")}</p>
            <p><strong>Stock total:</strong> {producto.stock_total}</p>
            <p><strong>Creado en:</strong> {producto.created_at}</p>
          </div>
        </TabsContent>

        <TabsContent value="detalle">
          <p className="text-muted-foreground">Aquí puedes mostrar atributos, componentes, presentaciones, etc.</p>
        </TabsContent>

        <TabsContent value="precios">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Tipo de Cliente</th>
                <th className="text-left py-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {producto.precios.map((precio, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{precio.tipo_cliente}</td>
                  <td className="py-2">${precio.precio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="inventario">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Ubicación</th>
                <th className="text-left py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {producto.inventario.map((inv, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{inv.ubicacion}</td>
                  <td className="py-2">{inv.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="estado">
          <p><strong>Estado:</strong> {producto.estado}</p>
          <p><strong>Última modificación:</strong> {producto.updated_at}</p>
          <p className="text-muted-foreground">Aquí puede ir el historial de cambios, auditoría, logs, etc.</p>
        </TabsContent>

        <TabsContent value="busqueda">
          <p className="text-muted-foreground">
            Aquí puedes listar los alias, etiquetas, códigos internos, códigos de barras y su visibilidad en búsqueda.
          </p>
        </TabsContent>

        <TabsContent value="dashboard">
          <p className="text-muted-foreground">
            Aquí se pueden mostrar KPIs: rotación, ventas totales, stock por semana, alertas por caducidad, etc.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
