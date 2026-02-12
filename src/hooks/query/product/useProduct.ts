import { createProductAction } from '@/modules/products/actions/create-product.action';
import { editProductAction } from '@/modules/products/actions/edit-product.action';
import type { ProductMapped } from '@/modules/products/interfaces/api/get-products-mapped.interface';
import type {
  CreateProductForm,
  EditProductForm
} from '@/modules/products/interfaces/ui/create-product-form.interface';
import type { ApiError } from '@/types/api/api-error';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const useProduct = () => {
  const mutation = useMutation<ProductMapped, AxiosError<ApiError>, CreateProductForm>({
    mutationFn: createProductAction
  });

  const editMutation = useMutation<ProductMapped, AxiosError<ApiError>, { id: number; body: EditProductForm }>({
    mutationFn: editProductAction
  });

  return {
    mutation,
    editMutation
  };
};
