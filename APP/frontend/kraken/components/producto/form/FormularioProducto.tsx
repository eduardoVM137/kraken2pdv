"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { SeccionBasica } from "./SeccionBasica";
import { SeccionAtributos } from "./SeccionAtributos";
import { SeccionPresentaciones } from "./SeccionPresentaciones";
import { SeccionAlias } from "./SeccionAlias";
import { SeccionFotos } from "./SeccionFotos";
import { SeccionUbicaciones } from "./SeccionUbicaciones";
import { SeccionComponentes } from "./SeccionComponentes";
import { SeccionInventarios } from "./SeccionInventarios";
import { SeccionPrecios } from "./SeccionPrecios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

const productoSchema = z.object({
  producto_id: z.coerce.number(),
  medida: z.coerce.number(),
  unidad_medida: z.string(),
  marca_id: z.string(),
  descripcion: z.string().optional(),
  nombre_calculado: z.string(),
  activo: z.boolean().default(true),

  atributo: z.object({ nombre: z.string() }).optional(),
  detalles_atributo: z.array(z.object({ valor: z.string() })),

  componentes: z.array(z.object({
    detalle_producto_padre_id: z.coerce.number(),
    cantidad: z.coerce.number(),
  })),

  presentaciones: z.array(z.object({
    idVirtualPresentacion: z.string(),
    nombre: z.string(),
    cantidad: z.coerce.number(),
    descripcion: z.string().optional(),
  })),

  etiquetas: z.array(z.object({
    tipo: z.string().optional(),
    alias: z.string(),
    visible: z.boolean().optional(),
    idVirtualPresentacion: z.string().optional(),
  })),

  fotos: z.array(z.string().url()),

  inventarios: z.array(z.object({
    idVirtual: z.string(),
    stock_actual: z.coerce.number(),
    stock_minimo: z.coerce.number(),
    precio_costo: z.coerce.number(),
    ubicacion_fisica_id: z.coerce.number(),
    proveedor_id: z.coerce.number(),
    celdas: z.array(z.object({
      contenedor_fisico_id: z.coerce.number(),
      celda_id: z.coerce.number(),
      cantidad: z.coerce.number(),
    })),
  })),

  precios: z.array(z.object({
    idVirtual: z.string(),
    precio_venta: z.coerce.number(),
    tipo_cliente_id: z.coerce.number(),
    vigente: z.boolean().default(true),
    fecha_inicio: z.string().optional(),
    fecha_fin: z.string().optional(),
    cliente_id: z.coerce.number().optional(),
    cantidad_minima: z.coerce.number().optional(),
    precio_base: z.coerce.number().optional(),
    prioridad: z.coerce.number().optional(),
    descripcion: z.string().optional(),
    idVirtualPresentacion: z.string().optional(),
  })),
producto_ubicaciones: z.array(z.object({
  ubicacion_fisica_id: z.coerce.number(),
  negocio_id: z.coerce.number(),
  idVirtualInventario: z.array(z.string()),
  idVirtualPrecio: z.array(z.string()),
  compartir: z.boolean().optional(),
}))
    .min(1, "Debes agregar al menos una ubicación lógica"),
});

export type ProductoFormData = z.infer<typeof productoSchema>;

const transformarDataAlFormulario = (data: any): ProductoFormData => ({
  producto_id: data.producto_id,
  marca_id: data.marca_id,
  medida: Number(data.medida),
  unidad_medida: data.unidad_medida,
  descripcion: data.descripcion,
  nombre_calculado: data.nombre_calculado,
  activo: data.activo,
  fotos: data.multimedia?.map((m: any) => m.url) ?? [],
  atributo: data.atributo ?? undefined,
  detalles_atributo: data.detalle_atributo ?? [],
  componentes: data.componentes_hijo ?? [],
  presentaciones: data.presentaciones?.map(p => ({ ...p, idVirtualPresentacion: `pres_${p.id}` })) ?? [],
  etiquetas: data.etiquetas ?? [],
  precios: data.precios?.map(p => ({ ...p, idVirtual: `price_${p.id}` })) ?? [],
  inventarios: data.inventarios?.map(i => ({ ...i, idVirtual: `inv_${i.id}` })) ?? [],
  producto_ubicaciones: data.ubicaciones?.map((u: any) => ({
    ...u,
    idVirtualInventario: u.inventario_id ? `inv_${u.inventario_id}` : undefined,
    idVirtualPrecio: u.precio_id ? `price_${u.precio_id}` : undefined,
  })) ?? [],
});

