import { baseApi } from '@/lib/axios/api';
import type { GetProductById } from '../interfaces/api/get-product.interface';
import type { GetProductsApiResponse } from '../interfaces/api/get-products.interface';
import type { GetProductsFilters } from '../interfaces/ui/get-products-filters.interface';

export const getProducts = async (params: GetProductsFilters) => {
  const response = await baseApi.get<GetProductsApiResponse>('/products', {
    params: params
  });

  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await baseApi.get<GetProductById>(`/products/${id}`);
  return response.data;
};
