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

  // Si usas rutas relativas en imágenes, cambia a .string()
  fotos: z.array(z.string()),

  inventarios: z.array(z.object({
    idVirtual: z.string(),
    stock_actual: z.coerce.number(),
    stock_minimo: z.coerce.number(),
    precio_costo: z.coerce.number(),

    // AHORA OPCIONAL: si no lo capturas en UI, no bloquea submit
    ubicacion_fisica_id: z.preprocess(
      (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
      z.number().int().min(1, "Selecciona una ubicación").optional()
    ),

    proveedor_id: z.preprocess(
      (v) => (v === 0 || v === '0' || v === '' ? null : Number(v)),
      z.number().int().nullable()
    ),

    // celda_id opcional/nullable, contenedor y cantidad obligatorios
    celdas: z.array(z.object({
      contenedor_fisico_id: z.coerce.number().int().min(1),
      celda_id: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
        z.number().int().min(1).nullable()
      ),
      cantidad: z.coerce.number().min(0),
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
    ubicacion_fisica_id: z.preprocess(
      (v) => (v === '' || v === null ? undefined : Number(v)),
      z.number().int().min(1, "Selecciona una ubicación")
    ),
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
inventarios: (data.inventarios ?? []).map((i: any) => ({
    ...i,
    idVirtual: `inv_${i.id}`,
    ubicacion_fisica_id: i.ubicacion_fisica_id ?? undefined, // ← nunca 0
    proveedor_id: i.proveedor_id ?? null,
    celdas: (i.celdas ?? []).map((c: any) => ({
      contenedor_fisico_id: c.contenedor_fisico_id,
      celda_id: c.celda_id ?? undefined, // opcional
      cantidad: c.cantidad,
    })),
  })),
producto_ubicaciones: (data.ubicaciones ?? []).map((u: any) => ({
    ...u,
    idVirtualInventario: u.inventario_id ? [`inv_${u.inventario_id}`] : [],
    idVirtualPrecio:     u.precio_id     ? [`price_${u.precio_id}`]   : [],
  })),
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
  const sanitizeCeldas = (arr?: any[]) =>
  (arr ?? [])
    // filtra filas “vacías” por si el usuario agregó y no llenó nada
    .filter(c => c && (c.contenedor_fisico_id && c.cantidad !== undefined))
    .map(c => ({
      celda_id: c.celda_id ? Number(c.celda_id) : null,
      contenedor_fisico_id: Number(c.contenedor_fisico_id),
      cantidad: Number(c.cantidad),
    }));

  // Dentro de tu FormularioProducto, en el onSubmit:
const onSubmit = async (values: ProductoFormData) => {
  // 1) Fuera placeholders
  const inventarios = values.inventarios
    .filter(inv => inv.idVirtual && inv.idVirtual !== "__NEW_INV__")
    .map(inv => ({
      ...inv,
      ubicacion_fisica_id: Number(inv.ubicacion_fisica_id), // ← garantizado por Zod
      proveedor_id: inv.proveedor_id ?? null,
      celdas: sanitizeCeldas(inv.celdas),
    }));

  // 2) Aplana arrays de virtuales (tu BE espera string)
  const producto_ubicaciones = values.producto_ubicaciones.map(u => ({
    ubicacion_fisica_id: Number(u.ubicacion_fisica_id),
    negocio_id: Number(u.negocio_id),
    compartir: u.compartir ?? false,
    idVirtualInventario: u.idVirtualInventario?.[0] ?? "",
    idVirtualPrecio:     u.idVirtualPrecio?.[0] ?? "",
  }));

  // 3) Precios limpios (evita 0)
  const precios = values.precios.map(p => ({
    ...p,
    precio_venta: Number(p.precio_venta),
    tipo_cliente_id: p.tipo_cliente_id ?? null,
  }));

  const payload = { ...values, inventarios, producto_ubicaciones, precios };

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
