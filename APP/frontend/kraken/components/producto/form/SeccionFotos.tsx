"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { ProductoFormData } from "./FormularioProducto";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const FOTO_DEFAULT = "/default-product.jpg";

export const SeccionFotos = () => {
  const { control } = useFormContext<ProductoFormData>();
  const { append, remove } = useFieldArray({ control, name: "fotos" });
  const fotos = useWatch({ control, name: "fotos" }) || [];

  const [fotoActual, setFotoActual] = useState(0);
  const [bloque, setBloque] = useState(0);
  const maxPreview = 4;

  const handlers = useSwipeable({
    onSwipedLeft: () => setFotoActual((prev) => (prev + 1 < fotos.length ? prev + 1 : 0)),
    onSwipedRight: () => setFotoActual((prev) => (prev - 1 >= 0 ? prev - 1 : fotos.length - 1)),
    trackMouse: true,
  });

  useEffect(() => {
    if (fotos.length === 0) setFotoActual(0);
  }, [fotos.length]);

  const eliminarImagen = (index: number) => {
    setFotoActual((prev) => (index < prev ? prev - 1 : prev === index ? Math.max(prev - 1, 0) : prev));
    remove(index);
  };

  const agregarImagen = () => {
    const nueva = prompt("URL de la imagen:");
    if (nueva?.trim().startsWith("http")) append(nueva.trim());
  };

  const previews = fotos.slice(bloque * maxPreview, (bloque + 1) * maxPreview);
  const totalBloques = Math.ceil(fotos.length / maxPreview);
  const mostrarFoto = fotos.length > 0 ? fotos[fotoActual] : FOTO_DEFAULT;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Fotos del producto</h2>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start" {...handlers}>
          <div className="relative w-full md:w-64 aspect-square border rounded overflow-hidden mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={mostrarFoto}
                className="absolute w-full h-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={mostrarFoto}
                  alt={`Foto ${fotoActual + 1}`}
                  layout="fill"
                  objectFit="contain"
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {fotos.length > 0 && (
            <div className="flex flex-col items-center gap-2">
              <div className={cn("flex gap-2 overflow-hidden scroll-smooth", "md:flex-col md:w-20 md:max-h-[300px] md:overflow-auto")}> 
                {previews.map((src, idx) => {
                  const realIndex = bloque * maxPreview + idx;
                  return (
                    <div
                      key={realIndex}
                      className={cn("relative aspect-square w-[60px] border rounded overflow-hidden group cursor-pointer", {
                        "ring-2 ring-primary": realIndex === fotoActual,
                      })}
                    >
                      <Image
                        src={src || FOTO_DEFAULT}
                        alt={`Miniatura ${realIndex + 1}`}
                        fill
                        className="object-contain"
                        unoptimized
                        onClick={() => setFotoActual(realIndex)}
                      />
                      <button
                        type="button"
                        onClick={() => eliminarImagen(realIndex)}
                        className="absolute top-0 right-0 p-1 bg-white/80 text-red-500 hover:text-red-700 rounded-bl-md opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                {bloque > 0 && (
                  <Button type="button" size="icon" variant="ghost" onClick={() => setBloque(bloque - 1)} className="text-muted-foreground">
                    ←
                  </Button>
                )}
                {bloque + 1 < totalBloques && (
                  <Button type="button" size="icon" variant="ghost" onClick={() => setBloque(bloque + 1)} className="text-muted-foreground">
                    →
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <Button type="button" variant="outline" onClick={agregarImagen}>
          + Agregar foto
        </Button>
      </div>
    </section>
  );
};
