// frontend/components/producto/form/SeccionPresentaciones.tsx
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
import { Package, Plus, X, Check } from "lucide-react";
import { ProductoFormData } from "./FormularioProducto";
import { shortId, vPres } from "@/lib/generateVirtualId";

const uid = (p: string) => `${p}_${shortId("", 8)}`;


export const SeccionPresentaciones = () => {
  const { control, register, setValue } = useFormContext<ProductoFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "presentaciones" });
  const pres = useWatch({ control, name: "presentaciones" }) as ProductoFormData["presentaciones"];

  /* alta rápida */
  const [newName, setNewName] = useState("");
  const [newQty,  setNewQty]  = useState("");

  /* edición */
  const [editIdx, setEditIdx]     = useState<number|null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftQty,  setDraftQty]  = useState("");

  /* confirm */
  const [confirmIdx, setConfirmIdx] = useState<number|null>(null);

  const stopEnter = (e:React.KeyboardEvent)=> e.key==="Enter" && e.preventDefault();

  const startEdit = (i:number)=>{
    setEditIdx(i);
    setDraftName(pres?.[i]?.nombre ?? "");
    setDraftQty( pres?.[i]?.cantidad!==undefined ? String(pres[i].cantidad):"");
  };
  const saveEdit = ()=>{
    if(editIdx===null) return;
    setValue(`presentaciones.${editIdx}.nombre`, draftName.trim()||"—");
    setValue(`presentaciones.${editIdx}.cantidad`, draftQty?Number(draftQty):undefined);
    setEditIdx(null);
  };
  const add = ()=>{
    if(!newName.trim()) return;
    append({ idVirtualPresentacion:uid("pres"), nombre:newName.trim(), cantidad:newQty?Number(newQty):undefined });
    setNewName(""); setNewQty("");
  };

  return (
    <section className="space-y-4">
      {/* —──────── Chips —──────── */}
      <div className="flex flex-wrap gap-2">
        {fields.map((f,idx)=>
          editIdx===idx ? (
            /* tarjeta de edición */
            <Card key={f.id} className="w-full max-w-md border-amber-400/40">
              <CardContent className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Nombre</label>
                    <Input autoFocus value={draftName} onChange={e=>setDraftName(e.target.value)} onKeyDown={stopEnter}/>
                  </div>
                  <div className="w-24">
                    <label className="text-sm font-medium">Cant.</label>
                    <Input type="number" min="1" value={draftQty} onChange={e=>setDraftQty(e.target.value)} onKeyDown={stopEnter}/>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button type="button" className="flex-1" onClick={saveEdit}><Check className="h-4 w-4 mr-1"/>Guardar</Button>
                  <Button type="button" variant="secondary" className="flex-1" onClick={()=>setEditIdx(null)}><X className="h-4 w-4 mr-1"/>Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* chip píldora */
            <div key={f.id}
              className="inline-flex items-center gap-1 px-3 py-1 m-1
            rounded-full bg-amber-100 ring-1 ring-amber-300
            cursor-pointer hover:bg-amber-200 transition
            max-w-40 truncate"         
 

              onClick={()=> confirmIdx===null && startEdit(idx)}>
              <Package className="h-4 w-4 text-amber-600 flex-none"/>
              <span className="truncate text-sm">{pres?.[idx]?.nombre}{pres?.[idx]?.cantidad&&` ${pres[idx].cantidad}`}</span>

              {/* eliminar con confirm */}
              <AlertDialog open={confirmIdx===idx} onOpenChange={o=>setConfirmIdx(o?idx:null)}>
                <AlertDialogTrigger asChild>
                  <button className="ml-1 shrink-0" onClick={e=>{e.stopPropagation(); setConfirmIdx(idx);}}>
                    <X className="h-3.5 w-3.5 text-destructive"/>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar presentación?</AlertDialogTitle>
                    <AlertDialogDescription>No podrás deshacer esta acción.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/80" onClick={()=>remove(idx)}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <input type="hidden" {...register(`presentaciones.${idx}.idVirtualPresentacion`)} value={f.idVirtualPresentacion}/>
            </div>
          )
        )}
      </div>

      {/* —──────── Alta rápida —──────── */}
      <div className="flex items-center gap-1 max-w-md">
        <Input placeholder="Nombre" value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={stopEnter}
               className="flex-1 rounded-r-none"/>
        <Input placeholder="#" type="number" min="1" value={newQty} onChange={e=>setNewQty(e.target.value)}
               onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault(); add();}}}
               className="w-24 rounded-none text-center"/>
        <Button type="button" size="icon" variant="secondary" onClick={add} className="rounded-l-none active:scale-95" aria-label="Agregar">
          <Plus className="h-5 w-5"/>
        </Button>
      </div>
    </section>
  );
};