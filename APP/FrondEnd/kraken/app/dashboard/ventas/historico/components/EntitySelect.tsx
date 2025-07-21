// app/dashboard/ventas/historico/components/EntitySelect.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface RawEntity {
  id: number;
  nombre_usuario: string;
}

interface Entity {
  id: number;
  label: string; // ya con nombre + apellido
}

// Un cache simple por URL
const cache: Record<string, Entity[]> = {};

interface Props {
  label: string;
  apiUrl: string;
  value: number | "";              // id seleccionado
  onChange: (id: number) => void;
  placeholder?: string;
}

export default function EntitySelect({
  label,
  apiUrl,
  value,
  onChange,
  placeholder = "",
}: Props) {
  const [options, setOptions] = useState<Entity[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Carga (y cachea) la lista **solo una vez** por apiUrl
  useEffect(() => {
    if (cache[apiUrl]) {
      setOptions(cache[apiUrl]);
      return;
    }
    fetch(apiUrl)
      .then((r) => r.json())
      .then((j) => {
        const raws: RawEntity[] = Array.isArray(j.data) ? j.data : [];
        const ent: Entity[] = raws.map((e) => ({
          id: e.id,
          label: e.nombre_usuario,
        }));
        cache[apiUrl] = ent;
        setOptions(ent);
      })
      .catch(console.error);
  }, [apiUrl]);

  // cerrar dropdown al clicar fuera
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const selected = options.find((o) => o.id === value);

  const filtered = options.filter((o) =>
    (`${o.id} ${o.label}`)
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type="text"
        readOnly={!open}
        value={open ? filter : selected?.label ?? ""}
        placeholder={selected ? "" : placeholder}
        onFocus={() => {
          setOpen(true);
          setFilter("");
        }}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
      />
      {open && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded border bg-white shadow-lg">
          {filtered.map((o) => (
            <li
              key={o.id}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
            >
              <span className="font-semibold">{o.id}</span> – {o.label}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-gray-500">Sin resultados</li>
          )}
        </ul>
      )}
    </div>
  );
}
