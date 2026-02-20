import type { GetProductsFilters } from '@/modules/products/interfaces/ui/get-products-filters.interface';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: GetProductsFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug?: string) => [...productKeys.details(), slug] as const
};
