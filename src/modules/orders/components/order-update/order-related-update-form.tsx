import { SelectField, TextareaField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useHandleTooltip } from '@/hooks/common/useHandleTooltip';
import { useOrderMutation } from '@/hooks/query/order';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useController, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { messages } from '../../constants/order.messages';
import type { Order } from '../../interfaces/api';
import type { UpdateRelatedOrderForm as UpdateRelatedOrderFormValues } from '../../interfaces/ui';
import { updateRelatedOrderSchema } from '../../validators/order.validators';

interface Props {
  order: Order;
  salesChannelId: number;
  salesChannels: { id: number; channel: string }[];
}

export const OrderRelatedUpdateForm = ({ order, salesChannelId, salesChannels }: Props) => {
  const navigate = useNavigate();
  const { updateOrder } = useOrderMutation();
  const { open: isNoChangesTooltipOpen, show: showNoChangesTooltip } = useHandleTooltip();
  const initialObservation = order.observation ?? '';
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateRelatedOrderFormValues>({
    resolver: standardSchemaResolver(updateRelatedOrderSchema),
    defaultValues: {
      salesChannelId,
      observation: initialObservation
    }
  });
  const { field: salesChannelField } = useController({ name: 'salesChannelId', control });

  const onSubmit = handleSubmit(async (values) => {
    const payload: { salesChannelId?: number; observation?: string } = {};

    if (values.salesChannelId !== salesChannelId) payload.salesChannelId = values.salesChannelId;

    const observation = values.observation?.trim() ?? '';
    if (observation !== initialObservation.trim()) {
      if (!observation && initialObservation) {
        toast.error(messages.ORDER_FIELDS_CANNOT_BE_CLEARED);
        return;
      }
      if (observation) payload.observation = observation;
    }

    if (Object.keys(payload).length === 0) {
      showNoChangesTooltip();
      return;
    }

    await updateOrder.mutateAsync({ id: order.id, body: payload }, { onSuccess: () => navigate('/ventas') });
  });

  return (
    <form onSubmit={onSubmit} className="my-6 space-y-6">
      <section className="space-y-4 rounded-lg border p-4">
        <div>
          <h2 className="font-semibold">Datos de la orden</h2>
          <p className="text-sm text-muted-foreground">
            En órdenes de cambio y devolución puedes actualizar el canal de venta y las observaciones.
          </p>
        </div>
        <SelectField
          label="Canal de venta"
          value={String(salesChannelField.value ?? '')}
          onChange={(value) => salesChannelField.onChange(Number(value))}
          error={errors.salesChannelId?.message}
          options={salesChannels.map((channel) => ({ id: channel.id, label: channel.channel }))}
        />
        <TextareaField
          label="Observaciones"
          {...register('observation')}
          placeholder="Detalles adicionales sobre la orden..."
          error={errors.observation?.message}
        />
        {order.observation && (
          <p className="text-xs text-muted-foreground">El servicio no permite borrar observaciones ya registradas.</p>
        )}
      </section>

      <Separator />
      <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
        <Button type="button" variant="outline" disabled={updateOrder.isPending} onClick={() => navigate('/ventas')}>
          Volver a ventas
        </Button>
        <Tooltip open={isNoChangesTooltipOpen}>
          <TooltipTrigger asChild>
            <Button type="submit" disabled={updateOrder.isPending}>
              {updateOrder.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" variant="outline" size="md">
            <p>{messages.ORDER_NOT_MODIFIED}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </form>
  );
};