export const FormularioProducto = ({ id }: { id?: number }) => {
  const form = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      activo: true,
      fotos: [],
      presentaciones: [],
      etiquetas: [],
      detalles_atributo: [],
      componentes: [],
      inventarios: [],
      precios: [],
      producto_ubicaciones: [],
    },
  });

  const { reset, handleSubmit } = form;
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const res = await fetch(`${API_BASE}/api/detalle-producto/${id}`);
      const data = await res.json();
      const parsed = transformarDataAlFormulario(data);
      reset(parsed);
      setLoading(false);
    };
    load();
  }, [id, reset]);
  
  // Dentro de tu FormularioProducto, en el onSubmit:
const onSubmit = async (values: ProductoFormData) => {
  // 1) Limpiamos placeholders de inventario…
  const inventarios = values.inventarios.filter(
    (inv) => inv.idVirtual && inv.idVirtual !== "__NEW_INV__"
  );

  // 2) Convertimos array → string en producto_ubicaciones
  const producto_ubicaciones = values.producto_ubicaciones.map((u) => ({
    ubicacion_fisica_id: u.ubicacion_fisica_id,
    negocio_id: u.negocio_id,
    compartir: u.compartir ?? false,
    // aquí tomamos sólo el primer elemento (o cadena vacía si no hay)
    idVirtualInventario: u.idVirtualInventario?.[0] ?? "",
    idVirtualPrecio: u.idVirtualPrecio?.[0] ?? "",
  }));

  const payload = {
    ...values,
    inventarios,
    producto_ubicaciones,
  };

  try {
    const endpoint = id
      ? `${API_BASE}/api/detalle-producto/editar/${id}`
      : `${API_BASE}/api/detalle-producto`;
    const res = await fetch(endpoint, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Fallo la petición");
    toast.success(id ? "Actualizado" : "Creado");
    if (!id) reset();
  } catch (err) {
    console.error(err);
    toast.error("Error al guardar");
  }
};


  if (loading) return <p className="text-sm">Cargando producto...</p>;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="datos">
          <TabsList className="border-b w-full flex gap-2">
            <TabsTrigger value="datos">📝 Datos</TabsTrigger>
            <TabsTrigger value="componentes">🧩 Componentes</TabsTrigger>
          </TabsList>

          <TabsContent value="datos">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <SeccionFotos />
                <Accordion type="single" collapsible>
                  <AccordionItem value="atributos">
                    <AccordionTrigger>🔠 Atributos</AccordionTrigger>
                    <AccordionContent><SeccionAtributos /></AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="presentaciones">
                    <AccordionTrigger>📦 Presentaciones</AccordionTrigger>
                    <AccordionContent><SeccionPresentaciones /></AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="alias">
                    <AccordionTrigger>🏷️ Alias / Códigos</AccordionTrigger>
                    <AccordionContent><SeccionAlias /></AccordionContent>
                  </AccordionItem>
            
                </Accordion>
              </div>
              <div className="space-y-4">
                <SeccionBasica />
                <SeccionUbicaciones />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="componentes">
            <SeccionComponentes />
          </TabsContent>
        </Tabs>

     <div className="text-right">
        <Button type="submit">
          {id ? "💾 Guardar cambios" : "➕ Crear producto"}
        </Button>
        </div>
      </form>
    </FormProvider>
  );
};
