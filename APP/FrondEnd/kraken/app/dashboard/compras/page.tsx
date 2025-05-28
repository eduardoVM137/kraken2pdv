// IMPORTS Y ESTADO
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  codigoBarras: string;
  alias?: string;
  precioAnterior: number;
  precioActual: number;
  cantidad: number;
  presentacionId?: number;
  cantidadPorPresentacion?: number;
  presentacionNombre?: string;
}

interface DetalleExtendido {
  [detalleId: string]: {
    inventarios: any[];
    precios: any[];
  };
}

export default function ComprasPage() {
  const [factura, setFactura] = useState("001");
  const [proveedor, setProveedor] = useState("Proveedor General");
  const [codigo, setCodigo] = useState("");
  const [filtro, setFiltro] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [detallesExtendidos, setDetallesExtendidos] = useState<DetalleExtendido>
  ({});
  const [presentacionesPorDetalle, setPresentacionesPorDetalle] = useState<Record<string, any[]>>({});

const productosFiltrados = productos.filter((p) => {
  const nombreMatch = p.nombre?.toLowerCase().includes(filtro.toLowerCase());
  const codigoMatch = p.alias?.includes(filtro);
  return nombreMatch || codigoMatch;
});

// Nuevo cálculo: toma en cuenta precio, cantidad, IVA
const subtotal = productosFiltrados.reduce((acc, p) => {
  const totalPiezas = p.cantidad * (p.cantidadPorPresentacion || 1);
  return acc + (p.precioActual || 0) * totalPiezas;
}, 0);

const impuesto = productosFiltrados.reduce((acc, p) => {
  const totalPiezas = p.cantidad * (p.cantidadPorPresentacion || 1);
  const iva = p.iva || 0;
  return acc + ((p.precioActual || 0) * totalPiezas * iva) / 100;
}, 0);

const total = subtotal + impuesto;

 async function agregarProductoPorCodigo() {
  if (!codigo.trim()) return;

  const res = await fetch(`http://localhost:3001/api/detalle-producto/buscar-general/${codigo}`);
  const data = await res.json();

  if (!data || !data.detalle_producto_id) {
    alert("Producto no encontrado");
    return;
  }

  const detalleId = data.detalle_producto_id;

  // Manejo de presentación: si no tiene, usar default
  const tienePresentacion = !!data.presentacion_id;
  const presentacionId = tienePresentacion ? data.presentacion_id : 0;
  const cantidadPresentacion = tienePresentacion ? parseFloat(data.cantidad_presentacion) || 1 : 1;
  const nombrePresentacion = tienePresentacion ? data.presentacion_nombre : "Sin presentación";

  const nuevo: Producto = {
    id: detalleId,
    nombre: data.nombre,
    descripcion: data.descripcion,
    imagen: data.imagen || "/img/placeholder.png",
    codigoBarras: data.codigo_barras,
    alias: data.alias || "",
    precioAnterior: parseFloat(data.precio_anterior) || 0,
    precioActual: parseFloat(data.precio_actual) || 0,
    cantidad: 1,
    presentacionId,
    cantidadPorPresentacion: cantidadPresentacion,
    presentacionNombre: nombrePresentacion,
  };

  setProductos((prev) => [...prev, nuevo]);
  setCodigo("");
}


  

  async function cargarDetallesExtendidos() {
    const nuevosDetalles: DetalleExtendido = {};
    for (const p of productos) {
      const detalles = await fetch(`http://localhost:3001/api/detalle-producto/detalle-expandido/${p.id}`).then(r => r.json());
      nuevosDetalles[p.id] = {
        precios: detalles.data?.precios || [],
        inventarios: detalles.data?.inventarios || [],
      };
    }
    setDetallesExtendidos(nuevosDetalles);
  }

  // === NUEVA FUNCIÓN PARA ACTUALIZAR CANTIDAD ===
function actualizarCantidad(id: string, nuevaCantidad: number) {
  setProductos((prev) =>
    prev.map((p) =>
      p.id === id ? { ...p, cantidad: nuevaCantidad } : p
    )
  );
}

async function actualizarPresentacion(id: string, nuevaPresentacionId: number, nuevaCantidad: number) {
  const productoActual = productos.find(p => p.id === id);

  // También puedes buscar precio específico si lo deseas
  const nuevoPrecio = productoActual?.precioActual || 0;

  setProductos(prev =>
    prev.map(p =>
      p.id === id
        ? {
            ...p,
            presentacionId: nuevaPresentacionId,
            cantidadPorPresentacion: nuevaCantidad,
            precioActual: nuevoPrecio, // aquí puedes cambiar por el precio asociado si lo manejas por presentación
          }
        : p
    )
  );
}

async function guardarCompra() {
  if (!factura.trim()) return alert("La factura no puede estar vacía.");
  if (productos.length === 0) return alert("Debes agregar al menos un producto.");

  try {
    const ingresoRes = await fetch("/api/ingreso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ factura, proveedor }),
    });

    if (!ingresoRes.ok) throw new Error("No se pudo crear el ingreso.");

    for (const p of productos) {
      const totalPiezas = p.cantidad * (p.cantidadPorPresentacion || 1);

      await fetch("/api/detalle-ingreso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          factura,
          detalle_producto_id: p.id,
          cantidad: totalPiezas,
          presentacion_id: p.presentacionId || null,
          precio_unitario: p.precioActual,
        }),
      });

      await fetch("/api/inventario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detalle_producto_id: p.id,
          cantidad: totalPiezas,
          costo: p.precioActual,
        }),
      });

      if (p.precioActual !== p.precioAnterior) {
        await fetch("/api/precio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            detalle_producto_id: p.id,
            precio_venta: p.precioActual,
            tipo_cliente_id: 1,
          }),
        });
      }
    }

    alert("Compra registrada correctamente.");
    setProductos([]);
    setFactura("");
    setProveedor("Proveedor General");
    setDetallesExtendidos({});
  } catch (error: any) {
    console.error("Error al guardar compra:", error.message);
    alert("Hubo un error al registrar la compra: " + error.message);
  }
}
function actualizarPrecio(id: string, nuevoPrecio: number) {
  setProductos((prev) =>
    prev.map((p) => (p.id === id ? { ...p, precioActual: nuevoPrecio } : p))
  );
}

