"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SeccionFiltros() {
  const { register, setValue, watch } = useFormContext();

  const activo = watch("activo");

  return (
    <section className="rounded border p-4 space-y-4 bg-muted/50">
      <h2 className="text-lg font-semibold">Filtros del producto</h2>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="nombre_calculado">Buscar nombre</Label>
          <Input
            id="nombre_calculado"
            placeholder="Ej. Pepsi 1L retornable"
            {...register("nombre_calculado")}
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="activo"
            checked={activo}
            onCheckedChange={(checked) => setValue("activo", checked)}
          />
          <Label htmlFor="activo">{activo ? "Activo" : "Inactivo"}</Label>
        </div>
      </div>
    </section>
  );
}
