"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { ProductoFormData } from "./FormularioProducto";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"; 
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,AlertDialogTrigger  } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SeccionPrecios } from "./SeccionPrecios";
import { SeccionInventarios } from "./SeccionInventarios";
import { ComboboxSelect } from "@/components/ui/ComboboxSelect";
import { Switch } from "@/components/ui/switch"; 
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; 
import { uuid } from "@/lib/generateVirtualId";

const TEMP_ID = "__NEW_INV__";
const DEFAULT_INV = {
  idVirtual: TEMP_ID,
  stock_actual: 0,
  stock_minimo: 0,
  precio_costo: 0,
  proveedor_id: null,          // antes 1
  ubicacion_fisica_id: undefined, // antes 1
  celdas: [],
};
export const SeccionUbicaciones = () => {
const { control, setValue, getValues } = useFormContext<ProductoFormData>();

  const {
    fields: ubicaciones,
    append: appendUbicacion,
    remove: removeUbicacion,
    update: updateUbicacion,
  } = useFieldArray({ control, name: "producto_ubicaciones" });
const {
  fields: precios,
  append: appendPrecio,
  remove: removePrecio,
  update: updatePrecio,
} = useFieldArray({ control, name: "precios" });

  
const {
    fields: inventarios,
  append: appendInventario,
  remove: removeInventario,
  update: updateInventario,
} = useFieldArray({ control, name: "inventarios" });


 const [chipsPrecios, setChipsPrecios] = useState(precios); 
const [chipsInventarios, setChipsInventarios] = useState(
  inventarios.filter(i => i.idVirtual !== TEMP_ID)
);

useEffect(() => {
  if (
    ubicaciones.length === 0 &&
    (chipsPrecios.length > 0 || chipsInventarios.length > 0)
  ) {
    appendUbicacion({
      negocio_id: 1,
      ubicacion_fisica_id: 1,
      compartir: false,
      idVirtualPrecio: chipsPrecios.map((p) => p.idVirtual),
      idVirtualInventario: chipsInventarios.map((i) => i.idVirtual),
    });
  }
}, [chipsPrecios, chipsInventarios]);
  const preciosWatch = useWatch({ control, name: "precios" }) ?? [];
  const inventariosWatch = useWatch({ control, name: "inventarios" }) ?? [];

  const [expandedPrecio, setExpandedPrecio] = useState<string | null>(null);
  const [expandedInventario, setExpandedInventario] = useState<string | null>(null);
  const [modoCreacion, setModoCreacion] = useState(false);

  const [negocios, setNegocios] = useState<any[]>([]);
  const [ubicacionesFisicas, setUbicacionesFisicas] = useState<any[]>([]);
  const [tempUbicacion, setTempUbicacion] = useState<any>({});
  const [selectedPrecios, setSelectedPrecios] = useState<string[]>([]);
  const [selectedInventarios, setSelectedInventarios] = useState<string[]>([]);
 
  const toggleItem = (array: string[], value: string, setter: any) => {
    if (array.includes(value)) {
      setter(array.filter((v) => v !== value));
    } else {
      setter([...array, value]);
    }
  };

const handleGuardarUbicacion = () => {
  const negocioId = Number(tempUbicacion.negocio_id);
  const ubicacionId = Number(tempUbicacion.ubicacion_fisica_id);

  // Validación mínima
  if (!negocioId || !ubicacionId) {
    toast.error("Debes seleccionar una ubicación física y un negocio");
    return;
  }

  appendUbicacion({
    negocio_id: negocioId,
    ubicacion_fisica_id: ubicacionId,
    compartir: tempUbicacion.compartir ?? false,
    idVirtualPrecio: selectedPrecios,
    idVirtualInventario: selectedInventarios,
  });

  setModoCreacion(false);
  setTempUbicacion({});
  setSelectedPrecios([]);
  setSelectedInventarios([]);
};

useEffect(() => {
  const fetchListas = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

      const [nRes, uRes] = await Promise.all([
        fetch(`${baseUrl}/api/negocio`),
        fetch(`${baseUrl}/api/ubicacion-fisica`),
      ]);

      const nData = await nRes.json();
      const uData = await uRes.json();

      // 🧽 Asegurar que todos los negocios tengan nombre
      const negociosLimpios = (Array.isArray(nData?.data) ? nData.data : []).map((n) => ({
        ...n,
        nombre: n.nombre ?? `Negocio #${n.id}`,
      }));

      // 🧽 Asegurar que todas las ubicaciones tengan nombre
      const ubicacionesLimpias = (Array.isArray(uData?.data) ? uData.data : []).map((u) => ({
        ...u,
        nombre: u.nombre ?? `Ubicación #${u.id}`,
      }));

      setNegocios(negociosLimpios);
      setUbicacionesFisicas(ubicacionesLimpias);
    } catch (err) {
      console.error("❌ Error cargando listas:", err);
      setNegocios([]);
      setUbicacionesFisicas([]);
    }
  };

  fetchListas();
}, []);


  const agregarPrecio = () => {
    const id = uuid();
    appendPrecio({ idVirtual: id, precio_venta: 0, tipo_cliente_id: 1, vigente: true });
    setExpandedPrecio(id);
    if (ubicaciones.length === 1) {
      updateUbicacion(0, {
        ...ubicaciones[0],
        idVirtualPrecio: [...ubicaciones[0].idVirtualPrecio ?? [], id],
      });
    }
  };
