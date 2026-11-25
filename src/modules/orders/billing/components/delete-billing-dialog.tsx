import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useBillingMutation } from '@/hooks/query/order';
import type { OrderMapped } from '../../interfaces/ui';

type Billing = OrderMapped['billing'][number];

interface Props {
  billing: Billing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteBillingDialog = ({ billing, open, onOpenChange }: Props) => {
  const { deleteBilling } = useBillingMutation();

  const onConfirm = () => {
    deleteBilling.mutate({ id: billing.id }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar este comprobante?</DialogTitle>
          <DialogDescription>
            Se eliminará definitivamente el comprobante pendiente y no podrá recuperarse.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={deleteBilling.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="button" variant="destructive" disabled={deleteBilling.isPending} onClick={onConfirm}>
            {deleteBilling.isPending ? 'Eliminando...' : 'Eliminar comprobante'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
