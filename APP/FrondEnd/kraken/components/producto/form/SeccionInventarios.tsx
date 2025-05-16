// frontend/components/producto/form/SeccionInventarios.tsx
"use client";

import React, { useState } from "react";
import { useEffect } from "react";
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
  const [newCelda, setNewCelda] = useState(false);
  const [newContId, setNewContId] = useState<number | null>(null);
  const [newCelId, setNewCelId] = useState<number | null>(null);
  const [newQty, setNewQty] = useState<number | null>(null);

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

  const handleAddNewCelda = () => {
    if (newContId !== null && newCelId !== null && newQty !== null) {
      appendCelda({ contenedor_fisico_id: newContId, celda_id: newCelId, cantidad: newQty });
      setNewCelda(false);
      setNewContId(null);
      setNewCelId(null);
      setNewQty(null);
    }
  };

  return (
    <div className="space-y-4">
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
                      <ComboboxSelect
                        options={contenedores.map((c) => ({ label: c.nombre ?? `Cont ${c.id}`, value: c.id.toString() }))}
                        selected={values?.[idx]?.contenedor_fisico_id?.toString() ?? ""}
                        onChange={(val) => updateCelda(idx, { ...values[idx], contenedor_fisico_id: Number(val) })}
                      />
                    </Field>
                    <Field label="Celda interna" icon={<Hash />}>
                      <ComboboxSelect
                        options={celdas.map((c) => ({ label: c.nombre ?? `Celda ${c.id}`, value: c.id.toString() }))}
                        selected={values?.[idx]?.celda_id?.toString() ?? ""}
                        onChange={(val) => updateCelda(idx, { ...values[idx], celda_id: Number(val) })}
                      />
                    </Field>
                    <Field label="Cantidad almacenada" icon={<PackageSearch />}>
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="pl-7"
                        value={values?.[idx]?.cantidad ?? ""}
                        onChange={(e) => updateCelda(idx, { ...values[idx], cantidad: Number(e.target.value) })}
                      />
                    </Field>
                    <div className="col-span-full flex justify-end gap-2">
                      <Button type="button" variant="secondary" onClick={() => setEditIdx(null)}>Cancelar</Button>
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
            {newCelda && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl bg-white p-4 border rounded-xl shadow">
                <Field label="Contenedor físico" icon={<LayoutGrid />}>
                  <ComboboxSelect
                    options={contenedores.map((c) => ({ label: c.nombre ?? `Cont ${c.id}`, value: c.id.toString() }))}
                    selected={newContId?.toString() ?? ""}
                    onChange={(val) => setNewContId(Number(val))}
                  />
                </Field>
                <Field label="Celda interna" icon={<Hash />}>
                  <ComboboxSelect
                    options={celdas.map((c) => ({ label: c.nombre ?? `Celda ${c.id}`, value: c.id.toString() }))}
                    selected={newCelId?.toString() ?? ""}
                    onChange={(val) => setNewCelId(Number(val))}
                  />
                </Field>
                <Field label="Cantidad almacenada" icon={<PackageSearch />}>
                  <Input
                    type="number"
                    inputMode="numeric"
                    className="pl-7"
                    value={newQty ?? ""}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                  />
                </Field>
                <div className="col-span-full flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => setNewCelda(false)}>Cancelar</Button>
                  <Button type="button" onClick={handleAddNewCelda}>Guardar</Button>
                </div>
              </div>
            )}
            {!newCelda && (
              <div className="flex justify-start pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewCelda(true)}
                  disabled={contenedores.length === 0 || celdas.length === 0}
                >
                  + Agregar celda
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