useEffect(() => {
  if (!expandedInventario && inventariosWatch.length === 0) {
    const id = uuid();
    appendInventario({
      idVirtual: id,
      stock_actual: 0,
      stock_minimo: 0,
      precio_costo: 0,
      proveedor_id: 1,
      ubicacion_fisica_id: 1,
      celdas: [],
    });
    setExpandedInventario(id);   // ← aquí enlazamos el editor
  }
}, [expandedInventario, inventariosWatch.length]);

 
  const agregarInventario = () => {
  const id = uuid();
  appendInventario({
    idVirtual: id,
    stock_actual: 0,
    stock_minimo: 0,
    precio_costo: 0,
    proveedor_id: 1,
    ubicacion_fisica_id: 1,
    celdas: [],
  });
  setExpandedInventario(id);
  if (ubicaciones.length === 1) {
    updateUbicacion(0, {
      ...ubicaciones[0],
      idVirtualInventario: [
        ...(ubicaciones[0].idVirtualInventario ?? []),
        id,
      ],
    });
  }
};


// 1) Asegúrate de que siempre haya un placeholder en el array:
useEffect(() => {
  if (!inventariosWatch.some((i) => i.idVirtual === TEMP_ID)) {
    appendInventario({ ...DEFAULT_INV });
    setExpandedInventario(TEMP_ID);
  }
}, [inventariosWatch]);
const eliminarSiNoEstaEnUso = (id: string, tipo: "precio" | "inventario") => {
  // 1) Logica original de “en uso” y limpieza en ubicaciones
  const enUso = ubicaciones.some((u) => {
    const lista = tipo === "precio" ? u.idVirtualPrecio : u.idVirtualInventario;
    return lista?.includes(id);
  });

  if (enUso) {
    const confirmar = confirm(
      `Este ${tipo} está en uso en una o más ubicaciones. ¿Deseas eliminarlo de todas y continuar?`
    );
    if (!confirmar) return;

    ubicaciones.forEach((u, idx) => {
      const nueva = {
        ...u,
        idVirtualPrecio:
          tipo === "precio"
            ? u.idVirtualPrecio?.filter((pid: string) => pid !== id)
            : u.idVirtualPrecio,
        idVirtualInventario:
          tipo === "inventario"
            ? u.idVirtualInventario?.filter((iid: string) => iid !== id)
            : u.idVirtualInventario,
      };
      updateUbicacion(idx, nueva);
    });
  }

  // 2) Si es precio, borro como antes...
  if (tipo === "precio") {
    const idx = preciosWatch.findIndex((p) => p.idVirtual === id);
    if (idx !== -1) {
      removePrecio(idx);
      setChipsPrecios(prev => prev.filter(p => p.idVirtual !== id));
      toast.success("Precio eliminado");
    }
    return;
  }
  console.log("Eliminando inventario");

    // 1) Si estabas editando justo este inventario, vamos al placeholder YA:
  if (expandedInventario === id) {
    setExpandedInventario(TEMP_ID);
  }

  // 2) Quitamos del form y de los chips
  const idxInv = inventariosWatch.findIndex((i) => i.idVirtual === id);
  if (idxInv === -1) return;
  removeInventario(idxInv);
  setChipsInventarios((prev) => prev.filter((i) => i.idVirtual !== id));

  // 3) Creamos siempre un nuevo placeholder (no esperamos al watch):
  appendInventario({ ...DEFAULT_INV });

  toast.success("Inventario eliminado");
};


