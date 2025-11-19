import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';
import type { ProductMapped } from '../interfaces/get-products-mapped.interface';

interface Props {
  product: ProductMapped;
}

type StockStatus = 'Sin Stock' | 'Bajo Stock' | 'En Stock';

const getStatusBadge = (isActive: boolean) => {
  if (!isActive) {
    return <Badge variant="destructive">No activo</Badge>;
  }
  return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
};

const getStockStatusBadge = (stockStatus: StockStatus) => {
  switch (stockStatus) {
    case 'Sin Stock':
      return <Badge variant="destructive">Sin Stock</Badge>;
    case 'Bajo Stock':
      return <Badge className="bg-amber-100 text-amber-800">Bajo Stock</Badge>;
    case 'En Stock':
      return <Badge className="bg-green-100 text-green-800">En Stock</Badge>;
    default:
      return <Badge variant="destructive">Sin Stock</Badge>;
  }
};

export const ProductListItem = ({ product }: Props) => {
  if (product.productVariant.length === 1) {
    return product.productVariant.map((variant) => (
      <TableRow className="bg-muted/20" key={variant.id}>
        <TableCell>{variant.code}</TableCell>
        <TableCell className="font-medium">{product.name}</TableCell>
        <TableCell>{variant.quantityInStock}</TableCell>
        <TableCell>{variant.purchasePrice}</TableCell>
        <TableCell>{variant.profitPercentage}</TableCell>
        <TableCell className="font-medium">{variant.price}</TableCell>
        <TableCell>{getStatusBadge(variant.isActive)}</TableCell>
        <TableCell>{getStockStatusBadge(variant.stockStatus)}</TableCell>
        <TableCell className="flex gap-2 justify-end items-center">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  }

  return (
    <>
      <TableRow className="bg-muted/20 border-0">
        <TableCell></TableCell>
        <TableCell colSpan={8} className="font-medium">
          {product.name}
        </TableCell>
      </TableRow>
      {product.productVariant.map((variant, index) => (
        <TableRow
          className={cn('bg-muted/20', index === product.productVariant.length - 1 ? '' : 'border-b-0')}
          key={variant.id}
        >
          <TableCell>{variant.code}</TableCell>
          <TableCell>
            {variant.variantAttributes.map((attr) => (
              <div key={attr.attribute}>
                <Badge className="bg-amber-200 text-primary">{attr.attribute}</Badge>
                <span> : {attr.value}</span>
              </div>
            ))}
          </TableCell>
          <TableCell>{variant.quantityInStock}</TableCell>
          <TableCell>{variant.purchasePrice}</TableCell>
          <TableCell>{variant.profitPercentage}</TableCell>
          <TableCell className="font-medium">{variant.price}</TableCell>
          <TableCell>{getStatusBadge(variant.isActive)}</TableCell>
          <TableCell>{getStockStatusBadge(variant.stockStatus)}</TableCell>
          <TableCell className={`flex gap-2 justify-end items-center`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
