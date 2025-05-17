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
import { SeccionPrecios } from "./SeccionPrecios";
import { ProductoFormData } from "./FormularioProducto";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from "@/components/ui/select";

const uid = (p: string) => `${p}_${crypto.randomUUID().slice(0, 8)}`;

export const SeccionUbicaciones = () => {
  const { control, register, watch, setValue } = useFormContext<ProductoFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "producto_ubicaciones" });
  const inventarios = useWatch({ control, name: "inventarios" }) || [];
  const precios = useWatch({ control, name: "precios" }) || [];

  const [negocios, setNegocios] = useState<any[]>([]);
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);
  const [mostrarInventario, setMostrarInventario] = useState<Record<string, boolean>>({});
  const [mostrarPrecio, setMostrarPrecio] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [resNegocios, resUbicaciones] = await Promise.all([
        fetch("http://localhost:3001/api/negocio"),
        fetch("http://localhost:3001/api/ubicacion"),
      ]);
      const negociosData = await resNegocios.json();
      const ubicacionesData = await resUbicaciones.json();
      setNegocios(negociosData.data || []);
      setUbicaciones(ubicacionesData.data || []);
    };
    fetchData();
  }, []);

  const toggleSeccion = (tipo: "inventario" | "precio", id: string) => {
    if (tipo === "inventario") {
      setMostrarInventario(prev => ({ ...prev, [id]: !prev[id] }));
    } else {
      setMostrarPrecio(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const addUbic = () => {
    const invId = uid("inv");
    const prId = uid("price");
    append({
      negocio_id: negocios[0]?.id || 1,
      ubicacion_fisica_id: ubicaciones[0]?.id || 1,
      idVirtualInventario: invId,
      idVirtualPrecio: prId,
      compartir: false,
    });
    setValue("inventarios", [...inventarios, {
      idVirtual: invId,
      stock_actual: 1,
      stock_minimo: 0,
      precio_costo: 1,
      ubicacion_fisica_id: ubicaciones[0]?.id || 1,
    }]);
    setValue("precios", [...precios, {
      idVirtual: prId,
      precio_venta: 1,
      tipo_cliente_id: 1,
      vigente: true,
    }]);
  };

  const purge = (index: number) => {
    const u = watch("producto_ubicaciones")[index];
    if (u?.idVirtualInventario) {
      setValue("inventarios", inventarios.filter(i => i.idVirtual !== u.idVirtualInventario));
    }
    if (u?.idVirtualPrecio) {
      setValue("precios", precios.filter(p => p.idVirtual !== u.idVirtualPrecio));
    }
    remove(index);
    toast.success("Ubicación eliminada");
  };

  const toggle = (
    tipo: "inventario" | "precio",
    val: boolean,
    ubic: any,
    idx: number
  ) => {
    if (tipo === "inventario") {
      if (!val && ubic.idVirtualInventario) {
        setValue("inventarios", inventarios.filter(i => i.idVirtual !== ubic.idVirtualInventario));
        setValue(`producto_ubicaciones.${idx}.idVirtualInventario`, undefined);
      } else if (val && !ubic.idVirtualInventario) {
        const id = uid("inv");
        setValue(`producto_ubicaciones.${idx}.idVirtualInventario`, id);
        setValue("inventarios", [...inventarios, {
          idVirtual: id,
          stock_actual: 0,
          stock_minimo: 0,
          precio_costo: 0,
          ubicacion_fisica_id: ubic.ubicacion_fisica_id ?? 1,
        }]);
      }
    } else {
      if (!val && ubic.idVirtualPrecio) {
        setValue("precios", precios.filter(p => p.idVirtual !== ubic.idVirtualPrecio));
        setValue(`producto_ubicaciones.${idx}.idVirtualPrecio`, undefined);
      } else if (val && !ubic.idVirtualPrecio) {
        const id = uid("price");
        setValue(`producto_ubicaciones.${idx}.idVirtualPrecio`, id);
        setValue("precios", [...precios, {
          idVirtual: id,
          precio_venta: 0,
          tipo_cliente_id: 1,
          vigente: true,
        }]);
      }
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MapPin className="h-5 w-5" /> Ubicaciones del producto
      </h2>

      {fields.map((field, idx) => {
        const ubic = watch("producto_ubicaciones")[idx];
        const invObj = inventarios.find(i => i.idVirtual === ubic?.idVirtualInventario);
        const prObj = precios.find(p => p.idVirtual === ubic?.idVirtualPrecio);

        return (
          <Card key={field.id} className="border-muted">
            <CardHeader className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label>Negocio</Label>
                <Select
                  value={String(ubic?.negocio_id || "")}
                  onValueChange={v => setValue(`producto_ubicaciones.${idx}.negocio_id`, parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar negocio" />
                  </SelectTrigger>
                  <SelectContent>
                    {negocios.map(n => (
                      <SelectItem key={n.id} value={String(n.id)}>
                        {n.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Ubicación física</Label>
                <Select
                  value={String(ubic?.ubicacion_fisica_id || "")}
                  onValueChange={v => setValue(`producto_ubicaciones.${idx}.ubicacion_fisica_id`, parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {ubicaciones.map(u => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!ubic.idVirtualInventario}
                    onCheckedChange={v => toggle("inventario", v, ubic, idx)}
                  />
                  <Label>Inventario</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!ubic.idVirtualPrecio}
                    onCheckedChange={v => toggle("precio", v, ubic, idx)}
                  />
                  <Label>Precio</Label>
                </div>
              </div>

              {invObj && (
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="outline"
                      onClick={() => toggleSeccion("inventario", ubic.idVirtualInventario)}
                      className="cursor-pointer bg-amber-50 text-amber-700 border-amber-300 flex items-center gap-1 px-2 py-1"
                    >
                      <PackageSearch className="h-4 w-4" /> Inventario
                    </Badge>
                  </div>
                  {mostrarInventario[ubic.idVirtualInventario] && (
                    <SeccionInventarios
                      inv={invObj}
                      idVirtual={ubic.idVirtualInventario}
                      inventarios={inventarios}
                      setValue={setValue}
                    />
                  )}
                </div>
              )}

              {prObj && (
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="outline"
                      onClick={() => toggleSeccion("precio", ubic.idVirtualPrecio)}
                      className="cursor-pointer bg-emerald-50 text-emerald-700 border-emerald-300 flex items-center gap-1 px-2 py-1"
                    >
                      <DollarSign className="h-4 w-4" /> Precio
                    </Badge>
                  </div>
                  {mostrarPrecio[ubic.idVirtualPrecio] && (
                    <SeccionPrecios
                      precio={prObj}
                      idVirtual={ubic.idVirtualPrecio}
                      precios={precios}
                      setValue={setValue}
                    />
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Label>Compartir</Label>
                  <Switch
                    checked={ubic?.compartir ?? false}
                    onCheckedChange={v => setValue(`producto_ubicaciones.${idx}.compartir`, v)}
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
                      <AlertDialogAction onClick={() => purge(idx)}>Confirmar</AlertDialogAction>
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
