"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormaPago from "@/components/FormaPago";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  total: number;
  pagos: { metodo: string; monto: number }[];
  setPagos: (pagos: { metodo: string; monto: number }[]) => void;
  handleCobrar: () => void;
  disabled?: boolean;
}

export default function ModalCobro({
  open, setOpen, total, pagos, setPagos, handleCobrar, disabled
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={disabled}>Cobrar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Formas de pago</DialogTitle>
        </DialogHeader>
        <FormaPago total={total} pagos={pagos} setPagos={setPagos} onCobrar={handleCobrar} />
      </DialogContent>
    </Dialog>
  );
}
