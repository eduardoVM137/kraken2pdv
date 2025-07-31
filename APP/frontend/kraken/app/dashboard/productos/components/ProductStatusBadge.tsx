import { cn } from "@/lib/utils";

interface Props {
  status: "active" | "inactive" | "low";
}

export const ProductStatusBadge = ({ status }: Props) => {
  const base = "px-2 py-1 text-xs font-medium rounded-full inline-block";

  const color = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-200 text-gray-600",
    low: "bg-yellow-100 text-yellow-800",
  }[status];

  return <span className={cn(base, color)}>{status}</span>;
};
