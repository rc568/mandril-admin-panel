import { InputField } from '@/components/common/form';
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
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import type { OrderMapped } from '../../interfaces/ui';
import type { IssueBillingForm } from '../interfaces/ui';
import { getIssueBillingSchema } from '../validators/billing.validators';

type Billing = OrderMapped['billing'][number];

interface Props {
  billing: Billing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const IssueBillingDialog = ({ billing, open, onOpenChange }: Props) => {
  const { issueBilling } = useBillingMutation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IssueBillingForm>({
    resolver: standardSchemaResolver(getIssueBillingSchema(billing.billingReceiptType)),
    defaultValues: { code: '' }
  });

  const onSubmit = handleSubmit(async ({ code }) => {
    await issueBilling.mutateAsync({ id: billing.id, body: { code } }, { onSuccess: () => onOpenChange(false) });
  });

  const codeFormat = billing.billingReceiptType === 'FACTURA' ? 'E001-####' : 'EB01-####';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Emitir comprobante</DialogTitle>
          <DialogDescription>
            Ingresa la serie y correlativo del comprobante.
            <p>Formato esperado: {codeFormat}.</p>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <InputField
            label="Código del comprobante"
            placeholder={billing.billingReceiptType === 'FACTURA' ? 'E001-0001' : 'EB01-0001'}
            autoComplete="off"
            {...register('code')}
            error={errors.code?.message}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={issueBilling.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={issueBilling.isPending}>
              {issueBilling.isPending ? 'Emitiendo...' : 'Emitir comprobante'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
