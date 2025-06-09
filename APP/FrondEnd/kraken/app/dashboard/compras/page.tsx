/* ------------------------------------------------------------------
 *  app/dashboard/compras/page.tsx
 *  Refactor 2025-06-04 · UI responsiva + distribución de piezas
 * -----------------------------------------------------------------*/
 

"use client";

import {
  useState,
  useMemo,
  useCallback,
  ChangeEvent,
  useEffect,
} from "react";

import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import { Button }   from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Papa from "papaparse";
import PricePopover from "../compras/components/price-popover/PricePopover";   // ⬅️ pop-over modular

/* ╭──────────────────────────────────────────────────────────╮
   │                       TIPOS                              │
   ╰──────────────────────────────────────────────────────────╯ */
interface Producto {
  rowId: string;
  id: string;
  nombre: string;
  codigoBarras: string;
  precioAnterior: number;
  precioActual: number;
  iva: number;
  cantidad: number;
  presentacionId: number | null;
  cantidadPorPresentacion: number;
  presentacionNombre: string;
}
interface DetalleExtendido {
  precios: {
    precio_id: number;
    precio_venta: number;
    precio_costo: number;
    ubicacion_nombre: string;
    producto_ubicacion_id: number;   
  }[];
  inventarios: {
    ubicacion_nombre: string;
    stock_actual: number;
    precio_costo: number;
  }[];
}
interface Presentacion { id:number; nombre:string; cantidad:number }
interface FilaImportada { codigo:string; cantidad?:number; precio?:number; iva?:number }
interface CambioPendiente { rowId:string; precio_id:number; nuevoVenta:number }

/* ╭──────────────────────────────────────────────────────────╮
   │                ENDPOINTS  auxiliares                     │
   ╰──────────────────────────────────────────────────────────╯ */
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const j = (r: Response) => (r.ok ? r.json() : Promise.reject(r));
const api = {
  buscarPorCodigo:     (c:string) => fetch(`${API}/api/detalle-producto/buscar-general/${c}`).then(j),
  presentaciones:      (id:string)=> fetch(`${API}/api/presentacion/detalle/${id}`).then(j),
  presentacionById:    (id:number)=> fetch(`${API}/api/presentacion/${id}`).then(j),
  productoUbicacion:   (id:string)=> fetch(`${API}/api/producto-ubicacion/buscar-precio-inventario/${id}`).then(j),
};

/* ╭──────────────────────────────────────────────────────────╮
   │                     PÁGINA                               │
   ╰──────────────────────────────────────────────────────────╯ */
