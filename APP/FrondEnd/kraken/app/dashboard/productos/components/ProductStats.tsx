export const ProductStats = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">Active Products</p>
        <p className="text-2xl font-bold text-primary">450</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">Total Stock</p>
        <p className="text-2xl font-bold text-primary">3,500</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">No Stock</p>
        <p className="text-2xl font-bold text-destructive">25</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">Inventory Value</p>
        <p className="text-2xl font-bold text-primary">$75,300</p>
      </div>
    </div>
  );
};
