// frontend/components/producto/form/SeccionInventarios.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fade-in 0.25s ease-out;
      }

      @keyframes disintegrate {
        0% { opacity: 1; transform: scale(1) rotate(0deg); }
        100% { opacity: 0; transform: scale(0.7) rotate(20deg); }
      }
      .animate-disintegrate {
        animation: disintegrate 0.3s ease-in forwards;
      }

      @keyframes elegant-insert {
        0% { opacity: 0; transform: translateY(15px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      .animate-elegant-insert {
        animation: elegant-insert 0.4s ease-out;
      }`;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const { control } = useFormContext<ProductoFormData>();
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [contenedores, setContenedores] = useState<any[]>([]);
  const [celdas, setCeldas] = useState<any[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const [draftContId, setDraftContId] = useState<string>("");
  const [draftCelId, setDraftCelId] = useState<string>("");
  const [draftQty, setDraftQty] = useState<string>("");

  const [newCelda, setNewCelda] = useState(false);
  const [newContId, setNewContId] = useState<number | null>(null);
  const [newCelId, setNewCelId] = useState<number | null>(null);
  const [newQty, setNewQty] = useState<number | null>(null);
  const [newError, setNewError] = useState(false);

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

  const { fields: celdaFields, append, remove, update } = useFieldArray({
    control,
    name: `inventarios.${inventarios.findIndex((i: any) => i.idVirtual === idVirtual)}.celdas`,
  });

  const values = useWatch({ control, name: `inventarios.${inventarios.findIndex((i) => i.idVirtual === idVirtual)}.celdas` });

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
    const target = document.getElementById(`celda-${idx}`);
    if (target) {
      target.classList.add("animate-disintegrate");
      setEditIdx(null);
      setConfirmIdx(null);
      setNewCelda(false);
      setTimeout(() => {
        remove(idx);
        toast.success("Celda eliminada correctamente");
      }, 300);
    } else {
      remove(idx);
      toast.success("Celda eliminada correctamente");
    }
  };
return (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl p-6 shadow-md border animate-elegant-insert">
      <Field label="Stock actual (Unidades)" icon={<PackageSearch />}>
        <Input
          type="number"
          className="pl-10 h-11 rounded-lg border-muted bg-muted/30 text-sm"
          defaultValue={inv?.stock_actual ?? ""}
          onBlur={(e) =>
            setValue(
              "inventarios",
              inventarios.map((i) =>
                i.idVirtual === idVirtual ? { ...i, stock_actual: Number(e.target.value) } : i
              )
            )
          }
        />
      </Field>
      <Field label="Stock mínimo (Alerta)" icon={<AlertTriangle />}>
        <Input
          type="number"
          className="pl-10 h-11 rounded-lg border-muted bg-muted/30 text-sm"
          defaultValue={inv?.stock_minimo ?? ""}
          onBlur={(e) =>
            setValue(
              "inventarios",
              inventarios.map((i) =>
                i.idVirtual === idVirtual ? { ...i, stock_minimo: Number(e.target.value) } : i
              )
            )
          }
        />
      </Field>
      <Field label="Precio costo (MXN)" icon={<DollarSign />}>
        <Input
          type="number"
          className="pl-10 h-11 rounded-lg border-muted bg-muted/30 text-sm"
          defaultValue={inv?.precio_costo ?? ""}
          onBlur={(e) =>
            setValue(
              "inventarios",
              inventarios.map((i) =>
                i.idVirtual === idVirtual ? { ...i, precio_costo: Number(e.target.value) } : i
              )
            )
          }
        />
      </Field>
      <Field label="Proveedor asociado" icon={<Truck />}>
        <div className="h-10">
          <ComboboxSelect
            options={proveedores.map((p) => ({
              label: p.nombre,
              value: p.id.toString(),
            }))}
            selected={inv?.proveedor_id?.toString() ?? ""}
            onChange={(val) =>
              setValue(
                "inventarios",
                inventarios.map((i) =>
                  i.idVirtual === idVirtual ? { ...i, proveedor_id: Number(val) } : i
                )
              )
            }
          />
        </div>
      </Field>
    </div>

    <Accordion type="single" collapsible defaultValue="cel">
      <AccordionItem value="cel">
        <AccordionTrigger className="text-sm font-medium text-primary hover:no-underline py-1">
          Ubicación física (Contenedor / Celda / Cantidad)
        </AccordionTrigger>
        <AccordionContent className="pt-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            {celdaFields.map((celda, idx) => {
              const cont = contenedores.find((c) => c.id === values?.[idx]?.contenedor_fisico_id);
              const cel = celdas.find((c) => c.id === values?.[idx]?.celda_id);
              return editIdx === idx ? (
                <div key={celda.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl bg-muted/30 p-5 border rounded-2xl shadow-sm animate-fade-in">
                  <Field label="Contenedor físico" icon={<LayoutGrid />}>
                    <ComboboxSelect options={contenedores.map((c) => ({
                      label: c.nombre ?? `Contenedor ${c.id}`,
                      value: c.id.toString(),
                    }))} selected={draftContId} onChange={setDraftContId} />
                  </Field>
                  <Field label="Celda interna" icon={<Hash />}>
                    <ComboboxSelect options={celdas.map((c) => ({
                      label: `Fila ${c.fila} - Col ${c.columna}`,
                      value: c.id.toString(),
                    }))} selected={draftCelId} onChange={setDraftCelId} />
                  </Field>
                  <Field label="Cantidad almacenada" icon={<PackageSearch />}>
                    <Input type="number" inputMode="numeric" className="pl-7" value={draftQty} onChange={(e) => setDraftQty(e.target.value)} />
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
                  className="flex items-center gap-2 bg-amber-50 text-sm rounded-xl px-4 py-2 border border-amber-200 shadow-sm hover:bg-amber-100 cursor-pointer transition-colors"
                  onClick={() => {
                    if (confirmIdx !== null) return;
                    setEditIdx(idx);
                    setDraftContId(values?.[idx]?.contenedor_fisico_id?.toString() ?? "");
                    setDraftCelId(values?.[idx]?.celda_id?.toString() ?? "");
                    setDraftQty(values?.[idx]?.cantidad?.toString() ?? "");
                  }}
                >
                  <LayoutGrid className="w-4 h-4 text-orange-500" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <span className="text-xs font-medium text-muted-foreground">
                      Contenedor: {cont?.nombre ?? `ID ${values?.[idx]?.contenedor_fisico_id}`}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Celda: Fila {cel?.fila} - Columna {cel?.columna}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Cantidad: {values?.[idx]?.cantidad ?? 0}
                    </span>
                  </div>
                  <AlertDialog open={confirmIdx === idx} onOpenChange={(open) => !open && setConfirmIdx(null)}>
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmIdx(idx);
                        }}
                        className="ml-2 text-destructive hover:text-destructive/80"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar celda?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/80" onClick={() => eliminarCelda(idx)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>

          {newCelda && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl bg-white p-4 border rounded-xl shadow animate-fade-in">
              <Field label="Contenedor físico" icon={<LayoutGrid />}>
                <ComboboxSelect options={contenedores.map((c) => ({
                  label: c.nombre ?? `Contenedor ${c.id}`,
                  value: c.id.toString(),
                }))} selected={newContId?.toString() ?? ""} onChange={(val) => setNewContId(Number(val))} />
              </Field>
              <Field label="Celda interna" icon={<Hash />}>
                <ComboboxSelect options={celdas.map((c) => ({
                  label: `Fila ${c.fila} - Col ${c.columna}`,
                  value: c.id.toString(),
                }))} selected={newCelId?.toString() ?? ""} onChange={(val) => setNewCelId(Number(val))} />
              </Field>
              <Field label="Cantidad almacenada" icon={<PackageSearch />}>
                <Input
                  type="number"
                  inputMode="numeric"
                  className={`pl-7 ${newError && (newQty === null || newQty < 0) ? "border-destructive ring-1 ring-destructive/40" : ""}`}
                  value={newQty ?? ""}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                />
              </Field>
              {newError && (
                <p className="text-sm text-destructive animate-pulse col-span-full">
                  Todos los campos deben estar completos y la cantidad debe ser mayor o igual a 0
                </p>
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
                  <Check className="w-4 h-4 mr-1" /> Guardar
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-start pt-2">
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