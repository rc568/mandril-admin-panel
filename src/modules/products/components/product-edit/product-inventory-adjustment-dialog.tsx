import { InputField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useInventoryMutation } from '@/hooks/query/inventory/useInventoryMutation';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import type { AdjustInventoryPayload } from '@/modules/inventory/interfaces/api';
import { adjustInventorySchema } from '@/modules/inventory/validators/inventory.validators';

interface Props {
  variantId: number;
  availableQuantity: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductInventoryAdjustmentDialog = ({ variantId, availableQuantity, open, onOpenChange }: Props) => {
  const { adjustInventory } = useInventoryMutation();

  const form = useForm<AdjustInventoryPayload>({
    resolver: standardSchemaResolver(adjustInventorySchema),
    defaultValues: {
      productVariantId: variantId,
      bucket: 'AVAILABLE',
      countedQuantity: availableQuantity,
      reason: ''
    }
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.reset({
        productVariantId: variantId,
        bucket: 'AVAILABLE',
        countedQuantity: availableQuantity,
        reason: ''
      });
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = form.handleSubmit(async (payload) => {
    await adjustInventory.mutateAsync(payload, {
      onSuccess: () => handleOpenChange(false)
    });
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form
          onSubmit={(event) => {
            event.stopPropagation();
            void onSubmit(event);
          }}
        >
          <DialogHeader>
            <DialogTitle>Ajustar stock disponible</DialogTitle>
            <DialogDescription>
              Ingresa el total contado físicamente. El ajuste se registra con el motivo en el historial de inventario.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <InputField
              label="Cantidad contada"
              type="number"
              min={0}
              step={1}
              {...form.register('countedQuantity', { valueAsNumber: true })}
              error={form.formState.errors.countedQuantity?.message}
            />
            <InputField
              label="Motivo del ajuste"
              placeholder="Ej. Conteo físico de stock"
              maxLength={1000}
              {...form.register('reason')}
              error={form.formState.errors.reason?.message}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={adjustInventory.isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={adjustInventory.isPending}>
              {adjustInventory.isPending ? 'Guardando...' : 'Guardar ajuste'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
