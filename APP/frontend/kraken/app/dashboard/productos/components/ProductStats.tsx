 interface ProductStatsProps {
  productos: {
    activo: string;
    stock: number;
    precios?: { precio_venta: string }[];
  }[];
}

export const ProductStats = ({ productos }: ProductStatsProps) => {
  const activos = productos.filter(p => p.activo === "activo");
  const totalStock = productos.reduce((acc, p) => acc + (p.stock || 0), 0);
  const sinStock = productos.filter(p => (p.stock || 0) <= 0);

  const inventoryValue = productos.reduce((acc, p) => {
    const precio = Number(p.precios?.[0]?.precio_venta || 0);
    return acc + precio * (p.stock || 0);
  }, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">Active Products</p>
        <p className="text-2xl font-bold text-primary">{activos.length}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">Total Stock</p>
        <p className="text-2xl font-bold text-primary">{totalStock.toLocaleString()}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">No Stock</p>
        <p className="text-2xl font-bold text-destructive">{sinStock.length}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">Inventory Value</p>
        <p className="text-2xl font-bold text-primary">${inventoryValue.toLocaleString()}</p>
      </div>
    </div>
  );
};
