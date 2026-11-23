import { InputField } from '@/components/common/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useOrderMutation } from '@/hooks/query/order';
import { cn } from '@/lib/utils';
import { useState, type ChangeEvent } from 'react';
import { RETURN_CONDITION_CONFIG, RETURN_CONDITION_KEYS } from '../../constants/order.constants';
import type { CompleteOrderItemInput, ReturnCondition } from '../../interfaces/api';
import type { OrderMapped } from '../../interfaces/ui';

interface Props {
  order: OrderMapped;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Allocation = Record<string, Partial<Record<ReturnCondition, number>>>;

export const OrderReturnCompletionDialog = ({ order, open, onOpenChange }: Props) => {
  const { completeOrder } = useOrderMutation();
  const [allocations, setAllocations] = useState<Allocation>({});
  const returnedProducts = order.products.filter((product) => product.type === 'RETURN');

  const getAllocation = (productId: string) => allocations[productId] ?? { AVAILABLE: 0, QUARANTINE: 0, DEFECTIVE: 0 };

  const isAllocationValid =
    returnedProducts.length > 0 &&
    returnedProducts.every((product) => {
      const amounts = RETURN_CONDITION_KEYS.map((condition) => getAllocation(product.id)[condition] ?? 0);
      return (
        amounts.every((amount) => Number.isInteger(amount) && amount >= 0) &&
        amounts.reduce((total, amount) => total + amount, 0) === product.quantity
      );
    });

  const handleAllocationChange = (productId: string, condition: ReturnCondition) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const quantity = event.currentTarget.value === '' ? 0 : event.currentTarget.valueAsNumber;
      setAllocations((previous) => ({
        ...previous,
        [productId]: {
          ...(previous[productId] ?? {
            AVAILABLE: 0,
            QUARANTINE: 0,
            DEFECTIVE: 0
          }),
          [condition]: quantity
        }
      }));
    };
  };

  const completeOrderWithAllocations = () => {
    const items: CompleteOrderItemInput[] = returnedProducts.flatMap((product) => {
      const allocation = getAllocation(product.id);

      return RETURN_CONDITION_KEYS.flatMap((condition) => {
        const quantity = allocation[condition] ?? 0;
        return quantity > 0 ? [{ orderProductId: product.id, condition, quantity }] : [];
      });
    });

    const [firstItem, ...remainingItems] = items;
    if (!firstItem || !isAllocationValid) return;

    completeOrder.mutate(
      { id: order.id, body: { items: [firstItem, ...remainingItems] } },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Condición de los productos devueltos</DialogTitle>
          <DialogDescription>
            Indica la condición invidual de cada producto a devolver. La suma debe coincidir con el total.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {returnedProducts.map((product) => {
            const allocation = getAllocation(product.id);
            const assignedQuantity = RETURN_CONDITION_KEYS.reduce(
              (total, condition) => total + (allocation[condition] ?? 0),
              0
            );

            return (
              <div key={product.id} className="space-y-3 rounded-md border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {product.code} - {product.name}
                  </p>
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
                  <p className="text-xs text-muted-foreground">Cantidad devuelta: {product.quantity}</p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {RETURN_CONDITION_KEYS.map((condition) => (
                    <InputField
                      key={condition}
                      label={RETURN_CONDITION_CONFIG[condition].label}
                      type="number"
                      min={0}
                      max={product.quantity - assignedQuantity + (allocation[condition] ?? 0)}
                      step={1}
                      value={allocation[condition] ?? 0}
                      aria-label={`${RETURN_CONDITION_CONFIG[condition].label}: ${product.name}`}
                      onChange={handleAllocationChange(product.id, condition)}
                    />
                  ))}
                </div>
                <p
                  className={cn('text-xs', {
                    'text-destructive': assignedQuantity !== product.quantity
                  })}
                  aria-live="polite"
                >
                  Asignadas: {assignedQuantity} de {product.quantity}
                  {assignedQuantity < product.quantity && ` · Faltan ${product.quantity - assignedQuantity}`}
                  {assignedQuantity > product.quantity && ` · Sobran ${assignedQuantity - product.quantity}`}
                </p>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Volver
          </Button>
          <Button
            type="button"
            disabled={completeOrder.isPending || !isAllocationValid}
            onClick={completeOrderWithAllocations}
          >
            {completeOrder.isPending ? 'Completando...' : 'Completar orden'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
