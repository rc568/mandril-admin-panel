import { useApiMutation } from '@/hooks/common/useApiMutation';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { createProductAction } from '@/modules/products/actions/create-product.action';
import { editProductAction } from '@/modules/products/actions/edit-product.action';
import { messages } from '@/modules/products/constants/products.messages';
import type { ProductMapped } from '@/modules/products/interfaces/api/get-products-mapped.interface';
import type {
  CreateProductForm,
  EditProductForm
} from '@/modules/products/interfaces/ui/create-product-form.interface';
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
    onSuccess: (data: ProductMapped) =>
      queryClient.invalidateQueries({ queryKey: [productKeys.detail(data.id.toString())] })
  });

  return {
    createProduct,
    editMutation
  };
};
