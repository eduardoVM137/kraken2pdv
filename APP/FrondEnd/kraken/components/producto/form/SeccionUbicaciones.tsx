// frontend/components/producto/form/SeccionUbicaciones.tsx
"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PackageSearch, DollarSign, MapPin } from "lucide-react";
import { SeccionInventarios } from "./SeccionInventarios";
import { SeccionPrecios }     from "./SeccionPrecios";
import { ProductoFormData }   from "./FormularioProducto";

const uid = (p: string) => `${p}_${crypto.randomUUID().slice(0, 8)}`;

export const SeccionUbicaciones = () => {
  const { control, register, watch, setValue } = useFormContext<ProductoFormData>();

  /* array de ubicaciones */
  const { fields, append, remove } = useFieldArray({
    control, name: "producto_ubicaciones",
  });

  /* arrays globales de inventarios y precios */
  const inventarios = useWatch({ control, name:"inventarios" }) || [];
  const precios     = useWatch({ control, name:"precios"     }) || [];

  /* helpers ───────────────────────────────────────── */
  const addUbic = () =>{
    const invId = uid("inv");
    const prId  = uid("price");
    append({
      negocio_id: 1, ubicacion_fisica_id: 1,
      idVirtualInventario: invId, idVirtualPrecio: prId, compartir:false,
    });
    setValue("inventarios",[...inventarios,{
      idVirtual:invId, stock_actual:1, stock_minimo:0, precio_costo:1, ubicacion_fisica_id:1,
    }]);
    setValue("precios",[...precios,{
      idVirtual:prId, precio_venta:1, tipo_cliente_id:1, vigente:true,
    }]);
  };

  const purge = (index:number)=>{
    const u = watch("producto_ubicaciones")[index];
    if(u?.idVirtualInventario)
      setValue("inventarios",inventarios.filter(i=>i.idVirtual!==u.idVirtualInventario));
    if(u?.idVirtualPrecio)
      setValue("precios",precios.filter(p=>p.idVirtual!==u.idVirtualPrecio));
    remove(index); toast.success("Ubicación eliminada");
  };

  /* inventario / precio ON-OFF */
  const toggle = (
    tipo:"inventario"|"precio",
    val:boolean,
    ubic:any,
    idx:number
  )=>{
    if(tipo==="inventario"){
      if(!val && ubic.idVirtualInventario){
        setValue("inventarios",inventarios.filter(i=>i.idVirtual!==ubic.idVirtualInventario));
        setValue(`producto_ubicaciones.${idx}.idVirtualInventario`, undefined);
      }else if(val && !ubic.idVirtualInventario){
        const id=uid("inv");
        setValue(`producto_ubicaciones.${idx}.idVirtualInventario`, id);
        setValue("inventarios",[...inventarios,{
          idVirtual:id, stock_actual:0, stock_minimo:0, precio_costo:0,
          ubicacion_fisica_id:ubic.ubicacion_fisica_id ?? 1,
        }]);
      }
    }else{
      if(!val && ubic.idVirtualPrecio){
        setValue("precios",precios.filter(p=>p.idVirtual!==ubic.idVirtualPrecio));
        setValue(`producto_ubicaciones.${idx}.idVirtualPrecio`, undefined);
      }else if(val && !ubic.idVirtualPrecio){
        const id=uid("price");
        setValue(`producto_ubicaciones.${idx}.idVirtualPrecio`, id);
        setValue("precios",[...precios,{
          idVirtual:id, precio_venta:0, tipo_cliente_id:1, vigente:true,
        }]);
      }
    }
  };

  /* ─────────────────────────── UI ─────────────────────────── */
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MapPin className="h-5 w-5"/> Ubicaciones del producto
      </h2>

      {fields.map((field, idx)=>{
        const ubic   = watch("producto_ubicaciones")[idx];
        const invObj = inventarios.find((i:any)=>i.idVirtual===ubic?.idVirtualInventario);
        const prObj  = precios    .find((p:any)=>p.idVirtual===ubic?.idVirtualPrecio);

        return (
          <Card key={field.id} className="border-muted">
            <CardHeader className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label>Negocio ID</Label>
                <Input type="number" {...register(`producto_ubicaciones.${idx}.negocio_id`,{valueAsNumber:true})}/>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Ubicación física ID</Label>
                <Input type="number" {...register(`producto_ubicaciones.${idx}.ubicacion_fisica_id`,{valueAsNumber:true})}/>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* switches */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!ubic.idVirtualInventario}
                    onCheckedChange={v=>toggle("inventario",v,ubic,idx)}
                  />
                  <Label>Inventario</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!ubic.idVirtualPrecio}
                    onCheckedChange={v=>toggle("precio",v,ubic,idx)}
                  />
                  <Label>Precio</Label>
                </div>
              </div>

              {/* sub-secciones */}
              {invObj && (
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <PackageSearch className="h-4 w-4 text-muted-foreground"/><span>Inventario</span>
                  </div>
                  <SeccionInventarios
                    inv={invObj}
                    idVirtual={ubic.idVirtualInventario}
                    inventarios={inventarios}
                    setValue={setValue}
                  />
                </div>
              )}

              {prObj && (
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground"/><span>Precio</span>
                  </div>
                  <SeccionPrecios
                    precio={prObj}
                    idVirtual={ubic.idVirtualPrecio}
                    precios={precios}
                    setValue={setValue}
                  />
                </div>
              )}

              {/* compartir + eliminar */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Label>Compartir</Label>
                  <Switch
                    checked={ubic?.compartir ?? false}
                    onCheckedChange={v=>setValue(`producto_ubicaciones.${idx}.compartir`,v)}
                  />
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" size="sm" variant="destructive">Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar ubicación?</AlertDialogTitle>
                      <AlertDialogDescription>Se borrará también su inventario y precio.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={()=>purge(idx)}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Button type="button" variant="outline" onClick={addUbic}>+ Agregar ubicación</Button>
    </section>
  );
};



// // frontend/components/producto/form/SeccionUbicaciones.tsx
// "use client";

// import { useFieldArray, useFormContext } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";
// import { ProductoFormData } from "./FormularioProducto";
// import { SeccionInventarios } from "./SeccionInventarios";
// import { SeccionPrecios } from "./SeccionPrecios";


// const uid = (p: string) => `${p}_${crypto.randomUUID().slice(0, 8)}`;

// export const SeccionUbicaciones = () => {
//   const { control, register } = useFormContext<ProductoFormData>();

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "producto_ubicaciones",
//   });

// const addUbicacion = () =>
//   append({
//     negocio_id: 1,
//     ubicacion_fisica_id: 1,
//     compartir: false,
//     inventarios: [
//       {
//         idVirtual: uid("inv"),
//         stock_actual: 0,
//         stock_minimo: 0,
//         precio_costo: 0,
//       },
//     ],
//     precios: [
//       {
//         idVirtual: uid("price"),
//         precio_venta: 0,
//         tipo_cliente_id: 1,
//         vigente: true,
//       },
//     ],
//   });


//   return (
//     <section className="space-y-6">
//       <h2 className="text-xl font-semibold">Ubicaciones del producto</h2>

//       {fields.map((field, idx) => (
//         <div key={field.id} className="space-y-4 border p-4 rounded-md">
//           {/* IDs básicos */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             <div>
//               <Label>Negocio ID</Label>
//               <Input
//                 type="number"
//                 {...register(`producto_ubicaciones.${idx}.negocio_id`, {
//                   valueAsNumber: true,
//                 })}
//               />
//             </div>
//             <div>
//               <Label>Ubicación física ID</Label>
//               <Input
//                 type="number"
//                 {...register(`producto_ubicaciones.${idx}.ubicacion_fisica_id`, {
//                   valueAsNumber: true,
//                 })}
//               />
//             </div>
//           </div>

//           {/* switch compartir */}
//           <div className="flex items-center gap-2">
//             <Label>Compartir</Label>
//             <Switch
//               {...register(`producto_ubicaciones.${idx}.compartir`)}
//             />
//           </div>

//           {/* bloques hijos */}
//           <SeccionInventarios ubicIndex={idx} />
//           <SeccionPrecios    ubicIndex={idx} />

//           {/* eliminar ubicación */}
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button variant="destructive" size="sm">Eliminar ubicación</Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>¿Eliminar esta ubicación?</AlertDialogTitle>
//                 <AlertDialogDescription>Se eliminarán sus inventarios y precios.</AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
//                 <AlertDialogAction
//                   onClick={() => {
//                     remove(idx);
//                     toast.success("Ubicación eliminada");
//                   }}
//                 >
//                   Confirmar
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//       ))}

//       <Button type="button" variant="outline" onClick={addUbicacion}>
//         + Agregar ubicación
//       </Button>
//     </section>
//   );
// };
