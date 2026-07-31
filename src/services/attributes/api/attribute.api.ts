import { baseApi } from '@/lib/axios/api';
import type { GetAttributeByIdApiResponse, GetAttributesApiResponse } from '../interfaces/api';

export const getAttributes = async () => {
  const response = await baseApi.get<GetAttributesApiResponse>('/attributes');
  return response.data;
};

export const getAttributeById = async (id: number) => {
  const response = await baseApi.get<GetAttributeByIdApiResponse>(`/attributes/${id}`);
  return response.data;
};
