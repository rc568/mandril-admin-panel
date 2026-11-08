import type { GetOrdersFilters } from '@/modules/orders/interfaces/ui';

export const ordersKeys = {
  all: ['orders'] as const,
  lists: () => [...ordersKeys.all, 'list'] as const,
  list: (filters: GetOrdersFilters) => [...ordersKeys.lists(), filters] as const,
  details: () => [...ordersKeys.all, 'detail'] as const,
  detail: (id?: string) => [...ordersKeys.details(), id] as const
};
