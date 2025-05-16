// frontend/components/producto/form/SeccionDetalleProductoCelda.tsx
"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  PackageSearch,
  LayoutGrid,
  Hash,
  Package,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProductoFormData } from "./FormularioProducto";

/** path: ruta al array dentro del formulario (ej. "detalle_celdas") */
export const SeccionDetalleProductoCelda = ({ path }: { path: string }) => {
  const { control, setValue } = useFormContext<ProductoFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: path as any,
  });

  /* todos los inventarios existentes => para Select */
  const inventarios = useWatch({ control, name: "inventarios" }) || [];

  /* blur que convierte a número */
  const blur =
    (idx: number, field: string) =>
    (e: React.FocusEvent<HTMLInputElement>) =>
      setValue(
        `${path}.${idx}.${field}`,
        e.target.value === "" ? undefined : Number(e.target.value)
      );

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

  return (
    <div className="space-y-3">
      {fields.map((c, idx) => (
        <div
          key={c.id}
          className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end border p-3 rounded-md"
        >
          {/* inventario al que pertenece  */}
          <Field label="Inventario virtual" icon={<Package className="h-4 w-4" />}>
            <Select
              defaultValue={c.idVirtualInventario ?? ""}
              onValueChange={(v) =>
                setValue(`${path}.${idx}.idVirtualInventario`, v)
              }
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Selecciona…" />
              </SelectTrigger>
              <SelectContent>
                {inventarios.map((inv: any) => (
                  <SelectItem key={inv.idVirtual} value={inv.idVirtual}>
                    {inv.idVirtual}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Contenedor" icon={<LayoutGrid className="h-4 w-4" />}>
            <Input
              type="text"
              inputMode="numeric"
              className="pl-10"
              defaultValue={c.contenedor_fisico_id ?? ""}
              onBlur={blur(idx, "contenedor_fisico_id")}
            />
          </Field>

          <Field label="Celda" icon={<Hash className="h-4 w-4" />}>
            <Input
              type="text"
              inputMode="numeric"
              className="pl-10"
              defaultValue={c.celda_id ?? ""}
              onBlur={blur(idx, "celda_id")}
            />
          </Field>

          <Field label="Cantidad" icon={<PackageSearch className="h-4 w-4" />}>
            <Input
              type="text"
              inputMode="numeric"
              className="pl-10"
              defaultValue={c.cantidad ?? ""}
              onBlur={blur(idx, "cantidad")}
            />
          </Field>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="sm:col-span-4"
            onClick={() => remove(idx)}
          >
            Eliminar
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            idVirtualInventario: "",
            contenedor_fisico_id: undefined,
            celda_id: undefined,
            cantidad: undefined,
          })
        }
      >
        + Agregar celda
      </Button>
    </div>
  );
};
