import { InputField, SelectField, TextareaField } from '@/components/common/form';
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
import type { SearchClient } from '@/services/client/interfaces/client.interface';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useController, useForm } from 'react-hook-form';
import type { Order } from '../../interfaces/api';
import { IDENTITY_DOCUMENT_TYPE_KEYS } from '../constants/billing.constants';
import type { CreateBillingPayload } from '../interfaces/api';
import type { CreateBillingForm } from '../interfaces/ui';
import { createBillingSchema } from '../validators/billing.validators';
import { ExistingBillingSearchBar } from './existing-billing-search-bar';

interface Props {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getPayload = (values: CreateBillingForm): CreateBillingPayload => {
  const common = {
    amount: values.amount,
    billingName: values.billingName,
    note: values.note
  };

  if (values.billingReceiptType === 'FACTURA') {
    const identity = {
      billingReceiptType: 'FACTURA' as const,
      billingDocumentNumberType: 'RUC' as const,
      billingDocumentNumber: values.billingDocumentNumber ?? ''
    };

    return values.status === 'PENDING'
      ? { ...common, ...identity, status: 'PENDING' }
      : { ...common, ...identity, status: 'ISSUED', code: values.code ?? '' };
  }

  if (values.billingDocumentNumberType === 'SIN DOCUMENTO') {
    const identity = {
      billingReceiptType: 'BOLETA' as const,
      billingDocumentNumberType: 'SIN DOCUMENTO' as const
    };

    return values.status === 'PENDING'
      ? { ...common, ...identity, status: 'PENDING' }
      : { ...common, ...identity, status: 'ISSUED', code: values.code ?? '' };
  }

  if (values.billingDocumentNumberType === 'RUC') {
    throw new Error('El tipo RUC solo se admite para facturas.');
  }

  const identity = {
    billingReceiptType: 'BOLETA' as const,
    billingDocumentNumberType: values.billingDocumentNumberType,
    billingDocumentNumber: values.billingDocumentNumber ?? ''
  };

  return values.status === 'PENDING'
    ? { ...common, ...identity, status: 'PENDING' }
    : { ...common, ...identity, status: 'ISSUED', code: values.code ?? '' };
};

const documentTypeOptions = IDENTITY_DOCUMENT_TYPE_KEYS.filter((type) => type !== 'RUC').map((type) => ({
  id: type,
  label: CLIENT_DOCUMENT_TYPE_CONFIG[type].label
}));

export const CreateBillingDialog = ({ order, open, onOpenChange }: Props) => {
  const { createBilling } = useBillingMutation();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<CreateBillingForm>({
    resolver: standardSchemaResolver(createBillingSchema),
    defaultValues: {
      status: 'PENDING',
      amount: Number(order.totalSale),
      billingName: order.client.contactName ?? '',
      note: '',
      billingReceiptType: 'BOLETA',
      billingDocumentNumberType: order.client.documentNumberType ?? 'DNI',
      billingDocumentNumber: order.client.documentNumber ?? '',
      code: ''
    }
  });
  const { field: statusField } = useController({ name: 'status', control });
  const { field: receiptTypeField } = useController({ name: 'billingReceiptType', control });
  const { field: documentTypeField } = useController({ name: 'billingDocumentNumberType', control });

  const onSubmit = handleSubmit(async (values) => {
    const body = getPayload(values);
    await createBilling.mutateAsync({ orderId: order.id, body }, { onSuccess: () => onOpenChange(false) });
  });

  const setBillingInfoToForm = (client: SearchClient) => {
    setValue('billingName', client.billingName);
    setValue('billingReceiptType', client.billingReceiptType);
    setValue('billingDocumentNumberType', client.billingDocumentNumberType);
    setValue('billingDocumentNumber', client.billingDocumentNumber ?? '');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear comprobante</DialogTitle>
          <DialogDescription>
            Registra un comprobante para la orden {order.id.slice(0, 8)}. El importe inicia con el total de la orden y
            puedes ajustarlo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              startAdornment={CURRENCY_SYMBOL}
              label="Importe"
              type="number"
              min="0.01"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              error={errors.amount?.message}
            />
            <SelectField
              label="Estado inicial"
              value={statusField.value}
              onChange={(value) => {
                statusField.onChange(value);
                if (value === 'PENDING') setValue('code', '');
              }}
              error={errors.status?.message}
              options={[
                { id: 'PENDING', label: 'Pendiente' },
                { id: 'ISSUED', label: 'Emitido' }
              ]}
            />
          </div>

          <div className="sm:col-span-2">
            <ExistingBillingSearchBar setClientData={setBillingInfoToForm} />
          </div>

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
                  setValue('billingDocumentNumberType', order.client.documentNumberType ?? 'SIN DOCUMENTO', {
                    shouldDirty: true
                  });
                }
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
                  if (value === 'SIN DOCUMENTO') setValue('billingDocumentNumber', '', { shouldDirty: true });
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

          {statusField.value === 'ISSUED' && (
            <div className="space-y-2">
              <InputField
                label="Código del comprobante"
                placeholder={receiptTypeField.value === 'FACTURA' ? 'E001-0001' : 'EB01-0001'}
                autoComplete="off"
                {...register('code')}
                error={errors.code?.message}
              />
              <p className="text-xs text-muted-foreground">
                Formato: {receiptTypeField.value === 'FACTURA' ? 'E001-####' : 'EB01-####'}.
              </p>
            </div>
          )}

          <TextareaField label="Nota (opcional)" maxLength={600} {...register('note')} error={errors.note?.message} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={createBilling.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createBilling.isPending}>
              {createBilling.isPending ? 'Guardando...' : 'Crear comprobante'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