export default function ComprasPage () {
  /* ───── estado base ───── */
  const [factura, setFactura]       = useState("001");
  const [proveedor, setProveedor]   = useState("Proveedor General");
  const [codigo, setCodigo]         = useState("");
  const [filtro, setFiltro]         = useState("");

  const [productos, setProductos]   = useState<Producto[]>([]);
  const [detalles, setDetalles]     = useState<Record<string,DetalleExtendido>>({});
  const [presentaciones, setPres]   = useState<Record<string,Presentacion[]>>({});

  const [preciosEditados, setPreciosEditados] = useState<Record<number,number>>({});
  const [distrib, setDistrib] = useState<Record<string,Record<number,number>>>({});

  const [mostrarUnit, setMostrarUnit] = useState(false);

  /* ───── filtros / totales ───── */
  const productosFiltrados = useMemo(()=>{
    const f = filtro.toLowerCase();
    return filtro
      ? productos.filter(p=>p.nombre.toLowerCase().includes(f)||p.codigoBarras.includes(f))
      : productos;
  },[productos,filtro]);

  const { subtotal, impuesto } = useMemo(()=>{
    return productosFiltrados.reduce((acc,p)=>{
      const piezas = p.cantidad * p.cantidadPorPresentacion;
      const base   = p.precioActual * piezas;
      acc.subtotal += base;
      acc.impuesto += base * (p.iva/100);
      return acc;
    },{subtotal:0,impuesto:0});
  },[productosFiltrados]);

  /* ╭──────────────────────────────────────────────╮
     │           MUTACIONES helpers                 │
     ╰──────────────────────────────────────────────╯ */
  const setProdField = (rowId:string, patch:Partial<Producto>) =>
    setProductos(prev=>prev.map(p=>p.rowId===rowId?{...p,...patch}:p));
  const borrarProd   = (rowId:string) =>
    setProductos(prev=>prev.filter(p=>p.rowId!==rowId));

  /* ╭──────────────────────────────────────────────╮
     │        ALTA producto por código / CSV        │
     ╰──────────────────────────────────────────────╯ */
  type AddStatus="added"|"incremented"|"not_found";

  const agregarPorCodigo = useCallback(async (codeRaw:string,fila?:Partial<FilaImportada>):Promise<AddStatus>=>{
    const code = codeRaw.trim(); if(!code) return "not_found";
    let data:any; try{ data = await api.buscarPorCodigo(code);}catch{return "not_found";}
    if(!data?.detalle_producto_id) return "not_found";

    const rowKey = String(data.detalle_producto_id);
    let status:AddStatus = "added";

    setProductos(prev=>{
      const idx = prev.findIndex(p=>p.rowId===rowKey);
      if(idx!==-1){
        status="incremented";
        const extra = fila?.cantidad??1;
        const next  = [...prev];
        next[idx]   = {...next[idx],cantidad:next[idx].cantidad+extra};
        return next;
      }
      const nuevo:Producto={
        rowId:rowKey,
        id:data.detalle_producto_id,
        nombre:data.nombre,
        codigoBarras:data.codigo_barras,
        precioAnterior:+data.precio_anterior||0,
        precioActual:  fila?.precio??(+data.precio_actual||0),
        iva:           fila?.iva??(+data.iva||0),
        cantidad:      fila?.cantidad??1,
        presentacionId:data.presentacion_id??null,
        cantidadPorPresentacion:+data.cantidad_presentacion||1,
        presentacionNombre:data.presentacion_nombre||"Sin presentación",
      };
      return [...prev,nuevo];
    });
    return status;
  },[]);

  const handleFileImport = async (e:ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0]; if(!f) return;
    const filas = await new Promise<FilaImportada[]>((res,rej)=>{
      Papa.parse<FilaImportada>(f,{header:true,skipEmptyLines:true,
        complete:({data})=>res(data),error:rej});
    });
    let added=0,inc=0,nf=0;
    for(const fila of filas){
      const st=await agregarPorCodigo(fila.codigo,fila);
      if(st==="added") added++; else if(st==="incremented") inc++; else nf++;
    }
    alert(`Importación\nNuevos:${added}\nIncrementados:${inc}\nNo encontrados:${nf}`);
    e.target.value="";
  };

  /* ╭──────────────────────────────────────────────╮
     │   CARGA detalles (precios + inventarios)     │
     ╰──────────────────────────────────────────────╯ */
  const cargarDetalles = useCallback(async(lista:Producto[])=>{
    const map:Record<string,DetalleExtendido>={};
    await Promise.all(lista.map(async p=>{
      try{
        const {data}=await api.productoUbicacion(p.id);
        map[p.rowId]={
          inventarios:data.map((i:any)=>({
            ubicacion_nombre:i.ubicacion_nombre,
            stock_actual:+i.stock_actual,
            precio_costo:+i.precio_costo,
          })),
          precios:data.map((i:any)=>({
            precio_id: i.precio_id,
            precio_venta:+i.precio_venta,
            precio_costo:+i.precio_costo,
            ubicacion_nombre:i.ubicacion_nombre,
            producto_ubicacion_id:i.producto_ubicacion_id, 
          })),
        };
      }catch(e){console.error(e);}
    }));
    setDetalles(map);
  },[]);

  useEffect(()=>{
    if(productos.length) cargarDetalles(productos);
  },[productos,cargarDetalles]);

  /* ╭──────────────────────────────────────────────╮
     │         CAMBIOS de precio enviados           │
     ╰──────────────────────────────────────────────╯ */
  const cambiosPrecio: CambioPendiente[] = useMemo(()=>{
    const arr: CambioPendiente[]=[];
    Object.entries(preciosEditados).forEach(([idStr,nuevoVenta])=>{
      const precio_id=+idStr;
      const prod = productos.find(p=>detalles[p.rowId]?.precios.some(pr=>pr.precio_id===precio_id));
      if(prod) arr.push({rowId:prod.rowId,precio_id,nuevoVenta});
    });
    return arr;
  },[preciosEditados,productos,detalles]);

  /* ╭──────────────────────────────────────────────╮
     │                  RENDER                      │
     ╰──────────────────────────────────────────────╯ */
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Panel de Compras</h1>

      {/* ——— cabecera ——— */}
      <section className="grid gap-4 sm:grid-cols-3">
        <InputWithLabel label="Factura" value={factura} setValue={setFactura} />
        <ProveedorSelect value={proveedor} onChange={setProveedor} />
        <CodigoInput
          codigo={codigo}
          setCodigo={setCodigo}
          onAdd={async()=>{
            const st = await agregarPorCodigo(codigo);
            if(st==="not_found") alert("No encontrado");
            setCodigo("");
          }}
        />
      </section>

      {/* ——— barra herram. ——— */}
      <Toolbar
        filtro={filtro}
        setFiltro={setFiltro}
        onCSV={handleFileImport}
        mostrarUnit={mostrarUnit}
        toggleUnit={()=>setMostrarUnit(!mostrarUnit)}
      />

      {/* ——— tabla principal ——— */}
      <TablaCompras
        productos={productosFiltrados}
        detalles={detalles}
        mostrarUnit={mostrarUnit}
        preciosEditados={preciosEditados}
        setPreciosEditados={setPreciosEditados}
        distrib={distrib}
        setDistrib={setDistrib}
        presentaciones={presentaciones}
        setPresentaciones={setPres}
        setProdField={setProdField}
        borrarProd={borrarProd}
      />

      {/* ——— totales + enviar ——— */}
      <Totales
        subtotal={subtotal}
        impuesto={impuesto}
        onSubmit={async()=>{
          /* verifica distribución correcta */
          const pendiente = productos.some(p=>{
            const tot = p.cantidad*p.cantidadPorPresentacion;
            const asign = Object.values(distrib[p.rowId]??{}).reduce((a,b)=>a+b,0);
            return tot!==asign;
          });
          if(pendiente){alert("Faltan piezas por asignar");return;}

          // …llamadas a backend (guardarCompra + actualizar-lote)…
          alert("Compra registrada");
        }}
      />
    </main>
  );
}

