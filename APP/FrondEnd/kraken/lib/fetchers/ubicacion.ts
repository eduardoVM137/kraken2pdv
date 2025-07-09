 export async function getUbicacionDetallada(detalleProductoId: number) {
  try {
    const res = await fetch(`http://localhost:3001/api/celda/ubicacion-detallada/${detalleProductoId}`)

    if (!res.ok) {
      throw new Error(`❌ Error ${res.status} al obtener ubicación detallada`)
    }

    const data = await res.json()

    if (Array.isArray(data.data)) {
      return data.data
    }

    console.error("❌ Respuesta inesperada (ubicación):", data)
    return []
  } catch (error) {
    console.error("❌ Error al obtener ubicación detallada:", error)
    return []
  }
}
