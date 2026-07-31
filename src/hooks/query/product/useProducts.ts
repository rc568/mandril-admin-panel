import { getProductsByPage } from '@/modules/products/actions';
import type { GetProductsFilters } from '@/modules/products/interfaces/ui';
import { useQuery } from '@tanstack/react-query';
import { productKeys } from './products.keys';

interface Props {
  filters: GetProductsFilters;
}

export const useProducts = ({ filters }: Props) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProductsByPage(filters),
    staleTime: 1000 * 60 * 5
  });
};