const inv = inventariosWatch.find(i => i.idVirtual === expandedInventario) || {
  idVirtual: "nuevo",
  stock_actual: 0,
  stock_minimo: 0,
  precio_costo: 0,
  proveedor_id: 1,
  ubicacion_fisica_id: 1,
  celdas: [],
};
  return (
    <Accordion type="multiple" className="space-y-4">
      {/* 🟢 Precios */} 
          <AccordionItem value="precios">
      <AccordionTrigger>💲 Sección de precios</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-wrap gap-2 mb-2">
          {chipsPrecios.map((p) => (
            <Badge
              key={p.idVirtual}
              onClick={() => setExpandedPrecio(p.idVirtual)}
              className="flex items-center gap-1 cursor-pointer"
            >
              ${p.precio_venta ?? 0}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // evita que abra edición
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar precio?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={() => eliminarSiNoEstaEnUso(p.idVirtual, "precio")}
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Badge>
          ))}
        </div>

        <Card className="my-2">
          <CardHeader className="text-sm font-semibold flex justify-between items-center">
            {expandedPrecio ? "Editar precio" : "Nuevo precio"}
          </CardHeader>
          <CardContent>
            <SeccionPrecios key={expandedPrecio || "nuevo"}
              idVirtual={expandedPrecio || "nuevo"}
              precio={
                preciosWatch.find((p) => p.idVirtual === expandedPrecio) ??
                { precio_venta: 0, tipo_cliente_id: 1, vigente: true }
              }
              precios={preciosWatch}
              setValue={setValue}
            />

            <div className="mt-4 flex gap-2 justify-end">
              <Button
                type="button"
                onClick={() => {
                  const id = expandedPrecio || crypto.randomUUID();
                  const inputs = document.querySelectorAll<HTMLInputElement>("input");
                  const precioVentaInput = Array.from(inputs).find(i => i.inputMode === 'decimal');
                  const tipoClienteInput = Array.from(inputs).find(i => i.inputMode === 'numeric');

                  const nuevoPrecio = {
                    idVirtual: id,
                    precio_venta: Number(precioVentaInput?.value ?? 0),
                    tipo_cliente_id: Number(tipoClienteInput?.value ?? 1),
                    vigente: true,
                  };

                  const idx = preciosWatch.findIndex(p => p.idVirtual === expandedPrecio);
                  if (idx !== -1) {
                    updatePrecio(idx, nuevoPrecio);
                      setChipsPrecios(prev =>
    prev.map(p => p.idVirtual === nuevoPrecio.idVirtual ? nuevoPrecio : p)
  );
                  } else {
                    appendPrecio(nuevoPrecio);
                      setChipsPrecios(prev => [...prev, nuevoPrecio]);

                    if (ubicaciones.length === 1) {
                      updateUbicacion(0, {
                        ...ubicaciones[0],
                        idVirtualPrecio: [...(ubicaciones[0].idVirtualPrecio ?? []), id],
                      });
                    }
                  }

                  toast.success(`Precio ${expandedPrecio ? 'actualizado' : 'guardado'}`);
                  setExpandedPrecio(null);
                }}
              >
                💾 {expandedPrecio ? "Guardar cambios" : "Guardar"}
              </Button>
              <Button variant="secondary" onClick={() => setExpandedPrecio(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
      {/* 📦 Inventarios */}  

{/* 📦 Inventarios */}  
<AccordionItem value="inventarios">
  <AccordionTrigger>📦 Sección de inventarios</AccordionTrigger>
  <AccordionContent>
<div className="flex flex-wrap gap-2 mb-4">
  {chipsInventarios.map((i) => (
    <Badge
      key={i.idVirtual}
      onClick={() => {
        // Abre el modo edición
        setExpandedInventario(i.idVirtual);
        const idx = inventariosWatch.findIndex(inv => inv.idVirtual === i.idVirtual);
        Object.entries(i).forEach(([k, v]) => {
          if (k !== "idVirtual") setValue(`inventarios.${idx}.${k}`, v);
        });
      }}
      className="flex items-center gap-1 cursor-pointer"
    >
      Stock {i.stock_actual}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          {/* Sólo este botón dispara el diálogo */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // evita que abra el editor
            }}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar inventario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={() => eliminarSiNoEstaEnUso(i.idVirtual, "inventario")}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </Badge>
  ))}
</div>


    {/* — Formulario de Nuevo / Editar inventario — */}
    <Card className="my-2">
      <CardHeader className="text-sm font-semibold">
        {expandedInventario === TEMP_ID ? "Nuevo inventario" : "Editar inventario"}
      </CardHeader>
      <CardContent>
        <SeccionInventarios
          key={expandedInventario}           // <--- fuerza remonte

          idVirtual={expandedInventario!}
           inv={
    inventariosWatch.find(x => x.idVirtual === expandedInventario)
    ?? DEFAULT_INV
  }
          inventarios={inventariosWatch}
          setValue={setValue}
        />

        <div className="mt-4 flex justify-end gap-2">
          {/* Guardar */}
        <Button
        type="button"
        onClick={() => {
          const isNew = expandedInventario === TEMP_ID;
          const idx = inventariosWatch.findIndex(
            i => i.idVirtual === expandedInventario
          );
          if (idx === -1) return;
          const inv = inventariosWatch[idx];

          if (isNew) {
            // 1) Generar UUID solo al guardar
            const newId = uuid();


            // 2) Reemplazar el placeholder en RHF
            updateInventario(idx, { ...inv, idVirtual: newId });

            // 3) Actualizar tu estado de chips confirmados
            setChipsInventarios(prev => [
              /* quitamos cualquier placeholder viejo */
              ...prev.filter(x => x.idVirtual !== TEMP_ID),
              /* añadimos el inventario real */
              { ...inv, idVirtual: newId }
            ]);

            toast.success("Inventario agregado");

            // 4) Si solo hay una ubicación, ligar el inventario
            if (ubicaciones.length === 1) {
              updateUbicacion(0, {
                ...ubicaciones[0],
                idVirtualInventario: [
                  ...(ubicaciones[0].idVirtualInventario ?? []),
                  newId,
                ],
              });
            }

            // 5) Crear un nuevo placeholder al final
            appendInventario({ ...DEFAULT_INV });

            // 6) Volver al modo “Nuevo”
            setExpandedInventario(TEMP_ID);

          } else {
            // Edición de un inventario ya existente
            updateInventario(idx, inv);
            setChipsInventarios(prev =>
              prev.map(x =>
                x.idVirtual === inv.idVirtual ? inv : x
              )
            );
            toast.success("Inventario actualizado");
            setExpandedInventario(TEMP_ID);
          }
        }}
      >
        💾 {expandedInventario === TEMP_ID ? "Guardar" : "Guardar cambios"}
      </Button>

       {/* Cancelar edición */}
<Button
  variant="secondary"
  type="button"
  onClick={() => {
    // 1) Buscamos el índice del placeholder
    const phIdx = inventariosWatch.findIndex(i => i.idVirtual === TEMP_ID);
    if (phIdx !== -1) {
      // 2) Reseteamos el array a DEFAULT_INV
      updateInventario(phIdx, { ...DEFAULT_INV });
      // 3) Reseteamos los campos del formulario a esos mismos valores
      Object.entries(DEFAULT_INV).forEach(([key, val]) => {
        setValue(`inventarios.${phIdx}.${key}`, val);
      });
    }
    // 4) Salimos al modo "Nuevo inventario"
    setExpandedInventario(TEMP_ID);
  }}
>
  Cancelar
</Button>

        </div>
      </CardContent>
    </Card>
  </AccordionContent>
</AccordionItem>


      {/* 📍 Ubicaciones del producto */}

      <AccordionItem value="ubicaciones">
        <AccordionTrigger>📍 Ubicaciones del producto</AccordionTrigger>
        <AccordionContent>
          {ubicaciones.map((u, idx) => (
            <Card key={idx} className="mb-2">
              <CardHeader className="text-sm font-semibold">
                Ubicación #{idx + 1} – Negocio: {u.negocio_id}, Fisica: {u.ubicacion_fisica_id}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {u.idVirtualPrecio?.map(id => <Badge key={id}>💲 {id}</Badge>)}
                  {u.idVirtualInventario?.map(id => <Badge key={id}>📦 {id}</Badge>)}
                </div>
                <Button size="sm" variant="destructive" className="mt-2" onClick={() => removeUbicacion(idx)}>
                  <X className="w-4 h-4" /> Eliminar
                </Button>
              </CardContent>
            </Card>
          ))}

          {modoCreacion ? (
            <Card className="p-4 mt-4">
              <CardHeader className="text-sm font-semibold">Agregar ubicación</CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
           <ComboboxSelect
  options={negocios.map((n) => ({
    label: n.nombre,
    value: n.id.toString(),
  }))}
  selected={tempUbicacion.negocio_id?.toString() ?? ""}
  onChange={(val) => setTempUbicacion((p: any) => ({ ...p, negocio_id: val }))}
  placeholder="Selecciona un negocio"
/>

                  <ComboboxSelect
                    options={ubicacionesFisicas.map(u => ({ label: u.nombre, value: u.id.toString() }))}
                    selected={tempUbicacion.ubicacion_fisica_id?.toString() ?? ""}
                    onChange={(val) => setTempUbicacion((p: any) => ({ ...p, ubicacion_fisica_id: val }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={tempUbicacion.compartir ?? false} onCheckedChange={(v) => setTempUbicacion((p: any) => ({ ...p, compartir: v }))} />
                  <Label>Compartir stock</Label>
                </div>
                <div>
                  <Label className="block mb-1">Selecciona precios</Label>
                  <div className="flex gap-2 flex-wrap">
                    {preciosWatch.map((p) => (
                      <Badge key={p.idVirtual} onClick={() => toggleItem(selectedPrecios, p.idVirtual, setSelectedPrecios)} className={selectedPrecios.includes(p.idVirtual) ? "bg-green-500 text-white cursor-pointer" : "bg-muted text-muted-foreground cursor-pointer"}>${p.precio_venta}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="block mb-1">Selecciona inventarios</Label>
                  <div className="flex gap-2 flex-wrap">
                    {inventariosWatch.map((i) => (
                      <Badge key={i.idVirtual} onClick={() => toggleItem(selectedInventarios, i.idVirtual, setSelectedInventarios)} className={selectedInventarios.includes(i.idVirtual) ? "bg-blue-500 text-white cursor-pointer" : "bg-muted text-muted-foreground cursor-pointer"}>Stock {i.stock_actual}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" onClick={handleGuardarUbicacion}><Check className="w-4 h-4 mr-1" />Guardar</Button>
                  <Button type="button" variant="ghost" onClick={() => setModoCreacion(false)}>Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button variant="outline" onClick={() => setModoCreacion(true)} className="mt-4">
              + Agregar ubicación
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
