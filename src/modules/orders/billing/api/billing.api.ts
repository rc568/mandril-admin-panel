import { baseApi } from '@/lib/axios/api';
import type {
  CreateBillingRequest,
  CreateBillingResponse,
  DeleteBillingRequest,
  DeleteBillingResponse,
  IssueBillingRequest,
  IssueBillingResponse,
  UpdateBillingRequest,
  UpdateBillingResponse,
  VoidBillingRequest,
  VoidBillingResponse
} from '../interfaces/api';

export const createBilling = async ({ orderId, body }: CreateBillingRequest) => {
  const response = await baseApi.post<CreateBillingResponse>(`/orders/${orderId}/billing`, body);
  return response.data;
};

export const deleteBilling = async ({ id }: DeleteBillingRequest) => {
  const response = await baseApi.delete<DeleteBillingResponse>(`/billing/${id}`);
  return response.data;
};

export const updateBilling = async ({ id, body }: UpdateBillingRequest) => {
  const response = await baseApi.patch<UpdateBillingResponse>(`/billing/${id}`, body);
  return response.data;
};

export const issueBilling = async ({ id, body }: IssueBillingRequest) => {
  const response = await baseApi.patch<IssueBillingResponse>(`/billing/${id}/issue`, body);
  return response.data;
};

export const voidBilling = async ({ id }: VoidBillingRequest) => {
  const response = await baseApi.patch<VoidBillingResponse>(`/billing/${id}/void`);
  return response.data;
};
