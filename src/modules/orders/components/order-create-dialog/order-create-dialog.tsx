import { CheckboxField, InputField, SelectField, TextareaField } from '@/components/common/form';
import { FormErrorMessage } from '@/components/common/form-error-message';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { commonMessages } from '@/constants/messages';
import { useOrderMutation } from '@/hooks/query/order';
import { filterNullishFields } from '@/lib/react-hook-form/utils';
import type { SearchClient } from '@/services/client/interfaces/client.interface';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { ReceiptText, ShoppingCart, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useForm, useWatch, type Path } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  CLIENT_DOCUMENT_TYPE_CONFIG,
  CLIENT_DOCUMENT_TYPE_KEYS,
  INVOICE_TYPE_CONFIG,
  INVOICE_TYPE_KEYS,
  ORDER_STATUS_OPTIONS_ARRAY
} from '../../constants/order.constants';
import type { CreateOrderForm, CreateOrderPayload } from '../../interfaces/ui';
import { createOrderSchema } from '../../validators/order.validators';
import { AddOrderProducts } from './add-order-products';
import { ExistingClientsSearchBar } from './existing-clients-search-bar';
import { SalesChannelSelectInput } from './sales-channel-select-input';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderCreateDialog = ({ open, onOpenChange }: Props) => {
  const [hasInvoice, setHasInvoice] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    formState: { errors },
    setValue,
    resetField,
    handleSubmit
  } = useForm<CreateOrderForm>({
    resolver: standardSchemaResolver(createOrderSchema),
    defaultValues: {
      status: 'PENDING',
      invoiceType: 'SIN COMPROBANTE',
      client: { documentType: 'SIN DOCUMENTO' }
    }
  });

  const { fields: productFields, append, remove } = useFieldArray({ control, name: 'products' });

  const { field: statusField } = useController({ name: 'status', control: control });
  const { field: invoiceTypeField } = useController({ name: 'invoiceType', control: control });
  const { field: documentType } = useController({ name: 'client.documentType', control: control });

  const invoiceTypeWatch = useWatch({ control: control, name: 'invoiceType' });
  const documentTypeWatch = useWatch({ control: control, name: 'client.documentType' });

  const { createOrder } = useOrderMutation();

  const toggleInvoice = () => {
    setHasInvoice((prev) => {
      const newState = !prev;

      if (!newState) {
        resetField('invoiceType');
        resetField('client.documentType');
      }

      return newState;
    });
  };

  const onSubmit = async (data: CreateOrderForm) => {
    const filtered = filterNullishFields(data);

    let payload: CreateOrderPayload;

    try {
      payload = await createOrderSchema.parseAsync(filtered);
    } catch {
      toast.error(commonMessages.UNEXPECTED_ERROR);
      return;
    }

    await createOrder.mutateAsync(payload, {
      onSuccess: () => {
        onOpenChange(false);
        navigate(`/ventas`);
      }
    });
  };

  const setClientInfoToForm = (client: SearchClient) => {
    const { documentType } = client;

    const contactName = client.contactName ?? '';
    const email = client.email ?? '';
    const phoneNumber1 = client.phoneNumber1 ?? '';

    setValue('client.contactName', contactName);
    setValue('client.email', email);
    setValue('client.phoneNumber1', phoneNumber1);

    setHasInvoice(() => {
      const invoiceType = documentType === 'RUC' ? 'FACTURA' : 'BOLETA';

      setValue('invoiceType', invoiceType);
      setValue('client.documentType', client.documentType);
      setValue('client.documentNumber', client.documentNumber);
      setValue('client.bussinessName', client.bussinessName);

      return true;
    });
  };

  useEffect(() => {
    if (invoiceTypeWatch === 'FACTURA') {
      setValue('client.documentType', 'RUC');
    }

    if (documentTypeWatch === 'SIN DOCUMENTO') {
      resetField('client.documentNumber');
    }
  }, [invoiceTypeWatch, documentTypeWatch, setValue, resetField]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-5/6 overflow-y-scroll" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Nueva venta</DialogTitle>
          <DialogDescription>Registra los detalles de la venta</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SalesChannelSelectInput<CreateOrderForm>
                control={control}
                name={'salesChannelId' as Path<CreateOrderForm>}
                error={errors.salesChannelId?.message}
              />

              <SelectField
                label="Estado"
                value={statusField.value}
                onChange={statusField.onChange}
                error={errors?.status?.message}
                options={ORDER_STATUS_OPTIONS_ARRAY.map((s) => ({ id: s.key, label: s.label }))}
              />
            </section>

            <Separator />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Datos del cliente</h3>
              </div>

              <div className=" sm:col-span-2">
                <ExistingClientsSearchBar setClientData={setClientInfoToForm} />
              </div>

              <div className="sm:col-span-2">
                <InputField
                  label={'Nombre de contacto'}
                  {...register('client.contactName')}
                  placeholder="Nombre completo"
                  autoComplete="off"
                  error={errors.client?.contactName?.message}
                />
              </div>

              <InputField
                label={'Celular'}
                {...register('client.phoneNumber1')}
                placeholder="+51 9XX XXX XXX"
                autoComplete="off"
                error={errors.client?.phoneNumber1?.message}
              />

              <InputField
                label={'Email'}
                {...register('client.email')}
                placeholder="ejemplo@correo.com"
                autoComplete="off"
                error={errors.client?.email?.message}
              />
            </section>

            <Separator />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 justify-between col-span-2">
                <div className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Datos de facturación</h3>
                </div>
                <CheckboxField
                  label="Cliente solicita comprobante"
                  checked={hasInvoice}
                  onCheckedChange={() => toggleInvoice()}
                />
              </div>

              {hasInvoice ? (
                <>
                  <SelectField
                    label="Tipo de comprobante"
                    value={invoiceTypeField.value}
                    onChange={invoiceTypeField.onChange}
                    error={errors?.invoiceType?.message}
                    options={INVOICE_TYPE_KEYS.filter((invoice) => invoice !== 'SIN COMPROBANTE').map((invoice) => ({
                      id: invoice,
                      label: INVOICE_TYPE_CONFIG[invoice].label
                    }))}
                  />

                  <InputField
                    label={'Código de comprobante'}
                    {...register('invoiceCode')}
                    placeholder={invoiceTypeWatch === 'BOLETA' ? 'EB01-001' : 'E001-0001'}
                    autoComplete="off"
                    error={errors.invoiceCode?.message}
                  />

                  <SelectField
                    label="Tipo de documento"
                    value={documentType.value}
                    onChange={documentType.onChange}
                    error={errors?.client?.documentType?.message}
                    options={CLIENT_DOCUMENT_TYPE_KEYS.filter((document) => {
                      if (invoiceTypeWatch === 'BOLETA') return document !== 'RUC';
                      if (invoiceTypeWatch === 'FACTURA') return document === 'RUC';
                      return false;
                    }).map((document) => ({ id: document, label: CLIENT_DOCUMENT_TYPE_CONFIG[document].label }))}
                  />

                  <InputField
                    label={'Número de documento'}
                    placeholder="12345678"
                    {...register('client.documentNumber')}
                    autoComplete="off"
                    disabled={documentTypeWatch === 'SIN DOCUMENTO'}
                    error={errors.client?.documentNumber?.message}
                  />

                  <InputField
                    label={'Razón Social'}
                    placeholder="EMPRESA S.A.C."
                    className="uppercase"
                    {...register('client.bussinessName')}
                    autoComplete="off"
                    error={errors.client?.bussinessName?.message}
                  />
                </>
              ) : (
                <span className="pl-2 text-sm text-muted-foreground">Esta venta se registra sin comprobante.</span>
              )}
            </section>

            <Separator />

            <section>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="order-products" className="text-sm font-semibold">
                  Productos
                </Label>
              </div>

              {errors.products?.message && <FormErrorMessage text={String(errors.products.message)} />}

              <AddOrderProducts
                products={productFields}
                addProduct={append}
                register={register}
                control={control}
                deleteProduct={remove}
              />
            </section>

            <Separator />

            <section>
              <TextareaField
                label="Observaciones"
                {...register('observation')}
                placeholder="Detalles adicionales sobre la venta..."
                autoComplete="off"
                error={errors.observation?.message}
              />
            </section>

            <div className="text-right">
              <Button type="submit">Agregar venta</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
