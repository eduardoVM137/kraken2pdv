// frontend/components/producto/form/SeccionComponentes.tsx
"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Puzzle, X } from "lucide-react";
import { ProductoFormData } from "./FormularioProducto";

export const SeccionComponentes = () => {
  const { control, register } = useFormContext<ProductoFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "componentes",
  });

  const addComp = () =>
    append({ detalle_producto_padre_id: 0, cantidad: 1 });

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Puzzle className="w-5 h-5" /> Componentes del producto
      </h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-1 md:grid-cols-3 gap-2 border border-muted rounded-lg p-3 bg-muted/40"
        >
          <div>
            <Label>ID prod. padre</Label>
            <Input
              type="number"
              {...register(
                `componentes.${index}.detalle_producto_padre_id`,
                { valueAsNumber: true }
              )}
            />
          </div>

          <div>
            <Label>Cantidad</Label>
            <Input
              type="number"
              {...register(`componentes.${index}.cantidad`, {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addComp}>
        + Agregar componente
      </Button>
    </section>
  );
};
