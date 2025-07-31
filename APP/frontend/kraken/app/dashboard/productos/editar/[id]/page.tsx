import { FormularioProducto } from "@/components/producto/form/FormularioProducto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  params: { id: string };
}

export default async function EditarProductoPage({ params }: Props) {
  const id = Number(params.id); // aún mejor que parseInt

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar producto</CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Editar producto #{id}</h1>
          <FormularioProducto id={id} />
        </CardContent>
      </Card>
    </div>
  );
}
