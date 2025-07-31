import { Button } from "@/components/ui/button";

export const ProductFilters = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded px-2 py-1 text-sm"
      />
      <select className="border rounded px-2 py-1 text-sm">
        <option>Category</option>
        <option>Drinks</option>
        <option>Food</option>
      </select>
      <select className="border rounded px-2 py-1 text-sm">
        <option>Status</option>
        <option>Active</option>
        <option>Inactive</option>
        <option>Low Stock</option>
      </select>
      <Button variant="outline" className="ml-auto">
        Filters
      </Button>
    </div>
  );
};
