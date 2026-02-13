import { useApiMutation } from '@/hooks/common/useApiMutation';
import { createProductAction } from '@/modules/products/actions/create-product.action';
import { editProductAction } from '@/modules/products/actions/edit-product.action';
import { messages } from '@/modules/products/constants/products.messages';
import type { ProductMapped } from '@/modules/products/interfaces/api/get-products-mapped.interface';
import type {
  CreateProductForm,
  EditProductForm
} from '@/modules/products/interfaces/ui/create-product-form.interface';

export const useProduct = () => {
  const createProduct = useApiMutation<ProductMapped, CreateProductForm>({
    mutationFn: createProductAction,
    successMessage: messages.PRODUCT_CREATED
  });

  const editMutation = useApiMutation<ProductMapped, { id: number; body: EditProductForm }>({
    mutationFn: editProductAction,
    successMessage: messages.PRODUCT_UPDATED
  });

  return {
    createProduct,
    editMutation
  };
};
