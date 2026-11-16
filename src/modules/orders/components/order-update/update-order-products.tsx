import { FormErrorMessage } from '@/components/common/form-error-message';
import { SearchBarDebounce } from '@/components/common/search-bar-debounce';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSearchProductVariants } from '@/hooks/query/product/useSeachProductVariants';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useWatch, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { UpdateOrderForm, UpdateOrderProductForm } from '../../interfaces/ui';

interface Props {
  products: (UpdateOrderProductForm & { id: string })[];
  addProduct: (product: UpdateOrderProductForm) => void;
  deleteProduct: (index: number) => void;
  control: Control<UpdateOrderForm>;
  register: UseFormRegister<UpdateOrderForm>;
  errors: FieldErrors<UpdateOrderForm>;
}

export const UpdateOrderProducts = ({ products, addProduct, deleteProduct, control, register, errors }: Props) => {
  const [search, setSearch] = useState('');
  const [showProductList, setShowProductList] = useState(false);
  const [searchInputKey, setSearchInputKey] = useState(0);
  const productsWatch = useWatch({ control, name: 'products' }) ?? [];
  const {
    data: variants,
    isLoading,
    isError
  } = useSearchProductVariants({
    filters: { search },
    enabled: search.trim().length > 0
  });
  const selectedVariantIds = productsWatch.map((product) => product.variantId);
  const total = productsWatch.reduce((sum, product) => sum + product.price * product.quantity, 0);

  const onSearch = (query: string) => {
    const cleanQuery = query.trim();
    setSearch(cleanQuery);
    setShowProductList(cleanQuery.length > 0);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <SearchBarDebounce
          id="update-order-products"
          onSearch={onSearch}
          key={searchInputKey}
          onBlur={() => setShowProductList(false)}
          onFocus={() => setShowProductList(search.trim().length > 0)}
          placeholder="Buscar productos para agregar..."
        />
        {showProductList && (
          <div className="absolute left-0 right-0 top-[80%] z-50 rounded-lg border shadow-lg">
            {isLoading ? (
              <div className="max-h-64 bg-background px-4 py-2 text-sm text-muted-foreground">Buscando...</div>
            ) : isError ? (
              <div className="max-h-64 bg-background px-4 py-2 text-sm text-destructive">
                No se pudo buscar productos. Intenta nuevamente.
              </div>
            ) : variants?.products.length === 0 ? (
              <div className="max-h-64 bg-background px-4 py-2 text-sm text-muted-foreground">
                No se encontraron productos.
              </div>
            ) : (
              <ul className="max-h-60 divide-y overflow-y-auto bg-background">
                {variants?.products.map((variant) => {
                  const isSelected = selectedVariantIds.includes(variant.variantId);
                  const isOutOfStock = variant.availableQuantity < 1;
                  const disabled = isSelected || isOutOfStock;

                  return (
                    <li
                      key={variant.variantId}
                      className={cn('px-4 py-2 transition-colors hover:bg-accent', {
                        'hover:bg-transparent': disabled
                      })}
                    >
                      <button
                        type="button"
                        disabled={disabled}
                        className={cn('w-full text-left', { 'cursor-not-allowed opacity-50': disabled })}
                        onClick={() => {
                          if (disabled) return;
                          addProduct({
                            variantId: variant.variantId,
                            type: 'SALE',
                            quantity: 1,
                            price: Number(variant.price),
                            name: variant.name,
                            code: variant.code,
                            purchasePrice: Number(variant.purchasePrice),
                            currentStock: variant.availableQuantity,
                            availabilityKnown: true,
                            variantAttributes: variant.variantAttributes
                          });
                          setShowProductList(false);
                          setSearch('');
                          setSearchInputKey((key) => key + 1);
                        }}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                              <span>{variant.name}</span>
                              {variant.variantAttributes.map((attribute) => (
                                <Badge
                                  key={`${attribute.attributeId}-${attribute.valueId}`}
                                  className="bg-amber-200 text-primary"
                                >
                                  {attribute.attribute}: {attribute.value}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-muted-foreground">
                              {variant.code} · Stock disponible: {variant.availableQuantity}
                              {isSelected ? ' · Ya está en la orden' : ''}
                            </span>
                          </div>
                          <span className="shrink-0 text-sm font-medium">{formatCurrency(variant.price)}</span>
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

      {errors.products?.message && <FormErrorMessage text={String(errors.products.message)} />}
      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          La orden debe tener al menos un producto.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="text-xs uppercase">
                <TableHead>ID</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => {
                const quantity = productsWatch[index]?.quantity ?? product.quantity;
                const price = productsWatch[index]?.price ?? product.price;
                const quantityError = errors.products?.[index]?.quantity?.message;
                const priceError = errors.products?.[index]?.price?.message;

                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.variantId.toString().padStart(3, '0')}</TableCell>
                    <TableCell>{product.code}</TableCell>
                    <TableCell className="min-w-48">
                      <div className="flex flex-col gap-2 text-sm">
                        <span>{product.name}</span>
                        {product.variantAttributes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {product.variantAttributes.map((attribute) => (
                              <Badge
                                key={`${attribute.attributeId}-${attribute.valueId}`}
                                className="bg-amber-200 text-primary"
                              >
                                {attribute.attribute}: {attribute.value}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {product.availabilityKnown && quantity > product.currentStock && (
                          <span className="text-xs italic text-destructive">
                            Stock disponible en este momento: {product.currentStock}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-28">
                      <Input
                        {...register(`products.${index}.quantity`, { valueAsNumber: true })}
                        type="number"
                        min={1}
                        step={1}
                        aria-label={`Cantidad de ${product.name}`}
                        aria-invalid={Boolean(quantityError)}
                      />
                      {quantityError && <FormErrorMessage text={quantityError} />}
                    </TableCell>
                    <TableCell className="w-32">
                      <Input
                        {...register(`products.${index}.price`, { valueAsNumber: true })}
                        type="number"
                        min={0}
                        step="0.01"
                        aria-label={`Precio de ${product.name}`}
                        aria-invalid={Boolean(priceError)}
                      />
                      {priceError && <FormErrorMessage text={priceError} />}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(price * quantity)}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={products.length === 1}
                        onClick={() => deleteProduct(index)}
                        aria-label={`Eliminar ${product.name} de la orden`}
                        title={products.length === 1 ? 'La orden debe conservar al menos un producto' : undefined}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-end px-4 pt-2">
        <span className="font-semibold">Total: {formatCurrency(total)}</span>
      </div>
      <p className="text-xs text-muted-foreground">La disponibilidad de inventario se vuelve a validar al guardar.</p>
    </div>
  );
};
