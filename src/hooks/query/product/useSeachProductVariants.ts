import { getSearchProductVariantsAction } from '@/modules/products/actions';
import type { GetSearchProductVariantsFilters } from '@/modules/products/interfaces/ui';
import { useQuery } from '@tanstack/react-query';
import { productKeys } from './products.keys';

interface Props {
  filters?: GetSearchProductVariantsFilters;
  enabled?: boolean;
}

export const useSearchProductVariants = ({ filters, enabled = true }: Props) => {
  return useQuery({
    queryKey: productKeys.searchVariant(filters ?? {}),
    queryFn: () => getSearchProductVariantsAction(filters),
    staleTime: 1000 * 60 * 5,
    enabled: enabled
  });
};
