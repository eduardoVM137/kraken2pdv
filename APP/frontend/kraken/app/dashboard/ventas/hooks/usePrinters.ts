

// =============================================
// hooks/usePrinters.ts — QZ Tray + lista impresoras
// =============================================
import { useCallback, useEffect, useState } from "react";
import { inicializarQZTray, listarImpresorasDisponibles } from "@/app/utils/imprimir-pos";


export type TamanoPapel = "58mm" | "80mm";


export function usePrinters(defaultName = "POS-58") {
const [impresoras, setImpresoras] = useState<string[]>([defaultName]);
const [nombreImpresora, setNombreImpresora] = useState<string>(defaultName);
const [tamanoPapel, setTamanoPapel] = useState<TamanoPapel>("58mm");


const init = useCallback(async () => {
try {
await inicializarQZTray();
const lista = await listarImpresorasDisponibles();
const union = Array.from(new Set([defaultName, ...lista]));
setImpresoras(union);
if (!union.includes(nombreImpresora)) setNombreImpresora(union[0]);
} catch (e) {
console.error("No se pudo inicializar QZ/listar impresoras", e);
}
}, [defaultName, nombreImpresora]);


useEffect(() => { init(); }, [init]);


return { impresoras, nombreImpresora, setNombreImpresora, tamanoPapel, setTamanoPapel } as const;
}

