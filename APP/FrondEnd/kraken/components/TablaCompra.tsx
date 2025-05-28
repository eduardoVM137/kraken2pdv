import { Button } from "@/components/ui/button";

interface ProductoVenta {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface VentaPendiente {
  id: string;
  timestamp: string;
  productos: ProductoVenta[];
}

interface TablaVentaProps {
  productos: ProductoVenta[];
  setProductos: (items: ProductoVenta[]) => void;
  agregarVentaPendiente: (items: ProductoVenta[]) => void;
  ventasPendientes?: VentaPendiente[];
  cargarVentaPendiente?: (venta: ProductoVenta[]) => void;
  eliminarVentaPendiente?: (id: string) => void;
}

export default function TablaVenta({ productos, setProductos, agregarVentaPendiente, ventasPendientes = [], cargarVentaPendiente, eliminarVentaPendiente }: TablaVentaProps) {
  const subtotal = productos.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalItems = productos.reduce((sum, item) => sum + item.cantidad, 0);
  const totalUnicos = productos.length;

  const generarIdVenta = () => `venta-${Date.now()}`;

  return (
    <div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1">Descripción</th>
            <th className="text-center py-1">Cant</th>
            <th className="text-right py-1">Precio</th>
            <th className="text-right py-1">Subtotal</th>
            <th className="text-right py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((item, index) => (
            <tr key={item.id} className="border-b">
              <td>{item.nombre}</td>
              <td className="text-center flex items-center justify-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const nuevaLista = [...productos];
                    nuevaLista[index].cantidad = Math.max(1, nuevaLista[index].cantidad - 1);
                    setProductos(nuevaLista);
                  }}
                >
                  −
                </Button>
                <span className="mx-1">{item.cantidad}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const nuevaLista = [...productos];
                    nuevaLista[index].cantidad += 1;
                    setProductos(nuevaLista);
                  }}
                >
                  +
                </Button>
              </td>
              <td className="text-right">${item.precio.toFixed(2)}</td>
              <td className="text-right">${(item.precio * item.cantidad).toFixed(2)}</td>
              <td className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const nuevaLista = productos.filter((_, i) => i !== index);
                    setProductos(nuevaLista);
                  }}
                >
                  Quitar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm font-semibold">
        <span>Total parcial:</span>
        <span>
          ${subtotal.toFixed(2)} — {totalItems} {totalItems === 1 ? "artículo" : "artículos"}, {totalUnicos} tipo{totalUnicos !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex justify-between flex-wrap gap-2 mt-2 items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => agregarVentaPendiente(productos)}
            disabled={productos.length === 0}
          >
            Guardar como pendiente
          </Button>
          <Button
            variant="ghost"
            onClick={() => setProductos([])}
            disabled={productos.length === 0}
          >
            Limpiar carrito
          </Button>
        </div>

        {ventasPendientes.length > 0 && cargarVentaPendiente && (
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
            {ventasPendientes.map((venta) => (
              <div key={venta.id} className="flex gap-1 items-center text-sm">
                <span className="text-muted-foreground">
                  {new Date(venta.timestamp).toLocaleTimeString()} — {venta.productos.length} productos
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => cargarVentaPendiente(venta.productos)}
                >
                  Cargar
                </Button>
                {eliminarVentaPendiente && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-6 w-6"
                    onClick={() => eliminarVentaPendiente(venta.id)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
