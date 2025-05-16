"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PackageSearch, LayoutGrid, Hash } from "lucide-react";
import { ProductoFormData } from "./FormularioProducto";

export const SeccionDetalleProductoCelda = ({ path }: { path: string }) => {
  const { control, setValue } = useFormContext<ProductoFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: path as any });

  const [contenedores, setContenedores] = useState<any[]>([]);
  const [celdas, setCeldas] = useState<any[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resCont, resCel] = await Promise.all([
          fetch("http://localhost:3001/api/contenedor-fisico"),
          fetch("http://localhost:3001/api/celda"),
        ]);

        const dataCont = await resCont.json();
        const dataCel = await resCel.json();

        setContenedores(Array.isArray(dataCont) ? dataCont : dataCont.data ?? []);
        setCeldas(Array.isArray(dataCel) ? dataCel : dataCel.data ?? []);
      } catch (err) {
        console.error("Error cargando contenedores o celdas:", err);
      }
    };
    cargar();
  }, []);

  const blur = (idx: number, field: string) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setValue(`${path}.${idx}.${field}`, value === "" ? undefined : Number(value));
  };

  const Field = ({
    label, icon, children,
  }: { label: string; icon: React.ReactElement; children: React.ReactNode }) => (
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
        <div key={c.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end border p-3 rounded-md">
          <Field label="Contenedor" icon={<LayoutGrid className="h-4 w-4" />}>
            <Select
              defaultValue={c.contenedor_fisico_id?.toString() || ""}
              onValueChange={(v) => setValue(`${path}.${idx}.contenedor_fisico_id`, Number(v))}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Selecciona..." />
              </SelectTrigger>
              <SelectContent>
                {contenedores.map((cont) => (
                  <SelectItem key={cont.id} value={cont.id.toString()}>
                    {cont.nombre ?? `Contenedor ${cont.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Celda" icon={<Hash className="h-4 w-4" />}>
            <Select
              defaultValue={c.celda_id?.toString() || ""}
              onValueChange={(v) => setValue(`${path}.${idx}.celda_id`, Number(v))}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Selecciona..." />
              </SelectTrigger>
              <SelectContent>
                {celdas.map((cel) => (
                  <SelectItem key={cel.id} value={cel.id.toString()}>
                    {cel.nombre ?? `Celda ${cel.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            Eliminar celda
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
            contenedor_fisico_id: contenedores[0]?.id ?? null,
            celda_id: celdas[0]?.id ?? null,
            cantidad: undefined,
          })
        }
        disabled={contenedores.length === 0 || celdas.length === 0}
      >
        + Agregar celda
      </Button>
    </div>
  );
};
