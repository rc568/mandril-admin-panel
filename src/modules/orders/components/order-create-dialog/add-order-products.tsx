import { SearchBarDebounce } from '@/components/common/search-bar-debounce';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSearchProductVariants } from '@/hooks/query/product/useSeachProductVariants';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import type { SearchProductVariant } from '@/modules/products/interfaces/api/get-search-product-variants.interface';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useWatch, type Control, type UseFormRegister } from 'react-hook-form';
import type { CreateOrderForm, OrderProductForm } from '../../interfaces/ui/create-order-form.interface';

interface Props {
  products: (OrderProductForm & { id: string })[];
  addProduct: (orderProduct: OrderProductForm) => void;
  deleteProduct: (index: number) => void;
  control: Control<CreateOrderForm>;
  register: UseFormRegister<CreateOrderForm>;
}

export const AddOrderProducts = ({ products, control, addProduct, deleteProduct, register }: Props) => {
  const [search, setSearch] = useState<string>('');
  const [showProductList, setShowProductList] = useState(false);

  const onClick = (variant: SearchProductVariant) => {
    addProduct({
      ...variant,
      quantity: 1,
      currentStock: variant.quantityInStock,
      price: parseFloat(variant.price),
      purchasePrice: parseFloat(variant.purchasePrice)
    });
    setShowProductList(false);
  };

  const {
    data: variants,
    isLoading,
    isError
  } = useSearchProductVariants({
    filters: { search: search },
    enabled: search.trim().length !== 0
  });

  const onSearch = (query: string) => {
    const cleanQuery = query.trim();
    if (cleanQuery === '') {
      setSearch('');
      setShowProductList(false);
      return;
    }

    setSearch(cleanQuery);
    setShowProductList(true);
  };

  const productsWatch = useWatch({ control, name: 'products' });
  const totalSale = productsWatch.reduce((acc, curr) => curr.quantity * curr.price + acc, 0);
  const currentProductVariantIds = productsWatch.map((pv) => pv.variantId);

  return (
    <>
      <div className="relative">
        <SearchBarDebounce
          id="order-products"
          onSearch={onSearch}
          onBlur={() => setShowProductList(false)}
          onFocus={() => setShowProductList(true)}
          placeholder="Buscar productos..."
        />

        {showProductList && (
          <div className="absolute left-0 right-0 top-[80%] border rounded-lg z-50 shadow-lg">
            {isLoading ? (
              <div className="bg-background max-h-64 py-2 px-4 text-sm text-muted-foreground">Buscando...</div>
            ) : isError ? (
              <div className="bg-background max-h-64 py-2 px-4 text-sm text-destructive">
                Ocurrió un error al consultar los clientes.
              </div>
            ) : variants?.products.length === 0 ? (
              <div className="bg-background max-h-64 py-2 px-4 text-sm text-muted-foreground">Sin resultados</div>
            ) : (
              <ul className="max-h-60 overflow-y-auto bg-background divide-y">
                {variants?.products.map((pv) => {
                  const isAlreadySelected = currentProductVariantIds.includes(pv.variantId);
                  const isOutOfStock = pv.quantityInStock === 0;

                  const isDisabled = isAlreadySelected || isOutOfStock;

                  return (
                    <li
                      key={pv.variantId}
                      className={cn('py-2 px-4 hover:bg-accent transition-colors', {
                        'hover:bg-transparent': isDisabled
                      })}
                    >
                      <button
                        type="button"
                        className={cn('w-full cursor-pointer', {
                          'cursor-auto opacity-60 bg-muted/20': isDisabled
                        })}
                        onClick={() => {
                          if (isDisabled) return;
                          onClick(pv);
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col items-start text-sm gap-y-1">
                            <div className="flex flex-wrap gap-2">
                              <span>{pv.name}</span>
                              {pv.variantAttributes?.length > 0 &&
                                pv.variantAttributes.map((va) => (
                                  <Badge key={`${va.attributeId}-${va.valueId}`} className="bg-amber-200 text-primary">
                                    {va.attribute}: {va.value}
                                  </Badge>
                                ))}
                            </div>

                            <span className="text-muted-foreground">
                              {pv.code} - Stock: {pv.quantityInStock}
                            </span>
                          </div>
                          <span className="font-medium text-sm">{formatCurrency(pv.price)}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            Busca y selecciona productos para agregarlos a la venta.
          </div>
        ) : (
          <Table className="border">
            <TableHeader>
              <TableRow className="text-xs uppercase">
                <TableHead className="text-muted-foreground">Código</TableHead>
                <TableHead className="text-muted-foreground">Producto</TableHead>
                <TableHead className="text-muted-foreground">Cant.</TableHead>
                <TableHead className="text-muted-foreground">Precio</TableHead>
                <TableHead className="text-muted-foreground">Subtotal</TableHead>
                <TableHead className="text-muted-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => {
                const currentQuantitySelected = productsWatch.find((p) => p.variantId === product.variantId)?.quantity;

                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.code}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start text-sm gap-y-2">
                        <span>{product.name}</span>
                        {product.variantAttributes?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {product.variantAttributes.map((va) => (
                              <Badge className="bg-amber-200 text-primary" key={va.valueId}>
                                {va.attribute}: {va.value}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {(currentQuantitySelected ?? 1) > product.currentStock && (
                          <span className="text-destructive text-xs italic">
                            Stock disponible es de {product.currentStock} unidades
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        {...register(`products.${index}.quantity`)}
                        className="max-w-16 text-left"
                        type="number"
                        min={1}
                        max={product.currentStock}
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{formatCurrency((productsWatch?.[index]?.quantity ?? 1) * product.price)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => deleteProduct(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-end my-8 px-4">
        <span className="font-semibold">Total: {formatCurrency(totalSale)}</span>
      </div>
    </>
  );
};
