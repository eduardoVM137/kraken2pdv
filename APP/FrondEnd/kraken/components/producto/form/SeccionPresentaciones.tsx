// frontend/components/producto/form/SeccionInventarios.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PackageSearch,
  AlertTriangle,
  DollarSign,
  Truck,
  LayoutGrid,
  Hash,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductoFormData } from "./FormularioProducto";
import { ComboboxSelect } from "@/components/ui/ComboboxSelect";

const Field = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactElement;
  children: React.ReactNode;
}) => (
  <div className="space-y-1 w-full">
    <Label className="text-xs text-muted-foreground font-medium">{label}</Label>
    <div className="relative w-full">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        {React.cloneElement(icon, { className: "h-4 w-4" })}
      </div>
      <div className="pl-7 truncate">{children}</div>
    </div>
  </div>
);

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
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [contenedores, setContenedores] = useState<any[]>([]);
  const [celdas, setCeldas] = useState<any[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const draftQtyRef = useRef<HTMLInputElement | null>(null);
  const draftContRef = useRef<HTMLSelectElement | null>(null);
  const draftCelRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProv, resCont, resCel] = await Promise.all([
          fetch("http://localhost:3001/api/proveedor"),
          fetch("http://localhost:3001/api/contenedor-fisico"),
          fetch("http://localhost:3001/api/celda"),
        ]);
        const jsonProv = await resProv.json();
        const dataCont = await resCont.json();
        const dataCel = await resCel.json();

        setProveedores(Array.isArray(jsonProv) ? jsonProv : jsonProv.data ?? []);
        setContenedores(Array.isArray(dataCont) ? dataCont : dataCont.data ?? []);
        setCeldas(Array.isArray(dataCel) ? dataCel : dataCel.data ?? []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, []);

  const {
    fields: celdaFields,
    append: appendCelda,
    remove: removeCelda,
    update: updateCelda,
  } = useFieldArray({
    control,
    name: `inventarios.${inventarios.findIndex((i: any) => i.idVirtual === idVirtual)}.celdas`,
  });

  const values = useWatch({ control, name: `inventarios.${inventarios.findIndex((i) => i.idVirtual === idVirtual)}.celdas` });

  const saveEdit = () => {
    if (editIdx === null || !draftQtyRef.current || !draftContRef.current || !draftCelRef.current) return;
    updateCelda(editIdx, {
      contenedor_fisico_id: Number(draftContRef.current.value),
      celda_id: Number(draftCelRef.current.value),
      cantidad: draftQtyRef.current.value ? Number(draftQtyRef.current.value) : 0,
    });
    setEditIdx(null);
  };

  const commitField = (field: string) => (e: React.FocusEvent<HTMLInputElement>) =>
    setValue(
      "inventarios",
      inventarios.map((i) =>
        i.idVirtual === idVirtual ? { ...i, [field]: e.target.value === "" ? undefined : Number(e.target.value) } : i
      )
    );

  const commitSelect = (field: string, val: string) =>
    setValue(
      "inventarios",
      inventarios.map((i) =>
        i.idVirtual === idVirtual ? { ...i, [field]: Number(val) } : i
      )
    );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Stock actual (Unidades)" icon={<PackageSearch />}>
          <Input
            type="number"
            inputMode="decimal"
            className="pl-7 h-10 text-sm"
            defaultValue={inv?.stock_actual ?? ""}
            onBlur={commitField("stock_actual")}
          />
        </Field>

        <Field label="Stock mínimo (Alerta)" icon={<AlertTriangle />}>
          <Input
            type="number"
            inputMode="decimal"
            className="pl-7 h-10 text-sm"
            defaultValue={inv?.stock_minimo ?? ""}
            onBlur={commitField("stock_minimo")}
          />
        </Field>

        <Field label="Precio costo (MXN)" icon={<DollarSign />}>
          <Input
            type="number"
            inputMode="decimal"
            className="pl-7 h-10 text-sm"
            defaultValue={inv?.precio_costo ?? ""}
            onBlur={commitField("precio_costo")}
          />
        </Field>

        <Field label="Proveedor asociado" icon={<Truck />}>
          <div className="h-10">
            <ComboboxSelect
              options={proveedores.map((p) => ({ label: p.nombre, value: p.id.toString() }))}
              selected={inv?.proveedor_id?.toString() ?? ""}
              onChange={(val) => commitSelect("proveedor_id", val)}
            />
          </div>
        </Field>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="cel">
          <AccordionTrigger className="text-xs hover:no-underline">
            Celdas (contenedor / celda / cantidad)
          </AccordionTrigger>
          <AccordionContent className="pt-3 space-y-3">
            <div className="flex flex-wrap gap-2">
              {celdaFields.map((celda, idx) => {
                const cont = contenedores.find((c) => c.id === values?.[idx]?.contenedor_fisico_id);
                const cel = celdas.find((c) => c.id === values?.[idx]?.celda_id);

                return editIdx === idx ? (
                  <div key={celda.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl bg-white p-4 border rounded-xl shadow">
                    <Field label="Contenedor físico" icon={<LayoutGrid />}>
                      <select ref={draftContRef} className="w-full border rounded px-2 py-1">
                        {contenedores.map((c) => (
                          <option key={c.id} value={c.id} selected={c.id === cont?.id}>{c.nombre}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Celda interna" icon={<Hash />}>
                      <select ref={draftCelRef} className="w-full border rounded px-2 py-1">
                        {celdas.map((c) => (
                          <option key={c.id} value={c.id} selected={c.id === cel?.id}>{c.nombre}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Cantidad almacenada" icon={<PackageSearch />}>
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="pl-7"
                        ref={draftQtyRef}
                        defaultValue={values?.[idx]?.cantidad ?? ""}
                      />
                    </Field>
                    <div className="col-span-full flex justify-end gap-2">
                      <Button type="button" variant="secondary" onClick={() => setEditIdx(null)}>Cancelar</Button>
                      <Button type="button" onClick={saveEdit}><Check className="w-4 h-4 mr-1" />Guardar</Button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={celda.id}
                    onClick={() => setEditIdx(idx)}
                    className="flex items-center gap-2 bg-blue-50 text-sm rounded-lg px-4 py-2 border border-blue-200 max-w-full shadow-sm hover:bg-blue-100 cursor-pointer"
                  >
                    <LayoutGrid className="w-4 h-4 text-blue-500" />
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className="bg-blue-100 rounded px-2 py-0.5 border border-blue-200 text-xs font-medium text-blue-700">
                        {cont?.nombre || `Cont ${values?.[idx]?.contenedor_fisico_id}`}
                      </span>
                      <span className="bg-blue-100 rounded px-2 py-0.5 border border-blue-200 text-xs font-medium text-blue-700">
                        {cel?.nombre || `Celda ${values?.[idx]?.celda_id}`}
                      </span>
                      <span className="bg-blue-100 rounded px-2 py-0.5 border border-blue-200 text-xs font-medium text-blue-700">
                        {values?.[idx]?.cantidad ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); removeCelda(idx); }}><X className="w-3.5 h-3.5 text-red-600" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-start pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditIdx(celdaFields.length)}
                disabled={contenedores.length === 0 || celdas.length === 0}
              >
                + Agregar celda
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
