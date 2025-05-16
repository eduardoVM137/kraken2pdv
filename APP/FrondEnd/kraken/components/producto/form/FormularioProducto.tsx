"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver }            from "@hookform/resolvers/zod";
import { z }                      from "zod";
import { Button }                 from "@/components/ui/button";
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

/* Secciones */
import { SeccionBasica }         from "./SeccionBasica";
import { SeccionAtributos }      from "./SeccionAtributos";
import { SeccionPresentaciones } from "./SeccionPresentaciones";
import { SeccionAlias }          from "./SeccionAlias";
import { SeccionFotos }          from "./SeccionFotos";
import { SeccionUbicaciones }    from "./SeccionUbicaciones";
import { SeccionComponentes }    from "./SeccionComponentes";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
/* ─────────────────────── Zod schema ─────────────────────── */
const productoSchema = z.object({
  producto_id:      z.coerce.number(),
  medida:           z.coerce.number(),
  unidad_medida:    z.string(),
  marca_id:         z.string(),
  descripcion:      z.string().optional(),
  nombre_calculado: z.string().min(1, "Nombre calculado requerido"),
  activo:           z.boolean().default(true),

  atributo: z.object({ nombre: z.string() }).optional(),
  detalles_atributo: z.array(z.object({ valor: z.string() })).optional(),

  componentes: z
    .array(
      z.object({
        detalle_producto_padre_id: z.coerce.number(),
        cantidad: z.coerce.number(),
      })
    )
    .optional(),

  /* ── presentaciones & alias ── */
  presentaciones: z
    .array(
      z.object({
        idVirtualPresentacion: z.string(),
        nombre:   z.string(),
        cantidad: z.coerce.number(),
        descripcion: z.string().optional(),
      })
    )
    .optional(),

  etiquetas: z
    .array(
      z.object({
        tipo: z.string().optional(),
        alias: z.string(),
        visible: z.boolean().optional(),
        idVirtualPresentacion: z.string().optional(),
      })
    )
    .optional(),

  fotos: z.array(z.string().url()).optional(),

  /* ── Inventarios ── */
  inventarios: z
    .array(
      z.object({
        idVirtual: z.string(),
        stock_actual: z.coerce.number(),
        stock_minimo: z.coerce.number(),
        precio_costo: z.coerce.number(),
        ubicacion_fisica_id: z.coerce.number(),
        proveedor_id: z.coerce.number(),            // ← obligatorio
        celdas: z
          .array(
            z.object({
              contenedor_fisico_id: z.coerce.number(),
              celda_id: z.coerce.number(),
              cantidad: z.coerce.number(),
            })
          )
          .optional(),
      })
    )
    .optional(),

  /* ── Precios ── */
  precios: z
    .array(
      z.object({
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
      })
    )
    .optional(),

  /* ── Ubicaciones ── */
  producto_ubicaciones: z
    .array(
      z.object({
        ubicacion_fisica_id: z.coerce.number(),
        negocio_id: z.coerce.number(),
        idVirtualInventario: z.string().optional(),
        idVirtualPrecio: z.string().optional(),
        compartir: z.boolean().optional(),
      })
    )
    .optional(),
});

export type ProductoFormData = z.infer<typeof productoSchema>;

/* ─────────────────────── Componente ─────────────────────── */
export const FormularioProducto = () => {
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

  /* -------- envío -------- */
  const onSubmit = async (values: ProductoFormData) => {
    const payload = {
      ...values,
      /* compresión simple de arrays si quieres filtrar nulos: */
      producto_ubicaciones: values.producto_ubicaciones?.map((u) => ({
        ubicacion_fisica_id: u.ubicacion_fisica_id,
        negocio_id: u.negocio_id,
        ...(u.idVirtualInventario && { idVirtualInventario: u.idVirtualInventario }),
        ...(u.idVirtualPrecio     && { idVirtualPrecio:     u.idVirtualPrecio }),
        ...(typeof u.compartir === "boolean" && { compartir: u.compartir }),
      })),

      inventarios: values.inventarios?.map((inv) => ({
        ...inv,                                 // incluye proveedor_id
        celdas: (inv.celdas || []).map((c) => ({
          contenedor_fisico_id: c.contenedor_fisico_id,
          celda_id: c.celda_id,
          cantidad: c.cantidad,
        })),
      })),

      precios: values.precios?.map((p) => ({ ...p })),
    };

    console.log("📤 JSON enviado:", payload);

    try {
      await fetch("http://localhost:3001/api/detalle-producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("✅ Producto registrado correctamente");
    } catch (err) {
      console.error("❌ Error al registrar:", err);
    }
  };

  /* ─────────── UI ─────────── */
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="datos" className="w-full">
          <TabsList className="border-b w-full flex gap-2">
            <TabsTrigger value="datos">Datos básicos</TabsTrigger>
            <TabsTrigger value="componentes">Componentes</TabsTrigger>
          </TabsList>

          <TabsContent value="datos">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <SeccionFotos />

                <Accordion type="single" collapsible>
                  <AccordionItem value="atributos">
                    <AccordionTrigger>🧩 Atributos del producto</AccordionTrigger>
                    <AccordionContent>
                      <SeccionAtributos />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="present">
                    <AccordionTrigger>📦 Presentaciones</AccordionTrigger>
                    <AccordionContent>
                      <SeccionPresentaciones />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="alias">
                    <AccordionTrigger>🏷️ Alias y códigos</AccordionTrigger>
                    <AccordionContent>
                      <SeccionAlias />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="space-y-4">
                <SeccionBasica />

                {/* Ubicaciones incluye Inventarios / Precios internos */}
                <SeccionUbicaciones />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="componentes">
            <SeccionComponentes />
          </TabsContent>
        </Tabs>

        <Button type="submit">Guardar producto</Button>
      </form>
    </FormProvider>
  );
};
