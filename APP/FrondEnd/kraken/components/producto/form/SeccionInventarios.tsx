// frontend/components/producto/form/SeccionInventarios.tsx
"use client";

import React, { useEffect, useState } from "react";
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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Field = ({ label, icon, children }: { label: string; icon: React.ReactElement; children: React.ReactNode }) => (
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

export const SeccionInventarios = ({ inv, idVirtual, inventarios, setValue }: { inv: any; idVirtual: string; inventarios: any[]; setValue: any }) => {
  const { control } = useFormContext<ProductoFormData>();
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [contenedores, setContenedores] = useState<any[]>([]);
  const [celdas, setCeldas] = useState<any[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const [draftContId, setDraftContId] = useState("");
  const [draftCelId, setDraftCelId] = useState("");
  const [draftQty, setDraftQty] = useState("");
  const [newCelda, setNewCelda] = useState(false);
  const [newContId, setNewContId] = useState<number | null>(null);
  const [newCelId, setNewCelId] = useState<number | null>(null);
  const [newQty, setNewQty] = useState<number | null>(null);
  const [newError, setNewError] = useState(false);

  useEffect(() => {
    const load = async (url: string) => (await (await fetch(url)).json()).data ?? [];
    Promise.all([
      load("http://localhost:3001/api/proveedor"),
      load("http://localhost:3001/api/contenedor-fisico"),
      load("http://localhost:3001/api/celda"),
    ]).then(([prov, cont, cel]) => {
      setProveedores(prov);
      setContenedores(cont);
      setCeldas(cel);
    });
  }, []);

  const { fields: celdaFields, append, remove, update } = useFieldArray({
    control,
    name: `inventarios.${inventarios.findIndex((i) => i.idVirtual === idVirtual)}.celdas`,
  });

  const values = useWatch({ control, name: `inventarios.${inventarios.findIndex((i) => i.idVirtual === idVirtual)}.celdas` });

  const updateInv = (key: string, value: number) => {
    setValue(
      "inventarios",
      inventarios.map((i) => (i.idVirtual === idVirtual ? { ...i, [key]: value } : i))
    );
  };

  const saveEdit = () => {
    if (editIdx === null || !draftContId || !draftCelId || draftQty === "") return;
    update(editIdx, {
      contenedor_fisico_id: Number(draftContId),
      celda_id: Number(draftCelId),
      cantidad: Number(draftQty),
    });
    setEditIdx(null);
  };

  const eliminarCelda = (idx: number) => {
    remove(idx);
    toast.success("Celda eliminada correctamente");
    setEditIdx(null);
    setConfirmIdx(null);
    setNewCelda(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl p-6 shadow-md border">
        <Field label="Stock actual (Unidades)" icon={<PackageSearch />}>
          <Input type="number" defaultValue={inv?.stock_actual ?? ""} className="pl-10 h-11 rounded-lg border-muted bg-muted/30 text-sm" onBlur={(e) => updateInv("stock_actual", Number(e.target.value))} />
        </Field>
        <Field label="Stock mínimo (Alerta)" icon={<AlertTriangle />}>
          <Input type="number" defaultValue={inv?.stock_minimo ?? ""} className="pl-10 h-11 rounded-lg border-muted bg-muted/30 text-sm" onBlur={(e) => updateInv("stock_minimo", Number(e.target.value))} />
        </Field>
        <Field label="Precio costo (MXN)" icon={<DollarSign />}>
          <Input type="number" defaultValue={inv?.precio_costo ?? ""} className="pl-10 h-11 rounded-lg border-muted bg-muted/30 text-sm" onBlur={(e) => updateInv("precio_costo", Number(e.target.value))} />
        </Field>
        <Field label="Proveedor asociado" icon={<Truck />}>
          <ComboboxSelect
            options={proveedores.map((p) => ({ label: p.nombre, value: p.id.toString() }))}
            selected={inv?.proveedor_id?.toString() ?? ""}
            onChange={(val) => updateInv("proveedor_id", Number(val))}
          />
        </Field>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="celdas">
          <AccordionTrigger className="text-sm">Ubicaciones de celdas</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {celdaFields.map((celda, idx) => {
              const cont = contenedores.find((c) => c.id === values?.[idx]?.contenedor_fisico_id);
              const cel = celdas.find((c) => c.id === values?.[idx]?.celda_id);

              return editIdx === idx ? (
                <div key={celda.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
                  <Field label="Contenedor físico" icon={<LayoutGrid />}>
                    <ComboboxSelect
                      options={contenedores.map((c) => ({ label: c.nombre, value: c.id.toString() }))}
                      selected={draftContId}
                      onChange={setDraftContId}
                    />
                  </Field>
                  <Field label="Celda interna" icon={<Hash />}>
                    <ComboboxSelect
                      options={celdas.map((c) => ({ label: `Fila ${c.fila} - Col ${c.columna}`, value: c.id.toString() }))}
                      selected={draftCelId}
                      onChange={setDraftCelId}
                    />
                  </Field>
                  <Field label="Cantidad" icon={<PackageSearch />}>
                    <Input type="number" value={draftQty} onChange={(e) => setDraftQty(e.target.value)} />
                  </Field>
                  <div className="col-span-full flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={() => setEditIdx(null)}>Cancelar</Button>
                    <Button type="button" onClick={saveEdit}><Check className="w-4 h-4 mr-1" />Guardar</Button>
                  </div>
                </div>
              ) : (
                <div
                  id={`celda-${idx}`}
                  key={celda.id}
                  className="flex items-center justify-between bg-muted/30 px-4 py-2 rounded-lg border"
                >
                  <div onClick={() => {
                    if (confirmIdx !== null) return;
                    setEditIdx(idx);
                    setDraftContId(values?.[idx]?.contenedor_fisico_id?.toString() ?? "");
                    setDraftCelId(values?.[idx]?.celda_id?.toString() ?? "");
                    setDraftQty(values?.[idx]?.cantidad?.toString() ?? "");
                  }} className="flex-1 cursor-pointer">
                    <div className="text-sm font-medium">{cont?.nombre ?? `Contenedor ${values?.[idx]?.contenedor_fisico_id}`}</div>
                    <div className="text-xs text-muted-foreground">Celda: Fila {cel?.fila} - Columna {cel?.columna}</div>
                    <div className="text-xs text-muted-foreground">Cantidad: {values?.[idx]?.cantidad ?? 0}</div>
                  </div>
                  <AlertDialog open={confirmIdx === idx} onOpenChange={(open) => !open && setConfirmIdx(null)}>
                    <AlertDialogTrigger asChild>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmIdx(idx); }} className="text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar celda?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive" onClick={() => eliminarCelda(idx)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}

            {newCelda && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
                <Field label="Contenedor físico" icon={<LayoutGrid />}>
                  <ComboboxSelect
                    options={contenedores.map((c) => ({ label: c.nombre, value: c.id.toString() }))}
                    selected={newContId?.toString() ?? ""}
                    onChange={(val) => setNewContId(Number(val))}
                  />
                </Field>
                <Field label="Celda interna" icon={<Hash />}>
                  <ComboboxSelect
                    options={celdas.map((c) => ({ label: `Fila ${c.fila} - Col ${c.columna}`, value: c.id.toString() }))}
                    selected={newCelId?.toString() ?? ""}
                    onChange={(val) => setNewCelId(Number(val))}
                  />
                </Field>
                <Field label="Cantidad" icon={<PackageSearch />}>
                  <Input
                    type="number"
                    className={`pl-7 ${newError && (newQty === null || newQty < 0) ? "border-destructive ring-1 ring-destructive/40" : ""}`}
                    value={newQty ?? ""}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                  />
                </Field>
                {newError && (
                  <p className="text-sm text-destructive col-span-full">Todos los campos deben estar completos y la cantidad debe ser mayor o igual a 0</p>
                )}
                <div className="col-span-full flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => setNewCelda(false)}>Cancelar</Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!newContId || !newCelId || newQty === null || newQty < 0) {
                        setNewError(true);
                        return;
                      }
                      append({ contenedor_fisico_id: newContId, celda_id: newCelId, cantidad: newQty });
                      setNewCelda(false);
                      setNewContId(null);
                      setNewCelId(null);
                      setNewQty(null);
                      setNewError(false);
                    }}
                  >
                    <Check className="w-4 h-4 mr-1" />Guardar
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary border border-dashed border-primary/30 hover:bg-muted/50"
                onClick={() => {
                  setNewCelda(true);
                  setEditIdx(null);
                  setNewContId(null);
                  setNewCelId(null);
                  setNewQty(null);
                  setNewError(false);
                }}
                disabled={contenedores.length === 0 || celdas.length === 0}
              >
                + Agregar ubicación
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

