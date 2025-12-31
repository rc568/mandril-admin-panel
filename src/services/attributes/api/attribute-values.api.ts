import { baseApi } from '@/lib/axios/api';
import type { GetAttributeValuesApiResponse } from '../interfaces/get-attribute-values.interface';

export const getAttributeValues = async (id: number) => {
  const response = await baseApi.get<GetAttributeValuesApiResponse>(`attributes/${id}/values`);
  return response.data;
};
