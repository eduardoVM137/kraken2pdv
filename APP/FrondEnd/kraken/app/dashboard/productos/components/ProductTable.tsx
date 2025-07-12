"use client";

import { useMemo, useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FileDown,
  CheckCircle2,
  X,
  QrCode,
  LockKeyhole,
  ScrollText,
  MapPinIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportToCSV } from "@/app/utils/exportToCsv";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  activarProductos,
  eliminarProductos,
  transferirProductos,
} from "@/lib/fetchers/productos";

interface Producto {
  id: number;
  nombre_calculado: string;
  sku: string;
  stock: number;
  precio: number;
  alias?: { etiqueta_id: number; alias: string | null; tipo: string | null }[];
  precios?: { precio_id: number; precio_venta: string; tipo_cliente?: string | null }[];
  categoria?: string;
  activo: "activo" | "inactivo" | "pendiente";
}

interface ProductTableProps {
  productos: Producto[];
  onVerAuditoria?: (detalle_producto_id: number) => void;
  onVerUbicacion?: (detalle_producto_id: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  productos,
  onVerAuditoria,
  onVerUbicacion,
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [orderBy, setOrderBy] = useState<keyof Producto | "precio">("nombre_calculado");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const toggleSelection = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelected([]);

  const selectedItems = productos.filter((p) => selected.includes(p.id));

  const renderEstado = (activo: Producto["activo"]) => {
    const map = {
      activo: "bg-green-100 text-green-800",
      inactivo: "bg-red-100 text-red-800",
      pendiente: "bg-gray-200 text-gray-600",
    };
    return <Badge className={map[activo]}>{activo}</Badge>;
  };

  const handleSort = (campo: keyof Producto | "precio") => {
    if (orderBy === campo) {
      setOrderDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(campo);
      setOrderDir("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = productos.filter((p) => {
      const term = search.toLowerCase();
      const matchesSearch =
        p.nombre_calculado.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.alias?.some((a) => a.alias?.toLowerCase().includes(term)) ||
        p.precios?.some(
          (pr) =>
            typeof pr.tipo_cliente === "string" &&
            pr.tipo_cliente.toLowerCase().includes(term)
        );

      const matchesEstado = estadoFiltro === "todos" || p.activo === estadoFiltro;
      return matchesSearch && matchesEstado;
    });

    return filtered.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      if (orderBy === "precio") {
        aValue = Number(a.precios?.[0]?.precio_venta ?? 0);
        bValue = Number(b.precios?.[0]?.precio_venta ?? 0);
      } else {
        aValue = String(a[orderBy] ?? "").toLowerCase();
        bValue = String(b[orderBy] ?? "").toLowerCase();
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return orderDir === "asc" ? aValue - bValue : bValue - aValue;
      }

      return orderDir === "asc"
        ? aValue.localeCompare(String(bValue))
        : String(bValue).localeCompare(aValue);
    });
  }, [productos, search, estadoFiltro, orderBy, orderDir]);

  const totalPages = Math.ceil(filteredAndSorted.length / rowsPerPage);
  const paginated = filteredAndSorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="relative space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Buscar por nombre, alias, SKU o tipo cliente..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        <select
          value={estadoFiltro}
          onChange={(e) => {
            setEstadoFiltro(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="todos">Todos</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-auto rounded-md border bg-white shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-2 w-6"><Checkbox /></th>
              {[
                { label: "Nombre", campo: "nombre_calculado" },
                { label: "Alias", campo: null },
                { label: "Precios", campo: "precio" },
                { label: "Estado", campo: "activo" },
                { label: "Acciones", campo: null },
              ].map(({ label, campo }) => (
                <th
                  key={label}
                  className={`p-2 ${campo ? "cursor-pointer select-none" : ""}`}
                  onClick={() => campo && handleSort(campo)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {campo === orderBy && (orderDir === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((producto) => (
              <tr key={producto.id} className="border-b hover:bg-muted/50">
                <td className="p-2">
                  <Checkbox
                    checked={selected.includes(producto.id)}
                    onCheckedChange={() => toggleSelection(producto.id)}
                  />
                </td>
                <td className="p-2 font-medium">{producto.nombre_calculado}</td>
                <td className="p-2">
                  {producto.alias?.length ? (
                    <div className="flex flex-col gap-1">
                      {producto.alias.map((a, i) => (
                        <span key={i} className="text-xs text-muted-foreground">
                          {a.alias || "—"}
                          {a.tipo ? ` (${a.tipo})` : ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-2">
                  {producto.precios?.length ? (
                    <div className="flex flex-col gap-1">
                      {producto.precios.map((p, i) => (
                        <span key={i} className="text-xs text-muted-foreground">
                          ${Number(p.precio_venta).toFixed(2)}
                          {p.tipo_cliente ? ` (${p.tipo_cliente})` : ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-2">{renderEstado(producto.activo)}</td>
                <td className="p-2 flex gap-1 flex-wrap">
                  <Button size="icon" variant="ghost" onClick={() => onVerAuditoria?.(producto.id)}><ScrollText className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => onVerUbicacion?.(producto.id)}><MapPinIcon className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost"><Eye className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost"><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost"><QrCode className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost"><LockKeyhole className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center text-sm mt-2">
        <div className="text-muted-foreground">
          Página {currentPage} de {totalPages} — {filteredAndSorted.length} resultado(s)
        </div>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};



// "use client";

// import { useState } from "react";
// import {
//   Eye,
//   Edit,
//   Trash2,
//   MoreHorizontal,
//   FileDown,
//   CheckCircle2,
//   X,
//   QrCode,
//   LockKeyhole,
//   ScrollText,
// } from "lucide-react";

// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { exportToCSV } from "@/app/utils/exportToCsv";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem
// } from "@/components/ui/dropdown-menu";

// import {
//   activarProductos,
//   eliminarProductos,
//   transferirProductos
// } from "@/lib/fetchers/productos";

// interface Producto {
//   id: number;
//   nombre_calculado: string;
//   sku: string;
//   stock: number;
//   precio: number;
//   categoria?: string;
//   estado: "activo" | "inactivo" | "pendiente";
// }

// interface ProductTableProps {
//   productos: Producto[];
//   onVerAuditoria?: (detalle_producto_id: number) => void; // 👈 se vuelve opcional
// }

// export const ProductTable: React.FC<ProductTableProps> = ({ productos, onVerAuditoria }) => {
//   const [selected, setSelected] = useState<number[]>([]);

//   const toggleSelection = (id: number) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
//     );
//   };

//   const clearSelection = () => setSelected([]);

//   const selectedItems = productos.filter(p => selected.includes(p.id));

//   const renderEstado = (estado: Producto["estado"]) => {
//     const map = {
//       activo: "bg-green-100 text-green-800",
//       inactivo: "bg-red-100 text-red-800",
//       pendiente: "bg-gray-200 text-gray-600",
//     };
//     return <Badge className={map[estado]}>{estado}</Badge>;
//   };

//   return (
//     <div className="relative">

//       {/* 🔒 Barra de acciones masivas */}
//       {selected.length > 0 && (
//         <div className="sticky top-0 z-50 bg-white border-b p-3 flex justify-between items-center shadow">
//           <span className="text-sm text-muted-foreground">
//             {selected.length} producto(s) seleccionados
//           </span>
//           <div className="flex gap-2 flex-wrap items-center">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => exportToCSV(selectedItems, "productos-seleccionados.csv")}
//             >
//               <FileDown className="w-4 h-4 mr-1" /> Exportar
//             </Button>

//             <Button
//               variant="secondary"
//               size="sm"
//               onClick={async () => {
//                 try {
//                   await activarProductos(selected);
//                   alert("Productos activados");
//                   clearSelection();
//                 } catch (e) {
//                   console.error(e);
//                   alert("Error al activar");
//                 }
//               }}
//             >
//               <CheckCircle2 className="w-4 h-4 mr-1" /> Activar
//             </Button>

//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={async () => {
//                 if (!confirm("¿Seguro que deseas eliminar los productos seleccionados?")) return;
//                 try {
//                   await eliminarProductos(selected);
//                   alert("Productos eliminados");
//                   clearSelection();
//                 } catch (e) {
//                   console.error(e);
//                   alert("Error al eliminar");
//                 }
//               }}
//             >
//               <Trash2 className="w-4 h-4 mr-1" /> Eliminar
//             </Button>

//             {/* 🧩 Menú contextual masivo */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button size="sm" variant="outline">
//                   Más acciones <MoreHorizontal className="w-4 h-4 ml-1" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => alert("Historial no implementado")}>
//                   View History
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => alert("Gestión de stock no implementada")}>
//                   Manage Stock
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => alert("Transferencia masiva no implementada")}>
//                   Transfer
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => alert("No disponible todavía")}>
//                   Unpublish
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => alert("Sin algoritmo aún")}>
//                   Best Price Setting
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => alert("Función en desarrollo")}>
//                   Analyze
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <Button size="sm" variant="ghost" onClick={clearSelection}>
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* 📦 Tabla de productos */}
//       <div className="overflow-auto rounded-md border bg-white shadow">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-muted/40">
//             <tr>
//               <th className="p-2 w-6"><Checkbox /></th>
//               <th className="p-2">Nombre</th>
//               <th className="p-2">SKU</th>
//               <th className="p-2">Precio</th>
//               <th className="p-2">Estado</th>
//               <th className="p-2">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {productos.map((producto) => (
//               <tr key={producto.id} className="border-b hover:bg-muted/50">
//                 <td className="p-2">
//                   <Checkbox
//                     checked={selected.includes(producto.id)}
//                     onCheckedChange={() => toggleSelection(producto.id)}
//                   />
//                 </td>
//                 <td className="p-2 font-medium">{producto.nombre_calculado}</td>
//                 <td className="p-2">{producto.sku}</td>
//                 <td className="p-2">${Number(producto.precio).toFixed(2)}</td>
//                 <td className="p-2">{renderEstado(producto.estado)}</td>
//                 <td className="p-2 flex gap-1 flex-wrap">
//                   {/* 👁 Ver historial */}
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     title="Ver historial de movimientos"
//                     onClick={() => onVerAuditoria?.(producto.id)}
//                   >
//                     <ScrollText className="w-4 h-4" />
//                   </Button>

//                   <Button size="icon" variant="ghost" title="Ver">
//                     <Eye className="w-4 h-4" />
//                   </Button>
//                   <Button size="icon" variant="ghost" title="Editar">
//                     <Edit className="w-4 h-4" />
//                   </Button>
//                   <Button size="icon" variant="ghost" title="QR">
//                     <QrCode className="w-4 h-4" />
//                   </Button>
//                   <Button size="icon" variant="ghost" title="Bloquear">
//                     <LockKeyhole className="w-4 h-4" />
//                   </Button>

//                   {/* Menú por producto */}
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button size="icon" variant="ghost">
//                         <MoreHorizontal className="w-4 h-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                       <DropdownMenuItem onClick={() => onVerAuditoria?.(producto.id)}>
//                         Ver Auditoría
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>Editar</DropdownMenuItem>
//                       <DropdownMenuItem>Transferir</DropdownMenuItem>
//                       <DropdownMenuItem>Eliminar</DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
