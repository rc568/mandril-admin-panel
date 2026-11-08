import { baseApi } from '@/lib/axios/api';
import type {
  CancelOrderResponse,
  CompleteOrderPayload,
  CompleteOrderResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  GetOrderByIdResponse,
  GetOrdersApiResponse,
  GetOrdersQueryParams,
  SoftDeleteOrderResponse,
  UpdateOrderPayload,
  UpdateOrderResponse
} from '../interfaces/api';

export const getOrders = async (params: GetOrdersQueryParams) => {
  const response = await baseApi.get<GetOrdersApiResponse>('/orders', {
    params: params
  });

  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await baseApi.get<GetOrderByIdResponse>(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (body: CreateOrderPayload) => {
  const response = await baseApi.post<CreateOrderResponse>('/orders', body);
  return response.data;
};

export const updateOrder = async (id: string, body: UpdateOrderPayload) => {
  const response = await baseApi.patch<UpdateOrderResponse>(`/orders/${id}`, body);
  return response.data;
};

export const completeOrder = async (id: string, body?: CompleteOrderPayload) => {
  const response = await baseApi.post<CompleteOrderResponse>(`/orders/${id}/complete`, body);
  return response.data;
};
export const cancelOrder = async (id: string) => {
  const response = await baseApi.post<CancelOrderResponse>(`/orders/${id}/cancel`);
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await baseApi.delete<SoftDeleteOrderResponse>(`/orders/${id}`);
  return response.data;
};