function actualizarIVA(id: string, nuevoIVA: number) {
  setProductos((prev) =>
    prev.map((p) => (p.id === id ? { ...p, iva: nuevoIVA } : p))
  );
}

return (
  <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold mb-6">Panel de Compras</h1>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <div>
        <Label>Factura</Label>
        <Input value={factura} onChange={(e) => setFactura(e.target.value)} />
      </div>
      <div>
        <Label>Proveedor</Label>
        <Select onValueChange={setProveedor} value={proveedor}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Proveedor General">Proveedor General</SelectItem>
            <SelectItem value="Proveedor Alterno">Proveedor Alterno</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Código presentación / producto</Label>
        <div className="flex gap-2 mt-1">
          <Input placeholder="Escanea o escribe código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          <Button onClick={agregarProductoPorCodigo}>Agregar</Button>
        </div>
      </div>
    </div>

    <div className="flex justify-between items-center mb-4">
      <Input placeholder="Filtrar por nombre o código" value={filtro} onChange={(e) => setFiltro(e.target.value)} className="max-w-xs" />
      <Button variant="outline" onClick={cargarDetallesExtendidos}>Ver detalles</Button>
    </div>

    <Table>
      <TableHeader>
     <TableRow>
      <TableHead>Producto</TableHead>
      <TableHead>Alias</TableHead>
      <TableHead>Precio Anterior</TableHead>
      <TableHead>Precio Actual</TableHead>
      <TableHead>IVA %</TableHead>
      <TableHead>Cantidad</TableHead>
      <TableHead>Presentación</TableHead>
      <TableHead>Detalles</TableHead>
      <TableHead>Acciones</TableHead>
    </TableRow>
      </TableHeader>
<TableBody>
  {productosFiltrados.length === 0 ? ( 
      <TableRow>
        <TableCell colSpan={9} className="text-center text-muted-foreground py-6">
          No hay productos que coincidan con el filtro.
        </TableCell>
      </TableRow>
    ) : (
      productosFiltrados.map((p) => {
        const totalPiezas = p.cantidad * (p.cantidadPorPresentacion || 1);
        const detalle = detallesExtendidos[p.id];
        const presentacionActual = (presentacionesPorDetalle[p.id] || []).find(pr => pr.id === p.presentacionId);

        return (
      <TableRow key={p.id}>
            <TableCell>{p.nombre}</TableCell>
            <TableCell>{p.codigoBarras}</TableCell>
            <TableCell>S/ {p.precioAnterior.toFixed(2)}</TableCell>
            <TableCell>
              <Input
                type="number"
                value={p.precioActual}
                className="w-24"
                onChange={(e) => actualizarPrecio(p.id, parseFloat(e.target.value) || 0)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={p.iva ?? 0}
                className="w-16"
                min={0}
                max={100}
                onChange={(e) => actualizarIVA(p.id, parseFloat(e.target.value) || 0)}
              />
            </TableCell>
          {/* Cantidad */}
          <TableCell>
            <Input
              type="number"
              min={1}
              className="w-20"
              value={p.cantidad}
              onChange={(e) => actualizarCantidad(p.id, parseInt(e.target.value) || 1)}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {p.cantidad} x {p.cantidadPorPresentacion || 1} = {totalPiezas} pz
            </div>
          </TableCell>

          {/* Presentación */}
          <TableCell>
  <Select
    value={p.presentacionId?.toString() || ""}
    onOpenChange={async (open) => {
      if (open && !presentacionesPorDetalle[p.id]) {
        try {
          const res = await fetch(`http://localhost:3001/api/presentacion/detalle/${p.id}`);
          const data = await res.json();
          if (data?.data?.length) {
            setPresentacionesPorDetalle(prev => ({
              ...prev,
              [p.id]: data.data
            }));
          }
        } catch (err) {
          console.error("Error cargando presentaciones:", err);
        }
      }
    }}
    onValueChange={async (val) => {
      const nuevaPresentacionId = parseInt(val);
      const res = await fetch(`http://localhost:3001/api/presentacion/${nuevaPresentacionId}`);
      const data = await res.json();
      const nuevaCantidad = parseFloat(data?.data?.cantidad) || 1;
      actualizarPresentacion(p.id, nuevaPresentacionId, nuevaCantidad);
    }}
  >
    <SelectTrigger className="w-44">
<SelectValue>
  {
    presentacionesPorDetalle[p.id]?.find(pr => pr.id === p.presentacionId)
      ? `${presentacionesPorDetalle[p.id].find(pr => pr.id === p.presentacionId)?.nombre} — ${
          presentacionesPorDetalle[p.id].find(pr => pr.id === p.presentacionId)?.cantidad || "?"
        } pz`
      : `${p.presentacionNombre || `ID ${p.presentacionId}`} — ${p.cantidadPorPresentacion || 1} pz`
  }
</SelectValue>


    </SelectTrigger>
<SelectContent>
  <SelectItem value="0">Sin presentación — 1 pz</SelectItem>
  {(presentacionesPorDetalle[p.id] || []).map(pres => (
    <SelectItem key={pres.id} value={pres.id.toString()}>
      {pres.nombre} — {pres.cantidad} pz
    </SelectItem>
  ))}
</SelectContent>

  </Select>
</TableCell>




          {/* Detalles */}
  <TableCell>
              {detalle && (
                <div className="text-xs space-y-1">
                  {detalle.inventarios.map((inv, idx) => (
                    <div key={idx}>📦 {inv.ubicacion_nombre || "Ubicación"} — {inv.stock_actual} pz</div>
                  ))}
                  {detalle.precios.map((pr, idx) => (
                    <div key={idx}>💲 S/ {pr.precio_venta} — Tipo {pr.tipo_cliente_id}</div>
                  ))}
                </div>
              )}
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setProductos(productos.filter((prod) => prod.id !== p.id))}
              >
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        );
      })
    )}
  </TableBody>
</Table>

    <div className="flex justify-between items-center border-t pt-4 mt-6">
 <div className="space-y-1 text-sm">
  <div>Subtotal: S/ {subtotal.toFixed(2)}</div>
  <div>Impuesto: S/ {impuesto.toFixed(2)}</div>
  <div className="font-semibold">Total: S/ {total.toFixed(2)}</div>
</div>
      <Button onClick={guardarCompra}>Enviar</Button>
    </div>
  </main>
);
}
