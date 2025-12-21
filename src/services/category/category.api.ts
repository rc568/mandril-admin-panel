import { baseApi } from '@/lib/axios/api';
import type { GetCategoriesApiResponse } from './interfaces/get-all-categories.interface';

export const getCategories = async () => {
  const response = await baseApi.get<GetCategoriesApiResponse>('/categories');
  return response.data;
};
