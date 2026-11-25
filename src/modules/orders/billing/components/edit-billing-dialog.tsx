import { InputField, SelectField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { CURRENCY_SYMBOL } from '@/constants/unit';
import { useBillingMutation } from '@/hooks/query/order';
import { CLIENT_DOCUMENT_TYPE_CONFIG } from '@/modules/orders/constants/order.constants';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useController, useForm } from 'react-hook-form';
import type { OrderMapped } from '../../interfaces/ui';
import { IDENTITY_DOCUMENT_TYPE_KEYS } from '../constants/billing.constants';
import type { UpdateBillingPayload } from '../interfaces/api';
import type { UpdateBillingForm } from '../interfaces/ui';
import { updateBillingSchema } from '../validators/billing.validators';

type Billing = OrderMapped['billing'][number];

interface Props {
  billing: Billing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const documentTypeOptions = IDENTITY_DOCUMENT_TYPE_KEYS.filter((type) => type !== 'RUC').map((type) => ({
  id: type,
  label: CLIENT_DOCUMENT_TYPE_CONFIG[type].label
}));

const getPayload = (values: UpdateBillingForm): UpdateBillingPayload => {
  const common = { amount: values.amount };

  if (values.billingReceiptType === 'FACTURA') {
    return {
      ...common,
      billingName: values.billingName,
      billingReceiptType: 'FACTURA',
      billingDocumentNumberType: 'RUC',
      billingDocumentNumber: values.billingDocumentNumber ?? ''
    };
  }

  if (values.billingDocumentNumberType === 'SIN DOCUMENTO') {
    return {
      ...common,
      billingName: values.billingName,
      billingReceiptType: 'BOLETA',
      billingDocumentNumberType: 'SIN DOCUMENTO'
    };
  }

  if (values.billingDocumentNumberType === 'RUC') {
    throw new Error('El tipo RUC solo se admite para facturas.');
  }

  return {
    ...common,
    billingName: values.billingName,
    billingReceiptType: 'BOLETA',
    billingDocumentNumberType: values.billingDocumentNumberType,
    billingDocumentNumber: values.billingDocumentNumber ?? ''
  };
};

export const EditBillingDialog = ({ billing, open, onOpenChange }: Props) => {
  const { updateBilling } = useBillingMutation();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<UpdateBillingForm>({
    resolver: standardSchemaResolver(updateBillingSchema),
    defaultValues: {
      amount: Number(billing.amount),
      billingName: billing.billingName,
      billingReceiptType: billing.billingReceiptType,
      billingDocumentNumberType: billing.billingReceiptType === 'FACTURA' ? 'RUC' : billing.billingDocumentNumberType,
      billingDocumentNumber: billing.billingDocumentNumber ?? ''
    }
  });
  const { field: receiptTypeField } = useController({ name: 'billingReceiptType', control });
  const { field: documentTypeField } = useController({ name: 'billingDocumentNumberType', control });

  const onSubmit = handleSubmit(async (values) => {
    const body = getPayload(values);
    await updateBilling.mutateAsync({ id: billing.id, body }, { onSuccess: () => onOpenChange(false) });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar comprobante</DialogTitle>
          <DialogDescription>
            Puedes modificar los datos de un comprobante pendiente. Al cambiar los datos del cliente, completa todo el
            bloque de identidad.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <InputField
            startAdornment={CURRENCY_SYMBOL}
            label="Importe"
            type="number"
            min="0.01"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            error={errors.amount?.message}
          />

          <InputField
            label="Razón social o nombre"
            autoComplete="organization"
            maxLength={255}
            {...register('billingName')}
            error={errors.billingName?.message}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Tipo de comprobante"
              value={receiptTypeField.value}
              onChange={(value) => {
                receiptTypeField.onChange(value);
                if (value === 'FACTURA') {
                  setValue('billingDocumentNumberType', 'RUC', { shouldDirty: true });
                } else if (documentTypeField.value === 'RUC') {
                  setValue('billingDocumentNumberType', 'DNI', { shouldDirty: true });
                }
                setValue('billingDocumentNumber', '', { shouldDirty: true });
              }}
              error={errors.billingReceiptType?.message}
              options={[
                { id: 'BOLETA', label: 'Boleta' },
                { id: 'FACTURA', label: 'Factura' }
              ]}
            />
            {receiptTypeField.value === 'BOLETA' ? (
              <SelectField
                label="Tipo de documento"
                value={documentTypeField.value}
                onChange={(value) => {
                  documentTypeField.onChange(value);
                  setValue('billingDocumentNumber', '', { shouldDirty: true });
                }}
                error={errors.billingDocumentNumberType?.message}
                options={documentTypeOptions}
              />
            ) : (
              <div className="space-y-2">
                <span className="text-sm font-medium">Tipo de documento</span>
                <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">RUC (requerido para factura)</p>
              </div>
            )}
          </div>

          {documentTypeField.value !== 'SIN DOCUMENTO' && (
            <InputField
              label={documentTypeField.value === 'RUC' ? 'Número de RUC' : 'Número de documento'}
              inputMode="numeric"
              maxLength={documentTypeField.value === 'RUC' ? 11 : 25}
              autoComplete="off"
              {...register('billingDocumentNumber')}
              error={errors.billingDocumentNumber?.message}
            />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={updateBilling.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateBilling.isPending}>
              {updateBilling.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
