import { getProductByIdAction } from '@/modules/products/actions/get-product-by-id.action';
import { useQuery } from '@tanstack/react-query';
import { productKeys } from './products.keys';

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductByIdAction(id!),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!id
  });
};
