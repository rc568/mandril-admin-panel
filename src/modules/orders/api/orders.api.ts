import { baseApi } from '@/lib/axios/api';
import type { CreateOrder } from '../interfaces/api/create-order.interface';
import type { GetOrdersApiResponse, GetOrdersQueryParams } from '../interfaces/api/get-orders.interface';
import type { CreateOrderPayload } from '../interfaces/ui/create-order-form.interface';

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
