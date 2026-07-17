import { getOrdersByPage } from '@/modules/orders/actions/get-orders-by-page.actions';
import type { GetOrdersFilters } from '@/modules/orders/interfaces/ui/get-orders-filters.interface';
import { useQuery } from '@tanstack/react-query';
import { ordersKeys } from './orders.keys';

export const useOrders = (filters: GetOrdersFilters) => {
  return useQuery({
    queryKey: ordersKeys.list(filters),
    queryFn: () => getOrdersByPage(filters),
    staleTime: 1000 * 60 * 5
  });
};