/* ╭──────────────────────────────────────────────────────────╮
   │                SUB-COMPONENTES UI                        │
   ╰──────────────────────────────────────────────────────────╯ */

/* ——— etiqueta + input genérico ——— */
const InputWithLabel = ({label,value,setValue}:{label:string;value:string;setValue:(v:string)=>void})=>(
  <div><Label>{label}</Label><Input value={value} onChange={e=>setValue(e.target.value)}/></div>
);

/* ——— selector de proveedor ——— */
const ProveedorSelect = ({value,onChange}:{value:string;onChange:(v:string)=>void})=>(
  <div>
    <Label>Proveedor</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        {["Proveedor General","Proveedor Alterno"].map(opt=>(
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

/* ——— input código + botón ——— */
const CodigoInput = ({codigo,setCodigo,onAdd}:{codigo:string;setCodigo:(s:string)=>void;onAdd:()=>void})=>(
  <div>
    <Label>Código</Label>
    <div className="flex gap-2 mt-1">
      <Input
        value={codigo}
        placeholder="Escanea o escribe código"
        onChange={e=>setCodigo(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&onAdd()}
      />
      <Button onClick={onAdd}>Agregar</Button>
    </div>
  </div>
);

/* ——— barra superior (filtro + CSV + toggle unit.) ——— */
function Toolbar({filtro,setFiltro,onCSV,mostrarUnit,toggleUnit}:{filtro:string;setFiltro:(s:string)=>void;onCSV:(e:ChangeEvent<HTMLInputElement>)=>void;mostrarUnit:boolean;toggleUnit:()=>void}){
  return(
    <section className="flex flex-col sm:flex-row sm:justify-between gap-4">
      <Input value={filtro} onChange={e=>setFiltro(e.target.value)} className="max-w-xs" placeholder="Filtrar por nombre o código"/>
      <div className="flex items-center gap-2">
        <input id="csv" type="file" accept=".csv" className="hidden" onChange={onCSV}/>
        <Button asChild variant="secondary"><label htmlFor="csv" className="cursor-pointer">Importar CSV</label></Button>
        <Button variant="outline" onClick={toggleUnit}>{mostrarUnit?"Ocultar detalles":"Ver detalles"}</Button>
      </div>
    </section>
  );
}

/* ——— tabla principal ——— */
function TablaCompras(props:{
  productos:Producto[];
  detalles:Record<string,DetalleExtendido>;
  mostrarUnit:boolean;
  preciosEditados:Record<number,number>;
  setPreciosEditados:React.Dispatch<React.SetStateAction<Record<number,number>>>;
  distrib:Record<string,Record<number,number>>;
  setDistrib:React.Dispatch<React.SetStateAction<Record<string,Record<number,number>>>>;
  presentaciones:Record<string,Presentacion[]>;
  setPresentaciones:React.Dispatch<React.SetStateAction<Record<string,Presentacion[]>>>;
  setProdField:(id:string,p:Partial<Producto>)=>void;
  borrarProd:(id:string)=>void;
}){
  const {
    productos,detalles,mostrarUnit,
    preciosEditados,setPreciosEditados,
    distrib,setDistrib,
    presentaciones,setPresentaciones,
    setProdField,borrarProd,
  } = props;

  /* helper de select presentación */
  const labelPres = (p:Producto)=>{
    const list=presentaciones[p.id];
    if(!list||p.presentacionId==null)
      return `${p.presentacionNombre} — ${p.cantidadPorPresentacion} pz`;
    const m=list.find(x=>x.id===p.presentacionId);
    return m?`${m.nombre} — ${m.cantidad} pz`:`ID ${p.presentacionId}`;
  };

  return(
    <Table>
      <TableHeader>
        <TableRow>
          {["Producto","Cod. Barras","$ Ant.","$ Actual", ...(mostrarUnit?["$ Unit."]:[]),
            "IVA %","Cant.","Presentación","Detalles","Acciones"].map(h=>(
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {productos.length===0?(
          <TableRow><TableCell colSpan={mostrarUnit?10:9} className="py-6 text-center text-muted-foreground">Sin productos</TableCell></TableRow>
        ):productos.map(p=>{
          const piezasTot = p.cantidad*p.cantidadPorPresentacion;
          const det = detalles[p.rowId];
          const priceList = det?.precios??[];

          return(
            <TableRow key={p.rowId} className="align-top">
              <TableCell>{p.nombre}</TableCell>
              <TableCell>{p.codigoBarras}</TableCell>
              <TableCell>S/ {p.precioAnterior.toFixed(2)}</TableCell>

              {/* precio + popover */}
              <TableCell className="space-y-1 relative z-[0]">
                <Input
                  value={p.precioActual}
                  type="number"
                  className="w-24"
                  onChange={e => setProdField(p.rowId, { precioActual: +e.target.value || 0 })}
                />
                <div className="relative z-[30]">
                  <PricePopover
                    rowId={p.rowId}
                    priceList={priceList}
                    piezasTot={piezasTot}
                    costoUnitNuevo={(p.precioActual / piezasTot) * (1 + p.iva / 100)}
                    preciosEditados={preciosEditados}
                    setPreciosEditados={setPreciosEditados}
                    distrib={distrib}
                    setDistrib={setDistrib}
                  />
                </div>
              </TableCell>


              {mostrarUnit&&(
                <TableCell>
                  {`S/ ${((p.precioActual/p.cantidadPorPresentacion)*(1+p.iva/100)).toFixed(2)}`}
                </TableCell>
              )}

              <TableCell>
                <Input value={p.iva} type="number" min={0} max={100} className="w-20"
                  onChange={e=>setProdField(p.rowId,{iva:+e.target.value||0})}/>
              </TableCell>

              <TableCell>
                <Input value={p.cantidad} type="number" min={1} className="w-20"
                  onChange={e=>setProdField(p.rowId,{cantidad:+e.target.value||1})}/>
                <p className="text-xs text-muted-foreground mt-1">
                  {p.cantidad} × {p.cantidadPorPresentacion} = {piezasTot} pz
                </p>
              </TableCell>

              {/* presentación */}
              <TableCell>
                <Select
                  value={p.presentacionId?.toString()??"0"}
                  onOpenChange={async o=>{
                    if(o&&!presentaciones[p.id]){
                      const {data}=await api.presentaciones(p.id);
                      setPresentaciones(prev=>({...prev,[p.id]:data??[]}));
                    }
                  }}
                  onValueChange={async val=>{
                    const id=+val;
                    if(id===0) return setProdField(p.rowId,{presentacionId:null,cantidadPorPresentacion:1});
                    const {data}=await api.presentacionById(id);
                    setProdField(p.rowId,{presentacionId:id,cantidadPorPresentacion:+data?.cantidad||1});
                  }}>
                  <SelectTrigger className="w-44"><SelectValue>{labelPres(p)}</SelectValue></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sin presentación — 1 pz</SelectItem>
                    {(presentaciones[p.id]??[]).map(pr=>(
                      <SelectItem key={pr.id} value={pr.id.toString()}>{pr.nombre} — {pr.cantidad} pz</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>

              {/* detalles */}
              <TableCell>
                {det && (
                  <div className="space-y-1 text-xs">
                    {det.inventarios.map((i,idx)=>(
                      <div key={idx}>📦 {i.ubicacion_nombre} — {i.stock_actual} pz — S/ {i.precio_costo.toFixed(2)}</div>
                    ))}
                    {det.precios.map((pr,idx)=>(
                      <div key={idx}>💲 {pr.precio_venta} — {pr.ubicacion_nombre}</div>
                    ))}
                  </div>
                )}
              </TableCell>

              <TableCell>
                <Button size="sm" variant="destructive" onClick={()=>borrarProd(p.rowId)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

/* ——— pie de Totales + botón Enviar ——— */
const Totales = ({subtotal,impuesto,onSubmit}:{subtotal:number;impuesto:number;onSubmit:()=>void})=>(
  <footer className="flex justify-between items-center border-t pt-4">
    <div className="text-sm space-y-1">
      <div>Subtotal: S/ {subtotal.toFixed(2)}</div>
      <div>Impuesto: S/ {impuesto.toFixed(2)}</div>
      <div className="font-semibold">Total: S/ {(subtotal+impuesto).toFixed(2)}</div>
    </div>
    <Button onClick={onSubmit}>Enviar</Button>
  </footer>
);
