import { baseApi } from '@/lib/axios/api';
import type { GetCatalogsApiResponse } from './interfaces/get-all-catalogs.interface';

export const getCatalogs = async () => {
  const response = await baseApi.get<GetCatalogsApiResponse>('/catalogs');
  return response.data;
};
