import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import type { ProductMapped } from '../interfaces/get-products-mapped.interface';
import { ProductListRow } from './product-list-row';

interface Props extends PropsWithChildren {
  products: ProductMapped[];
}

export const ProductList = ({ products, children }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Package className="w-5 h-5" />
            Catálogo de Productos
          </div>
          {children}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Precio Compra</TableHead>
              <TableHead>Ganancia (%)</TableHead>
              <TableHead>Precio Venta</TableHead>
              <TableHead>Visibilidad</TableHead>
              <TableHead>Estado Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <ProductListRow product={product} key={product.id} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
