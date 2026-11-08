import { useApiMutation } from '@/hooks/common/useApiMutation';
import { queryClient } from '@/lib/tanstack-query/query-client';
import {
  cancelOrderAction,
  completeOrderAction,
  createOrderAction,
  softDeleteOrderAction,
  updateOrderAction
} from '@/modules/orders/actions';
import { messages } from '@/modules/orders/constants/order.messages';
import type {
  CancelOrderResponse,
  CompleteOrderRequest,
  CompleteOrderResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  SoftDeleteOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse
} from '@/modules/orders/interfaces/api';
import { ordersKeys } from './orders.keys';

const invalidateOrders = () => queryClient.invalidateQueries({ queryKey: ordersKeys.all });

export const useOrderMutation = () => {
  const createOrder = useApiMutation<CreateOrderResponse, CreateOrderPayload>({
    mutationFn: createOrderAction,
    successMessage: messages.ORDER_CREATED,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersKeys.lists() })
  });

  const updateOrder = useApiMutation<UpdateOrderResponse, UpdateOrderRequest>({
    mutationFn: updateOrderAction,
    onSuccess: invalidateOrders
  });

  const cancelOrder = useApiMutation<CancelOrderResponse, string>({
    mutationFn: cancelOrderAction,
    onSuccess: invalidateOrders
  });

  const completeOrder = useApiMutation<CompleteOrderResponse, CompleteOrderRequest>({
    mutationFn: completeOrderAction,
    onSuccess: invalidateOrders
  });

  const softDeleteOrder = useApiMutation<SoftDeleteOrderResponse, string>({
    mutationFn: softDeleteOrderAction,
    onSuccess: invalidateOrders
  });

  return {
    updateOrder,
    cancelOrder,
    completeOrder,
    softDeleteOrder,
    createOrder
  };
};
