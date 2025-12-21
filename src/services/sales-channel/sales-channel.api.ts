import { baseApi } from '@/lib/axios/api';
import type { GetSalesChannelApiResponse } from './interfaces/get-all-sales-channel.interface';

export const getSalesChannel = async () => {
  const response = await baseApi.get<GetSalesChannelApiResponse>('/sales-channel');
  return response.data;
};
