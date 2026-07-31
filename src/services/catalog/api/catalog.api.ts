import { baseApi } from '@/lib/axios/api';
import type { GetCatalogsApiResponse } from '../interfaces/api';

export const getCatalogs = async () => {
  const response = await baseApi.get<GetCatalogsApiResponse>('/catalogs');
  return response.data;
};
