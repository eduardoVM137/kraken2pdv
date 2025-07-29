// components/TablaVenta.tsx
"use client";

import { useState, ChangeEvent, MouseEvent } from "react";
import { Button } from "@/components/ui/button";

/**
 * Estructura de un producto en la venta
 */
interface ProductoVenta {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  descuento?: number;    // descuento en monto fijo
  descuentoRaw?: string; // input textual (ej. "5" o "10%")
  iva?: number;          // porcentaje de IVA (0-100)
  presentacion_id: number;
}

interface TablaVentaProps {
  productos: ProductoVenta[];
  setProductos: (items: ProductoVenta[]) => void;
  agregarVentaPendiente: (items: ProductoVenta[]) => void;
}

/**
 * Tabla interactiva de venta con descuento fijo/%, IVA %, y toggle de detalles.
 */
export default function TablaVenta({
  productos,
  setProductos,
  agregarVentaPendiente,
}: TablaVentaProps) {
  // Mostrar/ocultar columnas de detalle
  const [showDetails, setShowDetails] = useState(false);

  // Recalcular totales generales
  const totalGeneral = productos.reduce((sum, item) => {
    const desc = item.descuento ?? 0;
    const base = item.precio * item.cantidad - desc;
    const ivaPct = item.iva ?? 0;
    const tax = (base * ivaPct) / 100;
    return sum + base + tax;
  }, 0);

  const totalItems = productos.reduce((sum, item) => sum + item.cantidad, 0);
  const totalUnicos = productos.length;

  /**
   * Maneja el cambio en el campo de descuento (fijo o porcentaje)
   */
  const handleDescuentoChange = (raw: string, index: number) => {
    const copia = [...productos];
    let newDesc = 0;
    if (raw.endsWith("%")) {
      const pct = parseFloat(raw.slice(0, -1)) || 0;
      newDesc = (copia[index].precio * copia[index].cantidad * pct) / 100;
    } else {
      newDesc = parseFloat(raw) || 0;
    }
    copia[index].descuento = newDesc;
    copia[index].descuentoRaw = raw;
    setProductos(copia);
  };

  return (
    <div>
      {/* Toggle de detalles */}
      <div className="flex gap-2 mb-2">
        <Button size="sm" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Ocultar detalles" : "Mostrar detalles"}
        </Button>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1">Descripción</th>
            <th className="text-center py-1">Cant</th>
            <th className="text-right py-1">Precio</th>
            {showDetails && <th className="text-right py-1">Descuento</th>}
            {showDetails && <th className="text-right py-1">IVA %</th>}
            <th className="text-right py-1">Subtotal</th>
            <th className="text-right py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((item, index) => {
            const desc = item.descuento ?? 0;
            const base = item.precio * item.cantidad - desc;
            const ivaPct = item.iva ?? 0;
            const tax = (base * ivaPct) / 100;
            const total = base + tax;

            return (
              <tr key={`${item.id}-${item.presentacion_id}`} className="border-b">
                {/* Descripción */}
                <td>{item.nombre}</td>

                {/* Cantidad editable */}
                <td className="text-center flex items-center justify-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => {
                    const copia = [...productos];
                    copia[index].cantidad = Math.max(1, copia[index].cantidad - 1);
                    setProductos(copia);
                  }}>−</Button>
                  <input
                    type="number"
                    className="w-12 text-center"
                    min={1}
                    value={item.cantidad}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const val = parseInt(e.target.value) || 1;
                      const copia = [...productos];
                      copia[index].cantidad = val;
                      setProductos(copia);
                    }}
                  />
                  <Button size="sm" variant="outline" onClick={() => {
                    const copia = [...productos];
                    copia[index].cantidad += 1;
                    setProductos(copia);
                  }}>+</Button>
                </td>

                {/* Precio unitario */}
                <td className="text-right">${item.precio.toFixed(2)}</td>

                {/* Descuento: fijo o porcentaje */}
                {showDetails && (
                  <td className="text-right">
                    <input
                      type="text"
                      className="w-20 text-right"
                      placeholder="0 o 10%"
                      value={item.descuentoRaw ?? (desc.toFixed(2))}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleDescuentoChange(e.target.value, index)
                      }
                    />
                  </td>
                )}

                {/* IVA editable porcentaje */}
                {showDetails && (
                  <td className="text-right">
                    <input
                      type="number"
                      className="w-16 text-right"
                      min={0}
                      max={100}
                      value={ivaPct}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const val = parseFloat(e.target.value) || 0;
                        const copia = [...productos];
                        copia[index].iva = val;
                        setProductos(copia);
                      }}
                    />
                  </td>
                )}

                {/* Subtotal siempre visible */}
                <td className="text-right">${total.toFixed(2)}</td>

                {/* Botón quitar fila */}
                <td className="text-right">
                  <Button variant="destructive" size="sm" onClick={() =>
                    setProductos(productos.filter((_, i) => i !== index))
                  }>
                    Quitar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totales */}
      <div className="flex justify-between items-center mt-4 text-sm font-semibold">
        <span>Total parcial:</span>
        <span>${totalGeneral.toFixed(2)} — {totalItems} artículo{totalItems!==1?'s':''}, {totalUnicos} tipo{totalUnicos!==1?'s':''}</span>
      </div>

      {/* Acciones */}
      <div className="flex justify-between flex-wrap gap-2 mt-2 items-center">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => agregarVentaPendiente(productos)} disabled={productos.length===0}>
            Guardar como pendiente
          </Button>
          <Button variant="ghost" onClick={() => {
            if (productos.length>0 && window.confirm("¿Deseas limpiar el carrito?")) setProductos([]);
          }} disabled={productos.length===0}>
            Limpiar carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
