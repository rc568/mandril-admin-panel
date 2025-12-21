import { baseApi } from '@/lib/axios/api';
import type { GetOrdersApiResponse, GetOrdersQueryParams } from '../interfaces/api/get-orders.interface';

export const getOrders = async (params: GetOrdersQueryParams) => {
  const response = await baseApi.get<GetOrdersApiResponse>('/orders', {
    params: params
  });

  return response.data;
};
