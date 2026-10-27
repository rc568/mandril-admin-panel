import { baseApi } from '@/lib/axios/api';
import type { AdjustInventoryPayload, AdjustInventoryResponse } from '../interfaces/api';

export const adjustInventory = async (body: AdjustInventoryPayload) => {
  const response = await baseApi.post<AdjustInventoryResponse>('/inventory/adjustments', body);
  return response.data;
};
