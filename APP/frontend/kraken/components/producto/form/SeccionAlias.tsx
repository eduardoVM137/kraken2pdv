// frontend/components/producto/form/SeccionAlias.tsx
"use client";

import { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from "@/components/ui/select";
import { Tag, Plus, X, Check } from "lucide-react";
import { ProductoFormData } from "./FormularioProducto";

export const SeccionAlias = () => {
  const { control, register, setValue } = useFormContext<ProductoFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "etiquetas" });
  const presentaciones = useWatch({ control, name: "presentaciones" }) || [];
  const watchAlias = useWatch({ control, name: "etiquetas" }) || [];

  const [newAlias, setNewAlias] = useState("");
  const [newPres, setNewPres] = useState<string | "none">("none");

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [draftAlias, setDraftAlias] = useState("");
  const [draftPres, setDraftPres] = useState<string | "none">("none");
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);

  const stopEnter = (e: React.KeyboardEvent) => e.key === "Enter" && e.preventDefault();

  const add = () => {
    const aliasTrimmed = newAlias.trim();
    if (!aliasTrimmed) return;
    append({
      alias: aliasTrimmed,
      tipo: "ean",
      visible: true,
      ...(newPres !== "none" ? { idVirtualPresentacion: newPres } : {}),
    });
    setNewAlias("");
    setNewPres("none");
  };

  const startEdit = (i: number) => {
    setEditIdx(i);
    setDraftAlias(watchAlias?.[i]?.alias ?? "");
    setDraftPres(watchAlias?.[i]?.idVirtualPresentacion ?? "none");
  };

  const saveEdit = () => {
    if (editIdx === null) return;
    setValue(`etiquetas.${editIdx}.alias`, draftAlias.trim());
    setValue(`etiquetas.${editIdx}.idVirtualPresentacion`, draftPres === "none" ? undefined : draftPres);
    setEditIdx(null);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {fields.map((field, idx) =>
          editIdx === idx ? (
            <Card key={field.id} className="w-full max-w-md border-sky-400/40">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Alias / EAN</label>
                    <Input autoFocus value={draftAlias} onChange={e => setDraftAlias(e.target.value)} onKeyDown={stopEnter} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Presentación</label>
                    <Select value={draftPres} onValueChange={setDraftPres}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin presentación</SelectItem>
                        {presentaciones.map((p: any) => (
                          <SelectItem key={p.idVirtualPresentacion} value={p.idVirtualPresentacion}>
                            {p.nombre} ({p.cantidad ?? ""})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button type="button" className="flex-1" onClick={saveEdit}><Check className="mr-1 h-4 w-4" />Guardar</Button>
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setEditIdx(null)}><X className="mr-1 h-4 w-4" />Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div key={field.id} className="inline-flex items-center gap-1 px-3 py-1 m-1 rounded-full bg-sky-100 ring-1 ring-sky-300 cursor-pointer hover:bg-sky-200 transition max-w-40 truncate" onClick={() => confirmIdx === null && startEdit(idx)}>
              <Tag className="h-4 w-4 text-sky-600 flex-none" />
              <span className="truncate text-sm">{watchAlias?.[idx]?.alias}</span>

              <AlertDialog open={confirmIdx === idx} onOpenChange={(o) => setConfirmIdx(o ? idx : null)}>
                <AlertDialogTrigger asChild>
                  <button className="ml-1 shrink-0" onClick={e => { e.stopPropagation(); setConfirmIdx(idx); }}>
                    <X className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar alias?</AlertDialogTitle>
                    <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/80" onClick={() => remove(idx)}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <input type="hidden" {...register(`etiquetas.${idx}.alias`)} />
              <input type="hidden" {...register(`etiquetas.${idx}.tipo`)} value="ean" />
              <input type="hidden" {...register(`etiquetas.${idx}.visible`)} value="true" />
              {watchAlias?.[idx]?.idVirtualPresentacion && (
                <input type="hidden" {...register(`etiquetas.${idx}.idVirtualPresentacion`)} value={watchAlias[idx].idVirtualPresentacion} />
              )}
            </div>
          )
        )}
      </div>

      <div className="flex items-center gap-1 max-w-md">
        <Input
          placeholder="Alias / EAN"
          value={newAlias}
          onChange={e => setNewAlias(e.target.value)}
          onKeyDown={stopEnter}
          className="flex-1 rounded-r-none"
        />
        <Select value={newPres} onValueChange={setNewPres}>
          <SelectTrigger className="w-44 rounded-none">
            <SelectValue placeholder="Presentación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin presentación</SelectItem>
            {presentaciones.map((p: any) => (
              <SelectItem key={p.idVirtualPresentacion} value={p.idVirtualPresentacion}>
                {p.nombre} ({p.cantidad ?? ""})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="icon" variant="secondary" onClick={add} className="rounded-l-none active:scale-95" aria-label="Agregar">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};
