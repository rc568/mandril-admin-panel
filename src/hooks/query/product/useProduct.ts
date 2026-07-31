import { getProductByIdAction } from '@/modules/products/actions';
import { useQuery } from '@tanstack/react-query';
import { productKeys } from './products.keys';

export const useProduct = (slug?: string) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => getProductByIdAction(slug!),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!slug
  });
};
