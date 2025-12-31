import { baseApi } from '@/lib/axios/api';
import type { GetAttributesApiResponse } from '../interfaces/get-all-attributes.interface';
import type { GetAttributeById } from '../interfaces/get-attribute-by-id.interface';

export const getAttributes = async () => {
  const response = await baseApi.get<GetAttributesApiResponse>('/attributes');
  return response.data;
};

export const getAttributeById = async (id: number) => {
  const response = await baseApi.get<GetAttributeById>(`/attributes/${id}`);
  return response.data;
};
