import { getSearchProductVariantsAction } from '@/modules/products/actions/get-search-product-variants.action';
import type { GetSearchProductVariantsFilters } from '@/modules/products/interfaces/ui/get-search-product-variants-filters.interface';
import { useQuery } from '@tanstack/react-query';
import { productKeys } from './products.keys';

export const useSearchProductVariants = (filters?: GetSearchProductVariantsFilters) => {
  return useQuery({
    queryKey: productKeys.searchVariant(filters ?? {}),
    queryFn: () => getSearchProductVariantsAction(filters),
    staleTime: 1000 * 60 * 5
  });
};
