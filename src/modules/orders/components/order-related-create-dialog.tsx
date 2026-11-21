import { SelectField, TextareaField } from '@/components/common/form';
import { FormErrorMessage } from '@/components/common/form-error-message';
import { SearchBarDebounce } from '@/components/common/search-bar-debounce';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CURRENCY_SYMBOL } from '@/constants/unit';
import { useOrderMutation } from '@/hooks/query/order';
import { useSearchProductVariants } from '@/hooks/query/product/useSeachProductVariants';
import { useSalesChannel } from '@/hooks/query/sales-channel';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import type { SearchProductVariant } from '@/modules/products/interfaces/api/get-search-product-variants.interface';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { Order, OrderProductResponse, OrderType } from '../interfaces/api';
import { createRelatedOrderSchema } from '../validators/order.validators';

type RelatedOrderType = Extract<OrderType, 'EXCHANGE' | 'RETURN'>;

interface ReturnProductFormLine {
  variantId: number;
  quantity: number;
  name: string;
  code: string;
  maxQuantity: number;
  variantAttributes: OrderProductResponse['variantAttributes'];
}

interface SaleProductFormLine {
  variantId: number;
  type: 'SALE';
  price: number;
  quantity: number;
  name: string;
  code: string;
  purchasePrice: number;
  currentStock: number;
  variantAttributes: OrderProductResponse['variantAttributes'];
}

interface RelatedOrderDraftForm {
  salesChannelId?: number;
  observation: string;
  fullReturn: boolean;
  returnProducts: ReturnProductFormLine[];
  saleProducts: SaleProductFormLine[];
}

