import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormaPagoProps {
  total: number;
  pagos: { metodo: string; monto: number }[];
  setPagos: (pagos: { metodo: string; monto: number }[]) => void;
  onCobrar: () => void;
  onImprimir?: () => void;
}

export default function FormaPago({ total, pagos, setPagos, onCobrar, onImprimir }: FormaPagoProps) {
  const [nuevoMetodo, setNuevoMetodo] = useState("Efectivo");
  const [nuevoMonto, setNuevoMonto] = useState(0);

  const totalPagado = pagos.reduce((sum, pago) => sum + pago.monto, 0);
  const restante = total - totalPagado;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Formas de pago</h3>

      <div className="flex gap-2 mb-4">
        <select
          className="border rounded px-3 py-2"
          value={nuevoMetodo}
          onChange={(e) => setNuevoMetodo(e.target.value)}
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Vales">Vales</option>
        </select>

        <Input
          type="number"
          placeholder="Monto"
          value={nuevoMonto}
          onChange={(e) => setNuevoMonto(parseFloat(e.target.value))}
          className="w-32"
        />

        <Button
          onClick={() => {
            if (!isNaN(nuevoMonto) && nuevoMonto > 0) {
              setPagos([...pagos, { metodo: nuevoMetodo, monto: nuevoMonto }]);
              setNuevoMonto(0);
            }
          }}
        >
          Agregar
        </Button>
      </div>

      {pagos.length > 0 && (
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b">
              <th>Método</th>
              <th>Monto</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p, i) => (
              <tr key={i} className="border-b">
                <td>{p.metodo}</td>
                <td>${p.monto.toFixed(2)}</td>
                <td>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPagos(pagos.filter((_, idx) => idx !== i))}
                  >
                    Quitar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between mb-2 text-sm">
        <span>Total pagado:</span>
        <span>${totalPagado.toFixed(2)}</span>
      </div>

      <div
        className={`flex justify-between mb-4 font-bold ${
          restante > 0 ? "text-red-600" : "text-green-600"
        }`}
      >
        <span>Restante:</span>
        <span>${restante.toFixed(2)}</span>
      </div>

      <Button className="w-full" disabled={restante > 0} onClick={onCobrar}>
        Cobrar
      </Button>

      {onImprimir && (
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={onImprimir}
        >
          Imprimir Ticket
        </Button>
      )}
    </div>
  );
}
