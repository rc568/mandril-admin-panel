import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
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

export const ProductListRow = ({ product }: Props) => {
  return (
    <>
      {product.productVariant.map((variant) => (
        <TableRow className="bg-muted/40" key={variant.id}>
          <TableCell>{variant.code}</TableCell>
          <TableCell>
            <div className="flex flex-col gap-2">
              <span className="font-medium">{product.name}</span>
              {variant.variantAttributes.map((attr) => (
                <div>
                  <Badge className="bg-amber-200 text-primary">{attr.attribute} :</Badge>
                  <span className="pl-2 font-medium">{attr.value}</span>
                </div>
              ))}
            </div>
          </TableCell>
          <TableCell>{variant.quantityInStock}</TableCell>
          <TableCell className="font">{variant.purchasePrice}</TableCell>
          <TableCell>{variant.profitPercentage}</TableCell>
          <TableCell className="font-semibold">{variant.price}</TableCell>
          <TableCell>{getStatusBadge(variant.isActive)}</TableCell>
          <TableCell>{getStockStatusBadge(variant.stockStatus)}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