interface Props {
  open: boolean;
  order: Order;
  type: RelatedOrderType;
  initialSalesChannelId?: number;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export const OrderRelatedCreateDialog = ({
  open,
  order,
  type,
  initialSalesChannelId,
  onOpenChange,
  onCreated
}: Props) => {
  const { data: salesChannels, isError: isSalesChannelError, refetch: refetchSalesChannels } = useSalesChannel();
  const { createOrder } = useOrderMutation();
  const [search, setSearch] = useState('');
  const [searchInputKey, setSearchInputKey] = useState(0);
  const [showProductList, setShowProductList] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const form = useForm<RelatedOrderDraftForm>({
    defaultValues: {
      salesChannelId: initialSalesChannelId,
      observation: '',
      fullReturn: false,
      returnProducts: [],
      saleProducts: []
    }
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = form;

  const { append: appendReturn, remove: removeReturn } = useFieldArray({
    control,
    name: 'returnProducts'
  });

  const {
    fields: saleFields,
    append: appendSale,
    remove: removeSale
  } = useFieldArray({
    control,
    name: 'saleProducts'
  });

  const salesChannelId = useWatch({ control, name: 'salesChannelId' });
  const fullReturn = useWatch({ control, name: 'fullReturn' });
  const returnProducts = useWatch({ control, name: 'returnProducts' }) ?? [];
  const saleProductsWatch = useWatch({ control, name: 'saleProducts' }) ?? [];
  const returnableOrderProducts = order.products.filter((product) => product.type === 'SALE');

  const {
    data: searchResults,
    isLoading: isSearching,
    isError: isSearchError
  } = useSearchProductVariants({
    filters: { search },
    enabled: open && type === 'EXCHANGE' && search.trim().length > 0
  });

  const onSearch = (query: string) => {
    const cleanQuery = query.trim();
    setSearch(cleanQuery);
    setShowProductList(cleanQuery.length > 0);
  };

  const addSaleProduct = (variant: SearchProductVariant) => {
    appendSale({
      variantId: variant.variantId,
      type: 'SALE',
      price: Number(variant.price),
      quantity: 1,
      name: variant.name,
      code: variant.code,
      purchasePrice: Number(variant.purchasePrice),
      currentStock: variant.availableQuantity,
      variantAttributes: variant.variantAttributes
    });
    setSearch('');
    setSearchInputKey((key) => key + 1);
    setShowProductList(false);
  };

  const addReturnProduct = (product: OrderProductResponse) => {
    appendReturn({
      variantId: product.variantId,
      quantity: 1,
      name: product.name,
      code: product.code,
      maxQuantity: product.quantity,
      variantAttributes: product.variantAttributes
    });
    setSubmitError(undefined);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(undefined);
    const observation = values.observation.trim() || undefined;
    const common = {
      salesChannelId: values.salesChannelId,
      relatedOrderId: order.id,
      status: 'PENDING' as const,
      observation
    };

    const rawPayload =
      type === 'EXCHANGE'
        ? {
            type: 'EXCHANGE' as const,
            ...common,
            products: [
              ...values.returnProducts.map(({ variantId, quantity }) => ({
                variantId,
                type: 'RETURN' as const,
                quantity
              })),
              ...values.saleProducts.map(({ variantId, price, quantity }) => ({
                variantId,
                type: 'SALE' as const,
                price,
                quantity
              }))
            ]
          }
        : values.fullReturn
          ? { type: 'RETURN' as const, ...common, fullReturn: true as const }
          : {
              type: 'RETURN' as const,
              ...common,
              fullReturn: false as const,
              products: values.returnProducts.map(({ variantId, quantity }) => ({
                variantId,
                type: 'RETURN' as const,
                quantity
              }))
            };

    const parsedPayload = createRelatedOrderSchema.safeParse(rawPayload);
    if (!parsedPayload.success) {
      setSubmitError(parsedPayload.error.issues[0]?.message ?? 'Revisa los datos de la orden.');
      return;
    }

    const invalidSaleQuantity = values.saleProducts.some(
      (product) => product.quantity > product.currentStock || product.quantity < 1
    );
    const invalidReturnQuantity = values.returnProducts.some(
      (product) => product.quantity > product.maxQuantity || product.quantity < 1
    );
    if (invalidSaleQuantity) {
      setSubmitError('La cantidad de un producto supera el stock disponible.');
      return;
    }
    if (invalidReturnQuantity) {
      setSubmitError('La cantidad a devolver no puede superar la cantidad de esa línea en la orden original.');
      return;
    }

    await createOrder.mutateAsync(parsedPayload.data, {
      onSuccess: () => {
        onOpenChange(false);
        onCreated();
      }
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{type === 'EXCHANGE' ? 'Crear cambio' : 'Crear devolución'}</DialogTitle>
          <DialogDescription>
            Orden relacionada con {order.type === 'EXCHANGE' ? 'el cambio' : 'la venta'} {order.id.slice(0, 8)}. Se
            volverá a validar el estado y las cantidades disponibles al guardar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Canal de venta"
              value={salesChannelId?.toString() ?? ''}
              onChange={(value) => setValue('salesChannelId', Number(value), { shouldDirty: true })}
              error={errors.salesChannelId?.message}
              options={salesChannels?.map((channel) => ({ id: channel.id, label: channel.channel }))}
            />
            {isSalesChannelError && (
              <div className="flex items-end">
                <Button type="button" variant="outline" onClick={() => void refetchSalesChannels()}>
                  Reintentar canales
                </Button>
              </div>
            )}
          </section>

          {type === 'RETURN' && (
            <SelectField
              label="Tipo de devolución"
              value={fullReturn ? 'FULL' : 'PARTIAL'}
              onChange={(value) => setValue('fullReturn', value === 'FULL', { shouldDirty: true })}
              options={[
                { id: 'PARTIAL', label: 'Devolución parcial' },
                { id: 'FULL', label: 'Devolución total' }
              ]}
            />
          )}

          {(type === 'EXCHANGE' || !fullReturn) && (
            <section className="space-y-3 rounded-md border p-4">
              <div>
                <h3 className="font-medium">Productos a devolver</h3>
                <p className="text-sm text-muted-foreground">
                  Seleccione los productos a devolver de la orden original. Si ya hubo devoluciones, se validará la
                  cantidad que todavía queda disponible.
                </p>
              </div>
              {returnableOrderProducts.length === 0 ? (
                <p className="text-sm italic text-muted-foreground">
                  La orden original no tiene productos SALE elegibles.
                </p>
              ) : (
                <div className="space-y-2">
                  {returnableOrderProducts.map((product) => {
                    const selectedIndex = returnProducts.findIndex((line) => line.variantId === product.variantId);

                    return (
                      <div
                        key={product.id}
                        className="flex flex-col justify-between gap-3 rounded-md border p-3 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center text-sm">
                            <span className="font-medium">
                              {product.code} - {product.name}
                            </span>
                            {/* <Badge variant="outline">SALE original</Badge> */}
                          </div>
                          <div className="font-medium flex flex-wrap gap-1">
                            {product.variantAttributes?.length > 0 &&
                              product.variantAttributes.map((va) => (
                                <Badge
                                  key={`${product.id}-${va.attributeId}-${va.valueId}`}
                                  className="bg-amber-200 text-primary"
                                >
                                  {va.attribute}: {va.value}
                                </Badge>
                              ))}
                          </div>
                          <span className="text-xs text-muted-foreground">Cantidad original: {product.quantity}</span>
                        </div>
                        {selectedIndex < 0 ? (
                          <Button type="button" variant="outline" size="sm" onClick={() => addReturnProduct(product)}>
                            <Plus className="size-4" />
                            Agregar
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input
                              {...register(`returnProducts.${selectedIndex}.quantity`, { valueAsNumber: true })}
                              type="number"
                              min={1}
                              max={product.quantity}
                              step={1}
                              aria-label={`Cantidad de ${product.name} a devolver`}
                              className="w-24"
                            />
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="outline"
                              aria-label={`Quitar ${product.name} de la devolución`}
                              onClick={() => removeReturn(selectedIndex)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {type === 'EXCHANGE' && (
            <section className="space-y-3 rounded-md border p-4">
              <div>
                <h3 className="font-medium">Productos a entregar</h3>
                <p className="text-sm text-muted-foreground">Busca y agrega los productos nuevos para el cambio.</p>
              </div>
              <div className="relative">
                <SearchBarDebounce
                  key={searchInputKey}
                  id="related-order-sale-products"
                  onSearch={onSearch}
                  onBlur={() => setShowProductList(false)}
                  onFocus={() => setShowProductList(search.trim().length > 0)}
                  placeholder="Buscar productos..."
                />
                {showProductList && (
                  <div className="absolute left-0 right-0 top-[80%] z-50 rounded-lg border shadow-lg">
                    {isSearching ? (
                      <div className="bg-background px-4 py-2 text-sm text-muted-foreground">Buscando...</div>
                    ) : isSearchError ? (
                      <div className="bg-background px-4 py-2 text-sm text-destructive">
                        No se pudieron buscar productos. Intenta nuevamente.
                      </div>
                    ) : searchResults?.products.length === 0 ? (
                      <div className="bg-background px-4 py-2 text-sm text-muted-foreground">
                        No se encontraron productos.
                      </div>
                    ) : (
                      <ul className="max-h-60 divide-y overflow-y-auto bg-background">
                        {searchResults?.products.map((variant) => {
                          const isSelected = saleProductsWatch.some(
                            (product) => product.variantId === variant.variantId
                          );
                          const isDisabled = isSelected || variant.availableQuantity < 1;

                          return (
                            <li
                              key={variant.variantId}
                              className={cn('px-4 py-2 hover:bg-accent', { 'opacity-50': isDisabled })}
                            >
                              <button
                                type="button"
                                disabled={isDisabled}
                                className="w-full text-left cursor-pointer disabled:cursor-not-allowed"
                                onClick={() => addSaleProduct(variant)}
                                onMouseDown={(event) => event.preventDefault()}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col items-start text-sm gap-y-1">
                                    <div className="flex flex-wrap gap-2">
                                      <span>{variant.name}</span>
                                      {variant.variantAttributes?.length > 0 &&
                                        variant.variantAttributes.map((va) => (
                                          <Badge
                                            key={`${va.attributeId}-${va.valueId}`}
                                            className="bg-amber-200 text-primary"
                                          >
                                            {va.attribute}: {va.value}
                                          </Badge>
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {variant.code} - Stock disponible: {variant.availableQuantity}
                                      {isSelected ? ' · Ya está agregado' : ''}
                                    </span>
                                  </div>

                                  <span className="font-medium text-sm">{formatCurrency(variant.price)}</span>
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
              {saleFields.length === 0 ? (
                <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  Agrega al menos un producto para entregar.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-xs uppercase">
                        <TableHead className="text-muted-foreground">ID</TableHead>
                        <TableHead className="text-muted-foreground">Código</TableHead>
                        <TableHead className="text-muted-foreground">Producto</TableHead>
                        <TableHead className="text-muted-foreground">Cant.</TableHead>
                        <TableHead className="text-muted-foreground">Precio</TableHead>
                        <TableHead className="text-muted-foreground">Subtotal</TableHead>
                        <TableHead className="text-muted-foreground">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {saleFields.map((field, index) => {
                        const stock = saleProductsWatch[index]?.currentStock ?? field.currentStock;
                        const price = saleProductsWatch[index]?.price ?? field.price;
                        const quantity = saleProductsWatch[index]?.quantity ?? field.quantity;

                        return (
                          <TableRow key={field.id}>
                            <TableCell>{field.variantId.toString().padStart(3, '0')}</TableCell>
                            <TableCell>{field.code}</TableCell>
                            <TableCell className="min-w-48">
                              <div className="font-medium">{field.name}</div>
                              {field.variantAttributes.map((attribute) => (
                                <Badge
                                  key={`${field.id}-${attribute.attributeId}-${attribute.valueId}`}
                                  className="mr-1 mt-1 bg-amber-200 text-primary"
                                >
                                  {attribute.attribute}: {attribute.value}
                                </Badge>
                              ))}
                              {quantity > stock && (
                                <p className="mt-1 text-xs text-destructive">Stock disponible: {stock}</p>
                              )}
                            </TableCell>
                            <TableCell className="w-28">
                              <Input
                                {...register(`saleProducts.${index}.quantity`, { valueAsNumber: true })}
                                type="number"
                                min={1}
                                max={stock}
                                step={1}
                                aria-label={`Cantidad de ${field.name} a entregar`}
                              />
                            </TableCell>
                            <TableCell className="w-32">
                              <Input
                                {...register(`saleProducts.${index}.price`, { valueAsNumber: true })}
                                type="number"
                                min={0}
                                step="0.01"
                                startAdornment={CURRENCY_SYMBOL}
                                aria-label={`Precio de ${field.name}`}
                              />
                            </TableCell>
                            <TableCell>{formatCurrency(quantity * price)}</TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                size="icon-sm"
                                variant="outline"
                                aria-label={`Quitar ${field.name} del cambio`}
                                onClick={() => removeSale(index)}
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
            </section>
          )}

          {type === 'RETURN' && fullReturn && (
            <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
              Se devolverán todas las cantidades todavía elegibles de la orden original. Se calculará el saldo final al
              crear la orden.
            </div>
          )}

          <TextareaField
            label="Observaciones"
            {...register('observation')}
            placeholder={type === 'EXCHANGE' ? 'Detalles del cambio...' : 'Detalles de la devolución...'}
            error={errors.observation?.message}
          />

          {submitError && <FormErrorMessage text={submitError} />}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={createOrder.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createOrder.isPending || !salesChannels || salesChannels.length === 0}>
              {createOrder.isPending ? 'Creando...' : type === 'EXCHANGE' ? 'Crear cambio' : 'Crear devolución'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
