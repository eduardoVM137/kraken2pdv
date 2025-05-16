// frontend/components/producto/form/SeccionInventarios.tsx
"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import {
  PackageSearch,
  AlertTriangle,
  DollarSign,
  Truck,
  LayoutGrid,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductoFormData } from "./FormularioProducto";

/* ───────────────────── helpers de UI ───────────────────── */
const Field = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactElement;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className="text-xs">{label}</Label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      {children}
    </div>
  </div>
);

/* ───────────────────── componente principal ───────────────────── */
export const SeccionInventarios = ({
  inv,
  idVirtual,
  inventarios,
  setValue,
}: {
  inv: any;
  idVirtual: string;
  inventarios: any[];
  setValue: any;
}) => {
  const { control } = useFormContext<ProductoFormData>();

  /* ========  celdas internas  ======== */
  const {
    fields: celdaFields,
    append: appendCelda,
    remove: removeCelda,
  } = useFieldArray({
    control,
    name: `inventarios.${inventarios.findIndex(
      (i: any) => i.idVirtual === idVirtual
    )}.celdas`,
  });

  /* envía al store RHF (sin controlar el input) */
  const commit = (field: string, val: any) =>
    setValue(
      "inventarios",
      inventarios.map((i: any) =>
        i.idVirtual === idVirtual ? { ...i, [field]: val } : i
      )
    );

  const blurNum =
    (field: string) => (e: React.FocusEvent<HTMLInputElement>) =>
      commit(
        field,
        e.target.value === "" ? undefined : Number(e.target.value)
      );

  const blurCelda =
    (index: number, field: string) =>
    (e: React.FocusEvent<HTMLInputElement>) =>
      setValue(
        `inventarios.${inventarios.findIndex(
          (i: any) => i.idVirtual === idVirtual
        )}.celdas.${index}.${field}`,
        e.target.value === "" ? undefined : Number(e.target.value)
      );

  return (
    <div className="space-y-4">
      {/* título */}
      <div className="flex items-center gap-2 mb-1">
        <PackageSearch className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-semibold">Inventario</p>
      </div>

      {/* básicos + proveedor (obligatorio) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Field label="Stock actual" icon={<PackageSearch className="h-4 w-4" />}>
          <Input
            type="text"
            inputMode="decimal"
            className="pl-10"
            defaultValue={inv?.stock_actual ?? ""}
            onBlur={blurNum("stock_actual")}
          />
        </Field>

        <Field label="Stock mínimo" icon={<AlertTriangle className="h-4 w-4" />}>
          <Input
            type="text"
            inputMode="decimal"
            className="pl-10"
            defaultValue={inv?.stock_minimo ?? ""}
            onBlur={blurNum("stock_minimo")}
          />
        </Field>

        <Field label="Precio costo" icon={<DollarSign className="h-4 w-4" />}>
          <Input
            type="text"
            inputMode="decimal"
            className="pl-10"
            defaultValue={inv?.precio_costo ?? ""}
            onBlur={blurNum("precio_costo")}
          />
        </Field>

        <Field label="Proveedor ID" icon={<Truck className="h-4 w-4" />}>
          <Input
            type="text"
            inputMode="numeric"
            className="pl-10"
            defaultValue={inv?.proveedor_id ?? ""}
            onBlur={blurNum("proveedor_id")}
            required
          />
        </Field>
      </div>

      {/* --- celdas --- */}
      <Accordion type="single" collapsible>
        <AccordionItem value="cel">
          <AccordionTrigger className="text-xs hover:no-underline">
            Celdas (contenedor / celda / cantidad)
          </AccordionTrigger>
          <AccordionContent className="pt-3 space-y-3">
            {celdaFields.map((celda, idx) => (
              <div
                key={celda.id}
                className="grid grid-cols-3 gap-2 items-end border p-2 rounded-md"
              >
                <Field
                  label="Contenedor ID"
                  icon={<LayoutGrid className="h-4 w-4" />}
                >
                  <Input
                    type="text"
                    inputMode="numeric"
                    className="pl-10"
                    defaultValue={celda.contenedor_fisico_id ?? ""}
                    onBlur={blurCelda(idx, "contenedor_fisico_id")}
                  />
                </Field>
                <Field label="Celda ID" icon={<Hash className="h-4 w-4" />}>
                  <Input
                    type="text"
                    inputMode="numeric"
                    className="pl-10"
                    defaultValue={celda.celda_id ?? ""}
                    onBlur={blurCelda(idx, "celda_id")}
                  />
                </Field>
                <Field label="Cantidad" icon={<PackageSearch className="h-4 w-4" />}>
                  <Input
                    type="text"
                    inputMode="numeric"
                    className="pl-10"
                    defaultValue={celda.cantidad ?? ""}
                    onBlur={blurCelda(idx, "cantidad")}
                  />
                </Field>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="col-span-3"
                  onClick={() => removeCelda(idx)}
                >
                  Eliminar celda
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendCelda({
                  contenedor_fisico_id: undefined,
                  celda_id: undefined,
                  cantidad: undefined,
                })
              }
            >
              + Agregar celda
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
