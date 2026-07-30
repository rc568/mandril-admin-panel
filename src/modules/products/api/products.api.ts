import { baseApi } from '@/lib/axios/api';
import type {
  CreateProductPayload,
  CreateProductResponse,
  EditProductPayload,
  EditProductResponse,
  GetProductByIdApiResponse,
  GetProductsApiResponse,
  GetProductsQueryParams,
  GetSearchProductVariantsApiResponse,
  GetSearchProductVariantsQueryParams
} from '../interfaces/api';

export const getProducts = async (params: GetProductsQueryParams) => {
  const response = await baseApi.get<GetProductsApiResponse>('/products', {
    params: params
  });

  return response.data;
};

export const getSearchProductVariants = async (params?: GetSearchProductVariantsQueryParams) => {
  const response = await baseApi.get<GetSearchProductVariantsApiResponse>('/products/variants/search', {
    params: params
  });

  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await baseApi.get<GetProductByIdApiResponse>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (body: CreateProductPayload) => {
  const response = await baseApi.post<CreateProductResponse>('/products', body);
  return response.data;
};

export const editProduct = async (id: string, body: EditProductPayload) => {
  const response = await baseApi.patch<EditProductResponse>(`/products/${id}`, body);
  return response.data;
};
