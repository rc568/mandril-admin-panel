import { useHandleTooltip } from '@/hooks/common/useHandleTooltip';
import { useOrderMutation } from '@/hooks/query/order';
import { isEmptyPlainObject } from '@/lib/object-utils';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { messages } from '../constants/order.messages';
import type { UpdateOrderForm } from '../interfaces/ui';
import { getOrderUpdatePayload } from '../utils/order-update-payload';
import { updateOrderSchema } from '../validators/order.validators';

interface Props {
  orderId: string;
  defaultValues: UpdateOrderForm;
  onUpdateSuccess: () => void;
}

export const useOrderUpdateSubmit = ({ orderId, defaultValues, onUpdateSuccess }: Props) => {
  const { updateOrder } = useOrderMutation();
  const { open: isNoChangesTooltipOpen, show: showNoChangesTooltip } = useHandleTooltip();
  const form = useForm<UpdateOrderForm>({
    resolver: standardSchemaResolver(updateOrderSchema),
    defaultValues
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { payload, hasUnsupportedClearing } = getOrderUpdatePayload(data, defaultValues);

    if (hasUnsupportedClearing) {
      toast.error(messages.ORDER_FIELDS_CANNOT_BE_CLEARED);
      return;
    }

    if (isEmptyPlainObject(payload)) {
      showNoChangesTooltip();
      return;
    }

    await updateOrder.mutateAsync({ id: orderId, body: payload }, { onSuccess: onUpdateSuccess });
  });

  return {
    form,
    onSubmit,
    isPending: updateOrder.isPending,
    isNoChangesTooltipOpen
  };
};
