// app/dashboard/compras/historico/page.tsx
"use client";

import { useState, useEffect, useMemo, ChangeEvent } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Compra {
  id: number;
  usuario_id: number | null;
  fecha: string;
  total: number;
  proveedor_id: number | null;
  state_id: string | null;
  metodo_pago: string | null;
  comprobante: string | null;
  iva: number;
  pagado: boolean;
  usuario?: string;
  proveedor?: string;
  estado?: string;
}

export default function HistoricoComprasPage() {
  const [compras, setCompras] = useState<Compra[] | null>(null);
  const [fProv,  setFProv]    = useState("");
  const [fEst,   setFEst]     = useState("todos");
  const [fFecha, setFFecha]   = useState("");

  useEffect(() => {
    console.log("» Lanzando fetch de ingresos…");
    fetch("http://localhost:3001/api/ingreso")
      .then(res => {
        console.log("» Estado HTTP:", res.status);
        return res.json();
      })
      .then(json => {
        console.log("» JSON bruto recibido:", json);
        const raw = Array.isArray(json) ? json : json.data;
        console.log("» Array raw:", raw);
        const lista = raw.map((c: any) => ({
          ...c,
          total: parseFloat(c.total),
          iva:   parseFloat(c.iva),
        }));
        console.log("» Array parseado:", lista);
        setCompras(lista);
      })
      .catch(err => {
        console.error("¡Error en fetch!", err);
        setCompras([]);
      });
  }, []);

  const comprasFiltradas = useMemo(() => {
    if (!Array.isArray(compras)) return [];
    return compras.filter(c => {
      const okProv  = fProv === "" 
        || (c.proveedor ?? "")
             .toString()
             .toLowerCase()
             .includes(fProv.toLowerCase())
        || String(c.proveedor_id).includes(fProv);

      const okEst   = fEst === "todos" 
        || (c.estado ?? c.state_id ?? "")
             .toLowerCase() 
             === fEst;

      const okFecha = fFecha === "" 
        || c.fecha.startsWith(fFecha);

      return okProv && okEst && okFecha;
    });
  }, [compras, fProv, fEst, fFecha]);

  if (compras === null) {
    return (
      <main className="p-8 text-center">
        <p>Cargando histórico de compras…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Histórico de Compras</h1>
        <Link href="/dashboard/compras">
          <Button variant="outline">← Volver a Compras</Button>
        </Link>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <Label>Proveedor</Label>
          <Input
            value={fProv}
            placeholder="Nombre o ID"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFProv(e.target.value)}
          />
        </div>

        <div>
          <Label>Estado</Label>
          <Select value={fEst} onValueChange={setFEst}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Fecha</Label>
          <Input
            type="date"
            value={fFecha}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFFecha(e.target.value)}
          />
        </div>
      </section>

      <Table>
        <TableHeader>
          <TableRow>
            {["ID","Fecha","Usuario","Total","Proveedor","Método","Comprobante","IVA","Pagado","Estado"].map(h => (
              <TableCell key={h} className="font-semibold">{h}</TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {comprasFiltradas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="py-6 text-center text-muted-foreground">
                No hay compras que coincidan con esos filtros
              </TableCell>
            </TableRow>
          ) : comprasFiltradas.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{new Date(c.fecha).toLocaleDateString()}</TableCell>
              <TableCell>{c.usuario ?? c.usuario_id}</TableCell>
              <TableCell>{c.total.toFixed(2)}</TableCell>
              <TableCell>{c.proveedor ?? c.proveedor_id}</TableCell>
              <TableCell>{c.metodo_pago}</TableCell>
              <TableCell>{c.comprobante}</TableCell>
              <TableCell>{c.iva.toFixed(2)}%</TableCell>
              <TableCell>{c.pagado ? "Sí" : "No"}</TableCell>
              <TableCell>{c.estado ?? c.state_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
