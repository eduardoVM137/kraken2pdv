"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, BarChart2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface CorteCaja {
  idcorte_caja: number;
  idempleado_usuario: number;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  total_ventas: number;
  total_retiros: number;
  total_entregado: number;
}

interface DetallesCorte {
  numCortes: number;
  numArqueos: number;
  numRetiros: number;
}

const CorteCajaHistorico: React.FC = () => {
  const [cortes, setCortes] = useState<CorteCaja[]>([]);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<CorteCaja | null>(null);
  const [detalles, setDetalles] = useState<DetallesCorte | null>(null);

  useEffect(() => {
    fetchData();
  }, [from, to]);

  const fetchData = async () => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const res = await fetch(`/api/corte-caja?${params.toString()}`);
    const data: CorteCaja[] = await res.json();
    setCortes(data);
  };

  const openDetalles = async (corte: CorteCaja) => {
    setSelected(corte);
    const res = await fetch(`/api/corte-caja/${corte.idcorte_caja}/detalles`);
    const det: DetallesCorte = await res.json();
    setDetalles(det);
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Histórico de Corte de Caja</h2>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <Label>Desde</Label>
          <Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-36" />
        </div>
        <div>
          <Label>Hasta</Label>
          <Input type="date" value={to} onChange={e => setTo(e.target.value)} className="w-36" />
        </div>
        <Button onClick={fetchData}>Aplicar</Button>
      </div>

      <div className="overflow-auto rounded-md border bg-white shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Empleado</th>
              <th className="p-2">Inicio</th>
              <th className="p-2">Fin</th>
              <th className="p-2">Ventas</th>
              <th className="p-2">Retiros</th>
              <th className="p-2">Entregado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cortes.map(c => (
              <tr key={c.idcorte_caja} className="border-b hover:bg-muted/50">
                <td className="p-2">{c.idcorte_caja}</td>
                <td className="p-2">{c.idempleado_usuario}</td>
                <td className="p-2">{new Date(c.fecha_hora_inicio).toLocaleString()}</td>
                <td className="p-2">{new Date(c.fecha_hora_fin).toLocaleString()}</td>
                <td className="p-2">${c.total_ventas.toFixed(2)}</td>
                <td className="p-2">${c.total_retiros.toFixed(2)}</td>
                <td className="p-2 font-semibold">${c.total_entregado.toFixed(2)}</td>
                <td className="p-2 flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openDetalles(c)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDetalles(c)}>
                    <BarChart2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles Corte #{selected?.idcorte_caja}</DialogTitle>
            <DialogDescription>Conteos de cortes, arqueos y retiros</DialogDescription>
          </DialogHeader>
          <Separator className="my-4" />
          {detalles ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Cortes realizados:</span><span>{detalles.numCortes}</span></div>
              <div className="flex justify-between"><span>Arqueos efectivos:</span><span>{detalles.numArqueos}</span></div>
              <div className="flex justify-between"><span>Retiros totales:</span><span>{detalles.numRetiros}</span></div>
            </div>
          ) : (
            <div>Cargando...</div>
          )}
          <DialogClose asChild>
            <Button className="mt-6 w-full">Cerrar</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CorteCajaHistorico;
