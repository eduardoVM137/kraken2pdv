"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  User2,
  Hash,
  Calendar,
  Info,
} from "lucide-react";

/* ------------- ayuda UI ------------- */
const Field = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactElement;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className="text-xs">{label}</Label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      {children}
    </div>
  </div>
);

/* ------------- componente principal ------------- */
export const SeccionPrecios = ({
  precio,
  idVirtual,
  precios,
  setValue,
}: {
  precio: any;
  idVirtual: string;
  precios: any[];
  setValue: any;
}) => {
  /* envía al store de RHF */
  const commit = (field: string, val: any) =>
    setValue(
      "precios",
      precios.map((p: any) =>
        p.idVirtual === idVirtual ? { ...p, [field]: val } : p
      )
    );

  /* helper blur de número */
  const blurNum =
    (field: string) => (e: React.FocusEvent<HTMLInputElement>) =>
      commit(
        field,
        e.target.value === "" ? undefined : Number(e.target.value)
      );

  return (
    <div className="space-y-4 text-sm">
      <Badge
        variant="outline"
        className="bg-emerald-50 text-emerald-700 border-emerald-300 flex items-center gap-1 px-2 py-1"
      >
        <DollarSign className="h-4 w-4" /> Precio
      </Badge>

      {/* ------- básicos ------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Precio venta" icon={<DollarSign className="h-4 w-4" />}>
          <Input
            type="text"
            inputMode="decimal"
            className="pl-10"
            defaultValue={precio?.precio_venta ?? ""}
            onBlur={blurNum("precio_venta")}
          />
        </Field>

        <Field label="Tipo cliente ID" icon={<User2 className="h-4 w-4" />}>
          <Input
            type="text"
            inputMode="numeric"
            className="pl-10"
            defaultValue={precio?.tipo_cliente_id ?? ""}
            onBlur={blurNum("tipo_cliente_id")}
          />
        </Field>
      </div>

      {/* ------- opcionales ------- */}
      <Accordion type="single" collapsible>
        <AccordionItem value="adv">
          <AccordionTrigger className="text-xs hover:no-underline">
            Más parámetros
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cliente ID como select 1-5 */}
              <Field label="Cliente ID" icon={<Hash className="h-4 w-4" />}>
                <Select
                  defaultValue={
                    precio?.cliente_id !== undefined
                      ? String(precio.cliente_id)
                      : "none"
                  }
                  onValueChange={(v) =>
                    commit(
                      "cliente_id",
                      v === "none" ? undefined : Number(v)
                    )
                  }
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="Cantidad mínima"
                icon={<Hash className="h-4 w-4" />}
              >
                <Input
                  type="text"
                  inputMode="decimal"
                  className="pl-10"
                  defaultValue={precio?.cantidad_minima ?? ""}
                  onBlur={blurNum("cantidad_minima")}
                />
              </Field>

              <Field
                label="Precio base"
                icon={<DollarSign className="h-4 w-4" />}
              >
                <Input
                  type="text"
                  inputMode="decimal"
                  className="pl-10"
                  defaultValue={precio?.precio_base ?? ""}
                  onBlur={blurNum("precio_base")}
                />
              </Field>

              <Field label="Prioridad" icon={<Hash className="h-4 w-4" />}>
                <Select
                  defaultValue={
                    precio?.prioridad !== undefined
                      ? String(precio.prioridad)
                      : "none"
                  }
                  onValueChange={(v) =>
                    commit(
                      "prioridad",
                      v === "none" ? undefined : Number(v)
                    )
                  }
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="Fecha inicio"
                icon={<Calendar className="h-4 w-4" />}
              >
                <Input
                  type="date"
                  className="pl-10"
                  defaultValue={precio?.fecha_inicio ?? ""}
                  onBlur={(e) =>
                    commit(
                      "fecha_inicio",
                      e.target.value === "" ? undefined : e.target.value
                    )
                  }
                />
              </Field>

              <Field
                label="Fecha fin"
                icon={<Calendar className="h-4 w-4" />}
              >
                <Input
                  type="date"
                  className="pl-10"
                  defaultValue={precio?.fecha_fin ?? ""}
                  onBlur={(e) =>
                    commit(
                      "fecha_fin",
                      e.target.value === "" ? undefined : e.target.value
                    )
                  }
                />
              </Field>
            </div>

            <Field label="Descripción" icon={<Info className="h-4 w-4" />}>
              <Input
                className="pl-10"
                defaultValue={precio?.descripcion ?? ""}
                onBlur={(e) => commit("descripcion", e.target.value)}
              />
            </Field>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center gap-2 pt-2">
        <Switch
          checked={precio?.vigente ?? true}
          onCheckedChange={(v) => commit("vigente", v)}
        />
        <Label>¿Vigente?</Label>
      </div>
    </div>
  );
};

