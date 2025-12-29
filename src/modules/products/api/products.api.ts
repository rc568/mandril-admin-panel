import { baseApi } from '@/lib/axios/api';
import type { CreateProduct } from '../interfaces/api/create-product.interface';
import type { GetProductById } from '../interfaces/api/get-product.interface';
import type { GetProductsApiResponse } from '../interfaces/api/get-products.interface';
import type { CreateProductForm } from '../interfaces/ui/create-product-form.interface';
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

export const createProduct = async (body: CreateProductForm) => {
  const response = await baseApi.post<CreateProduct>('/products', body);
  return response.data;
};
