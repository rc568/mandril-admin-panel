import { useApiMutation } from '@/hooks/common/useApiMutation';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { createProductAction, editProductAction } from '@/modules/products/actions';
import { messages } from '@/modules/products/constants/products.messages';
import type { CreateProductForm, EditProductForm, ProductMapped } from '@/modules/products/interfaces/ui';
import { productKeys } from './products.keys';

export const useProductMutation = () => {
  const createProduct = useApiMutation<ProductMapped, CreateProductForm>({
    mutationFn: createProductAction,
    successMessage: messages.PRODUCT_CREATED,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.lists() })
  });

  const editMutation = useApiMutation<ProductMapped, { id: string; body: EditProductForm }>({
    mutationFn: editProductAction,
    successMessage: messages.PRODUCT_UPDATED,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.lists() })
  });

  return {
    createProduct,
    editMutation
  };
};
