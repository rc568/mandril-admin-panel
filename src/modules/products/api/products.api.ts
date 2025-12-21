import { baseApi } from '@/lib/axios/api';
import type { GetProductsApiResponse } from '../interfaces/api/get-products.interface';
import type { GetProductsFilters } from '../interfaces/ui/get-products-filters.interface';

export const getProducts = async (params: GetProductsFilters) => {
  const response = await baseApi.get<GetProductsApiResponse>('/products', {
    params: params
  });

  return response.data;
};
