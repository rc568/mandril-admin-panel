import { InputField, SelectField, TextareaField } from '@/components/common/form';
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
import { ShoppingCart, User } from 'lucide-react';
import { useEffect } from 'react';
import { useController, useFieldArray, useForm, type Path } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  CLIENT_DOCUMENT_TYPE_CONFIG,
  CLIENT_ONLY_DOCUMENT_TYPE_KEYS,
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
  const navigate = useNavigate();
  const {
    register,
    control,
    formState: { errors },
    setValue,
    resetField,
    handleSubmit,
    reset
  } = useForm<CreateOrderForm>({
    resolver: standardSchemaResolver(createOrderSchema),
    defaultValues: {
      status: 'PENDING'
      // client: {}
    }
  });

  const { fields: productFields, append, remove } = useFieldArray({ control, name: 'products' });
  const { field: statusField } = useController({ name: 'status', control });
  const { field: documentTypeField } = useController({ name: 'client.documentNumberType', control });
  const { createOrder } = useOrderMutation();

  const setClientInfoToForm = (client: SearchClient) => {
    setValue('client.contactName', client.contactName ?? '');
    setValue('client.email', client.email ?? '');
    setValue('client.phoneNumber1', client.phoneNumber1 ?? '');
    setValue('client.phoneNumber2', client.phoneNumber2 ?? '');
    if (client.documentNumberType && client.documentNumber) {
      setValue('client.documentNumberType', client.documentNumberType);
      setValue('client.documentNumber', client.documentNumber);
    } else {
      resetField('client.documentNumberType');
      resetField('client.documentNumber');
    }
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
        reset();
        onOpenChange(false);
        navigate('/ventas');
      }
    });
  };

  useEffect(() => {
    if (documentTypeField.value) return;
    resetField('client.documentNumber');
  }, [documentTypeField.value, resetField]);

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
                error={errors.status?.message}
                options={ORDER_STATUS_OPTIONS_ARRAY.filter((status) => status.key !== 'CANCELLED').map((status) => ({
                  id: status.key,
                  label: status.label
                }))}
              />
            </section>

            <Separator />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 sm:col-span-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Datos del cliente</h3>
              </div>

              <div className="sm:col-span-2">
                <ExistingClientsSearchBar setClientData={setClientInfoToForm} />
              </div>

              {errors.client?.message && <FormErrorMessage text={String(errors.client.message)} />}

              <InputField
                label="Nombre de contacto"
                {...register('client.contactName')}
                placeholder="Nombre completo"
                autoComplete="off"
                error={errors.client?.contactName?.message}
              />

              <InputField
                label="Email"
                {...register('client.email')}
                placeholder="ejemplo@correo.com"
                autoComplete="off"
                error={errors.client?.email?.message}
              />

              <InputField
                label="Celular"
                {...register('client.phoneNumber1')}
                placeholder="+51912345678"
                autoComplete="off"
                error={errors.client?.phoneNumber1?.message}
              />

              <InputField
                label="Celular (adicional)"
                {...register('client.phoneNumber2')}
                placeholder="+51912345679"
                autoComplete="off"
                error={errors.client?.phoneNumber2?.message}
              />

              <SelectField
                label="Tipo de documento del cliente"
                value={documentTypeField.value ?? ''}
                onChange={(value) => {
                  documentTypeField.onChange(value === '__clear__' ? null : value);
                }}
                error={errors.client?.documentNumberType?.message}
                options={[
                  {
                    id: '__clear__',
                    label: 'Sin documento'
                  },
                  ...CLIENT_ONLY_DOCUMENT_TYPE_KEYS.map((documentType) => ({
                    id: documentType,
                    label: CLIENT_DOCUMENT_TYPE_CONFIG[documentType].label
                  }))
                ]}
              />

              <InputField
                label="Número de documento del cliente"
                {...register('client.documentNumber')}
                placeholder="Número de documento"
                autoComplete="off"
                disabled={!documentTypeField.value}
                error={errors.client?.documentNumber?.message}
              />
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
              <Button type="submit" disabled={createOrder.isPending}>
                Agregar venta
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
