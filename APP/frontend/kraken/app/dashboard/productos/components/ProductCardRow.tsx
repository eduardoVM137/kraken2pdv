import { Eye, Edit, Trash2, MoreHorizontal, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProductStatusBadge } from "./ProductStatusBadge";

interface Product {
  id: number;
  name: string;
  alias?: string;
  price: number;
  status: "active" | "inactive" | "low";
}

interface Props {
  product: Product;
}

export const ProductCardRow = ({ product }: Props) => {
  return (
    <tr className="border-b hover:bg-muted/50 transition">
      <td className="p-2 font-medium">
        <div>{product.name}</div>
        <div className="text-muted-foreground text-xs">{product.alias}</div>
      </td>
      <td className="p-2">${product.price.toFixed(2)}</td>
      <td className="p-2">
        <ProductStatusBadge status={product.status} />
      </td>
      <td className="p-2 flex gap-1 items-center">
        <Button size="icon" variant="ghost"><Eye className="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost"><Edit className="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost"><ArrowRightLeft className="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost"><Trash2 className="w-4 h-4" /></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost"><MoreHorizontal className="w-4 h-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Sale History</DropdownMenuItem>
            <DropdownMenuItem>Best Price Setting</DropdownMenuItem>
            <DropdownMenuItem>Analyze</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
