import { baseApi } from '@/lib/axios/api';
import type { CreateOrder, GetOrdersApiResponse, GetOrdersQueryParams } from '../interfaces/api';
import type { CreateOrderPayload } from '../interfaces/ui';

export const getOrders = async (params: GetOrdersQueryParams) => {
  const response = await baseApi.get<GetOrdersApiResponse>('/orders', {
    params: params
  });

  return response.data;
};

export const createOrder = async (body: CreateOrderPayload) => {
  const response = await baseApi.post<CreateOrder>('/orders', body);
  return response.data;
};
