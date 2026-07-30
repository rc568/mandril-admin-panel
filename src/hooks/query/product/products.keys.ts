import type { GetProductsFilters, GetSearchProductVariantsFilters } from '@/modules/products/interfaces/ui';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: GetProductsFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug?: string) => [...productKeys.details(), slug] as const,
  searchVariants: () => [...productKeys.all, 'search-variant-list'] as const,
  searchVariant: (filters: GetSearchProductVariantsFilters) => [...productKeys.searchVariants(), filters] as const
};
