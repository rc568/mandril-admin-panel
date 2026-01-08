import { createProductAction } from '@/modules/products/actions/create-product.action';
import { useMutation } from '@tanstack/react-query';

export const useProduct = () => {
  const mutation = useMutation({ mutationFn: createProductAction });

  return {
    mutation
  };
};
