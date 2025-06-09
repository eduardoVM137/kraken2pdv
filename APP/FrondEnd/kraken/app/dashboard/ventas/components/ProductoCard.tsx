// ProductoCard.tsx
import { useState } from "react";

interface Props {
  producto: any;
  onAgregar: (p: {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    presentacion_id?: number;
  }) => void;
}

export default function ProductoCard({ producto, onAgregar }: Props) {
  const [seleccionada, setSeleccionada] = useState(
    producto.presentaciones[0] ?? { cantidad_presentacion: 1, nombre_presentacion: "", presentacion_id: undefined }
  );

  const agregar = () => {
    const cantidad = seleccionada?.cantidad_presentacion || 1;
    const nombre = seleccionada?.presentacion_id
      ? `${producto.nombre_calculado} (${seleccionada.nombre_presentacion} x${cantidad})`
      : producto.nombre_calculado;

    onAgregar({
      id: producto.detalle_producto_id,
      nombre,
      precio: seleccionarPrecio(),
      cantidad,
      presentacion_id: seleccionada.presentacion_id,
    });
  };

  const seleccionarPrecio = () => {
    if (!producto.precios?.length) return 0;
    const conPresentacion = producto.precios.find(
      (p: any) => p.presentacion_id === seleccionada.presentacion_id
    );
    const sinPresentacion = producto.precios.find((p: any) => p.presentacion_id == null);
    return conPresentacion?.precio_venta || sinPresentacion?.precio_venta || 0;
  };

  return (
    <div
      className="border rounded-md p-4 bg-white shadow flex flex-col justify-between cursor-pointer hover:ring-2 ring-blue-500"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("button")) agregar();
      }}
    >
      <img
        src={producto.fotos?.[0] || "/default-product.jpg"}
        alt={producto.nombre_calculado}
        className="h-32 w-full object-contain mb-2"
      />
      <h3 className="font-semibold text-center line-clamp-2">
        {producto.nombre_calculado}
      </h3>

      <div className="text-sm text-center my-1">
        Precio: <strong>${seleccionarPrecio()}</strong> <br />
        Stock: <strong>{producto.stock_total}</strong>
      </div>

      {producto.presentaciones?.length > 0 && (
        <div className="border rounded p-1 max-h-28 overflow-y-auto mt-2 text-sm">
          {producto.presentaciones.map((p: any) => (
            <button
              key={p.presentacion_id}
              className={`block w-full px-2 py-1 rounded text-left ${
                seleccionada.presentacion_id === p.presentacion_id
                  ? "bg-blue-100 font-bold"
                  : "hover:bg-gray-100"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSeleccionada(p);
              }}
            >
              {p.nombre_presentacion} x{p.cantidad_presentacion}
            </button>
          ))}
        </div>
      )}

      <button
        className="mt-2 bg-green-600 text-white py-1 rounded hover:bg-green-700"
        onClick={(e) => {
          e.stopPropagation();
          agregar();
        }}
      >
        Agregar
      </button>
    </div>
  );
}
