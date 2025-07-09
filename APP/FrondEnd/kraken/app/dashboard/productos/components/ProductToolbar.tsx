// components/ui/ProductToolbar.tsx
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/app/utils/exportToCsv"; 

 
export const ProductToolbar = ({ productos }: { productos: any[] }) => {
  const handleExport = () => {
    exportToCSV(productos, "productos.csv");
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <input
        type="text"
        placeholder="Search products..."
        className="flex-1 max-w-xs border rounded px-2 py-1 text-sm"
      />
      <select className="text-sm border rounded px-2 py-1">
        <option>Category</option>
        <option>Drinks</option>
        <option>Food</option>
      </select>
      <select className="text-sm border rounded px-2 py-1">
        <option>Status</option>
        <option>Active</option>
        <option>Inactive</option>
        <option>Low Stock</option>
      </select>

      <Button onClick={handleExport} variant="outline" className="ml-auto">
        Export CSV
      </Button>
    </div>
  );
};
