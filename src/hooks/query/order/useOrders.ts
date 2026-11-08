import { getOrderByIdAction, getOrdersByPage } from '@/modules/orders/actions';
import type { GetOrdersFilters } from '@/modules/orders/interfaces/ui';
import { useQuery } from '@tanstack/react-query';
import { ordersKeys } from './orders.keys';

export const useOrders = (filters: GetOrdersFilters) => {
  return useQuery({
    queryKey: ordersKeys.list(filters),
    queryFn: () => getOrdersByPage(filters),
    staleTime: 1000 * 60 * 5
  });
};

export const useOrderById = (id?: string) => {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => getOrderByIdAction(id!),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: Boolean(id)
  });
};
