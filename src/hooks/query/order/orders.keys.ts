import type { GetOrdersFilters } from '@/modules/orders/interfaces/ui/get-orders-filters.interface';

export const ordersKeys = {
  all: ['orders'] as const,
  lists: () => [...ordersKeys.all, 'list'] as const,
  list: (filters: GetOrdersFilters) => [...ordersKeys.lists(), filters] as const
};
