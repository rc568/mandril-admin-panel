import { useApiMutation } from '@/hooks/common/useApiMutation';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { createOrderAction } from '@/modules/orders/actions/create-order.action';
import type { CreateOrder } from '@/modules/orders/interfaces/api/create-order.interface';
import type { CreateOrderPayload } from '@/modules/orders/interfaces/ui/create-order-form.interface';

import { messages } from '@/modules/orders/constants/order.messages';
import { ordersKeys } from './orders.keys';

export const useOrderMutation = () => {
  const createOrder = useApiMutation<CreateOrder, CreateOrderPayload>({
    mutationFn: createOrderAction,
    successMessage: messages.ORDER_CREATED,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersKeys.lists() })
  });

  return {
    createOrder
  };
};
