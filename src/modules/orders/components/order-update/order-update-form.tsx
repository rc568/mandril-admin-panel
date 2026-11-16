import { InputField, SelectField, TextareaField } from '@/components/common/form';
import { FormErrorMessage } from '@/components/common/form-error-message';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSalesChannel } from '@/hooks/query/sales-channel';
import { FormProvider, useController, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
  CLIENT_DOCUMENT_TYPE_CONFIG,
  CLIENT_ONLY_DOCUMENT_TYPE_KEYS,
  ORDER_STATUS_OPTIONS_ARRAY
} from '../../constants/order.constants';
import { messages } from '../../constants/order.messages';
import { useOrderUpdateSubmit } from '../../hooks/use-order-update-submit';
import type { Order } from '../../interfaces/api';
import { mapOrderToUpdateForm } from '../../mappers/order-to-update-form.mapper';
import { UpdateOrderProducts } from './update-order-products';

interface Props {
  order: Order;
  salesChannelId: number;
}

export const OrderUpdateForm = ({ order, salesChannelId }: Props) => {
  const navigate = useNavigate();
  const { data: salesChannels } = useSalesChannel();
  const defaultValues = mapOrderToUpdateForm(order, salesChannelId);
  const { form, onSubmit, isPending, isNoChangesTooltipOpen } = useOrderUpdateSubmit({
    orderId: order.id,
    defaultValues,
    onUpdateSuccess: () => navigate('/ventas')
  });
  const {
    control,
    register,
    formState: { errors },
  } = form;
  const { fields: productFields, append, remove } = useFieldArray({ control, name: 'products' });
  const { field: statusField } = useController({ name: 'status', control });
  const { field: salesChannelField } = useController({ name: 'salesChannelId', control });
  const { field: documentTypeField } = useController({ name: 'client.documentNumberType', control });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="my-6 space-y-6">
        <section className="space-y-4 rounded-lg border p-4">
          <div>
            <h2 className="font-semibold">Datos de la orden</h2>
            <p className="text-sm text-muted-foreground">
              Puedes actualizar los campos disponibles. El stock se valida nuevamente al guardar.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Canal de venta"
              value={String(salesChannelField.value ?? '')}
              onChange={(value) => salesChannelField.onChange(Number(value))}
              error={errors.salesChannelId?.message}
              options={salesChannels?.map((channel) => ({ id: channel.id, label: channel.channel }))}
            />
            <SelectField
              label="Estado"
              value={statusField.value}
              onChange={statusField.onChange}
              error={errors.status?.message}
              options={ORDER_STATUS_OPTIONS_ARRAY.filter(
                (status) => status.key === 'PENDING' || status.key === 'PAID'
              ).map((status) => ({ id: status.key, label: status.label }))}
            />
          </div>
          <TextareaField
            label="Observaciones"
            {...register('observation')}
            placeholder="Detalles adicionales sobre la venta..."
            error={errors.observation?.message}
          />
          {order.observation && (
            <p className="text-xs text-muted-foreground">El servicio no permite borrar observaciones ya registradas.</p>
          )}
        </section>

        <section className="space-y-4 rounded-lg border p-4">
          <div>
            <h2 className="font-semibold">Datos del cliente</h2>
            <p className="text-sm text-muted-foreground">
              Estos datos se actualizan sobre el cliente asociado a esta orden. El servicio no permite borrar valores ya
              registrados.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              autoComplete="email"
              error={errors.client?.email?.message}
            />

            <InputField
              label="Celular"
              {...register('client.phoneNumber1')}
              placeholder="+51912345678"
              autoComplete="tel"
              error={errors.client?.phoneNumber1?.message}
            />

            <InputField
              label="Celular adicional"
              {...register('client.phoneNumber2')}
              placeholder="+51912345679"
              autoComplete="off"
              error={errors.client?.phoneNumber2?.message}
            />

            <SelectField
              label="Tipo de documento del cliente"
              value={documentTypeField.value ?? ''}
              onChange={documentTypeField.onChange}
              error={errors.client?.documentNumberType?.message}
              options={CLIENT_ONLY_DOCUMENT_TYPE_KEYS.map((documentType) => ({
                id: documentType,
                label: CLIENT_DOCUMENT_TYPE_CONFIG[documentType].label
              }))}
            />

            <InputField
              label="Número de documento"
              {...register('client.documentNumber')}
              placeholder="Número de documento"
              autoComplete="off"
              disabled={!documentTypeField.value}
              error={errors.client?.documentNumber?.message}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border p-4">
          <div>
            <h2 className="font-semibold">Productos</h2>
            <p className="text-sm text-muted-foreground">
              Ajusta cantidades y precios o agrega productos disponibles. Debe quedar al menos un producto.
            </p>
          </div>
          <UpdateOrderProducts
            products={productFields}
            addProduct={(product) => append(product)}
            deleteProduct={remove}
            control={control}
            register={register}
            errors={errors}
          />
        </section>

        <Separator />
        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <Button type="button" variant="outline" disabled={isPending} onClick={() => navigate('/ventas')}>
            Volver a ventas
          </Button>
          <Tooltip open={isNoChangesTooltipOpen}>
            <TooltipTrigger asChild>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" variant="outline" size="md">
              <p>{messages.ORDER_NOT_MODIFIED}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </form>
    </FormProvider>
  );
};
