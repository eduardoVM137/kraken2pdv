

  // frontend/app/dashboard/productos/nuevo/page.tsx
"use client";

import { FormularioProducto } from "@/components/producto/form/FormularioProducto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CrearProductoPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Registrar nuevo producto</CardTitle>
        </CardHeader>
        <CardContent>
          <FormularioProducto />
        </CardContent>
      </Card>
    </div>
  );
}
