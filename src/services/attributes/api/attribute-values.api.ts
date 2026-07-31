import { baseApi } from '@/lib/axios/api';
import type { GetAttributeValuesApiResponse } from '../interfaces/api';

export const getAttributeValues = async (id: number) => {
  const response = await baseApi.get<GetAttributeValuesApiResponse>(`attributes/${id}/values`);
  return response.data;
};
