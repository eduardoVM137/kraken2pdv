"use client";

import React from "react";
import { FormularioProducto } from "@/components/producto/form/FormularioProducto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CrearProductoPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Registrar nuevok producto</CardTitle>
        </CardHeader>
        <CardContent>
          <FormularioProducto />
        </CardContent>
          <CardContent>
        </CardContent>
      </Card>
      
    </div>
    
  );
}
