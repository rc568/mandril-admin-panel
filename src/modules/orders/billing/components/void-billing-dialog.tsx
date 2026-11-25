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

export const VoidBillingDialog = ({ billing, open, onOpenChange }: Props) => {
  const { voidBilling } = useBillingMutation();

  const onConfirm = () => {
    voidBilling.mutate({ id: billing.id }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Anular este comprobante?</DialogTitle>
          <DialogDescription>
            Se marcará como anulado y ya no podrá editarse ni volver a emitirse. Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" disabled={voidBilling.isPending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" disabled={voidBilling.isPending} onClick={onConfirm}>
            {voidBilling.isPending ? 'Anulando...' : 'Anular comprobante'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
