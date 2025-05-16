// frontend/components/producto/form/SeccionAtributos.tsx
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
import { Tag, Plus, X, Check } from "lucide-react";
import { ProductoFormData } from "./FormularioProducto";

export const SeccionAtributos = () => {
  const { control, register, setValue } = useFormContext<ProductoFormData>();
  const { fields, append, remove } = useFieldArray({ control, name:"detalles_atributo" });
  const watchDet = useWatch({ control, name:"detalles_atributo" }) as ProductoFormData["detalles_atributo"];

  /* alta rápida */
  const [newKey,setNewKey]=useState(""); const [newVal,setNewVal]=useState("");

  /* edición / confirm */
  const [editIdx,setEditIdx]=useState<number|null>(null);
  const [confirmIdx,setConfirmIdx]=useState<number|null>(null);
  const [draftKey,setDraftKey]=useState(""); const [draftVal,setDraftVal]=useState("");

  const stopEnter=(e:React.KeyboardEvent)=>e.key==="Enter"&&e.preventDefault();

  const startEdit=(i:number)=>{
    setEditIdx(i);
    const [k="",v=""]=(watchDet?.[i]?.valor??"").split(":");
    setDraftKey(k); setDraftVal(v);
  };
  const saveEdit=()=>{
    if(editIdx===null) return;
    setValue(`detalles_atributo.${editIdx}.valor`, `${draftKey.trim()}:${draftVal.trim()}`);
    setEditIdx(null);
  };
  const add=()=>{
    if(!newKey.trim()||!newVal.trim()) return;
    append({ valor:`${newKey.trim()}:${newVal.trim()}`});
    setNewKey(""); setNewVal("");
  };

  return (
    <section className="space-y-4">
      <Input placeholder="Nombre atributo principal" {...register("atributo.nombre")} className="max-w-md"/>

      <div className="flex flex-wrap gap-2">
        {fields.map((f,idx)=>
          editIdx===idx?(
            <Card key={f.id} className="w-full max-w-md border-zinc-400/40">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Clave</label>
                    <Input autoFocus value={draftKey} onChange={e=>setDraftKey(e.target.value)} onKeyDown={stopEnter}/>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Valor</label>
                    <Input value={draftVal} onChange={e=>setDraftVal(e.target.value)} onKeyDown={stopEnter}/>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" className="flex-1" onClick={saveEdit}><Check className="h-4 w-4 mr-1"/>Guardar</Button>
                  <Button type="button" variant="secondary" className="flex-1" onClick={()=>setEditIdx(null)}><X className="h-4 w-4 mr-1"/>Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          ):(
            <div key={f.id}
              className="inline-flex items-center gap-1 px-3 py-1 m-1
           rounded-full bg-zinc-100 ring-1 ring-zinc-300
           cursor-pointer hover:bg-zinc-200 transition
           max-w-40 truncate"
              onClick={()=>confirmIdx===null && startEdit(idx)}>
              <Tag className="h-4 w-4 text-zinc-600 flex-none"/>
              <span className="truncate text-sm">{watchDet?.[idx]?.valor}</span>

              <AlertDialog open={confirmIdx===idx} onOpenChange={o=>setConfirmIdx(o?idx:null)}>
                <AlertDialogTrigger asChild>
                  <button className="ml-1 shrink-0" onClick={e=>{e.stopPropagation(); setConfirmIdx(idx);}}>
                    <X className="h-3.5 w-3.5 text-destructive"/>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar detalle?</AlertDialogTitle>
                    <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/80" onClick={()=>remove(idx)}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <input type="hidden" {...register(`detalles_atributo.${idx}.valor`)} value={f.valor}/>
            </div>
          )
        )}
      </div>

      <div className="flex items-center gap-1 max-w-md">
        <Input placeholder="Clave" value={newKey} onChange={e=>setNewKey(e.target.value)} onKeyDown={stopEnter}
               className="flex-1 rounded-r-none"/>
        <Input placeholder="Valor" value={newVal} onChange={e=>setNewVal(e.target.value)}
               onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault(); add();}}}
               className="flex-1 rounded-none"/>
        <Button type="button" size="icon" variant="secondary" onClick={add}
                className="rounded-l-none active:scale-95" aria-label="Agregar">
          <Plus className="h-5 w-5"/>
        </Button>
      </div>
    </section>
  );
};
