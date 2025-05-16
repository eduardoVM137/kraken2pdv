// frontend/components/producto/form/SeccionBasica.tsx

// frontend/components/producto/form/SeccionBasica.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ProductoFormData } from "./FormularioProducto";

export const SeccionBasica = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ProductoFormData>();

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Datos del producto</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="producto_id">ID Producto</Label>
          <Input type="number" {...register("producto_id")} />
          {errors.producto_id && <p className="text-sm text-red-500">{errors.producto_id.message}</p>}
        </div>

        <div>
          <Label htmlFor="marca_id">Marca</Label>
          <Input type="text" {...register("marca_id")} />
        </div>

        <div>
          <Label htmlFor="medida">Medida</Label>
          <Input type="text" {...register("medida")} />
        </div>

        <div>
          <Label htmlFor="unidad_medida">Unidad de medida</Label>
          <Input type="text" {...register("unidad_medida")} />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea {...register("descripcion")} />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="nombre_calculado">Nombre calculado</Label>
          <Input type="text" {...register("nombre_calculado")} />
        </div>

        <div className="flex items-center space-x-4">
          <Label htmlFor="activo">¿Activo?</Label>
          <Switch
            checked={watch("activo")}
            onCheckedChange={(checked) => setValue("activo", checked)}
            id="activo"
          />
        </div>
      </div>
    </section>
  );
};



// "use client";

// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
// import { ProductoFormData } from "./FormularioProducto";

// export const SeccionBasica = () => {
//   const { control, register } = useFormContext<ProductoFormData>();

//   return (
//     <div className="space-y-4">
//       <h2 className="text-lg font-semibold">Información básica</h2>

//       <FormField
//         control={control}
//         name="producto_id"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>ID del Producto</FormLabel>
//             <FormControl>
//               <Input type="number" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={control}
//         name="marca_id"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Marca</FormLabel>
//             <FormControl>
//               <Input placeholder="PEPSI" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <FormField
//           control={control}
//           name="medida"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Medida</FormLabel>
//               <FormControl>
//                 <Input placeholder="1.00" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={control}
//           name="unidad_medida"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Unidad de Medida</FormLabel>
//               <FormControl>
//                 <Input placeholder="lt" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>

//       <FormField
//         control={control}
//         name="descripcion"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Descripción</FormLabel>
//             <FormControl>
//               <Textarea placeholder="Ej. Bebida sabor cola 1L retornable" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={control}
//         name="nombre_calculado"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Nombre calculado</FormLabel>
//             <FormControl>
//               <Input placeholder="Pepsi 1L retornable" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={control}
//         name="activo"
//         render={({ field }) => (
//           <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//             <div className="space-y-0.5">
//               <FormLabel>Producto activo</FormLabel>
//               <FormDescription>¿Está disponible en el sistema?</FormDescription>
//             </div>
//             <FormControl>
//               <Switch
//                 checked={field.value}
//                 onCheckedChange={field.onChange}
//               />
//             </FormControl>
//           </FormItem>
//         )}
//       />
//     </div>
//   );
// };