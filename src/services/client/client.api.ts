import { baseApi } from '@/lib/axios/api';
import type {
  GetSearchClientQueryParams,
  GetSearchClientsApiResponse
} from './interfaces/get-search-clients.interface';

export const getSearchClients = async (params?: GetSearchClientQueryParams) => {
  const response = await baseApi.get<GetSearchClientsApiResponse>('/clients/search', { params: params });
  return response.data;
};
