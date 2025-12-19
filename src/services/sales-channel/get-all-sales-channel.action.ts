import type { GetSalesChannelApiResponse } from './interfaces/get-all-sales-channel.interface';
import { salesChannelApi } from './sales-channel.api';

export const getAllSalesChannel = async () => {
  const response = await salesChannelApi.get<GetSalesChannelApiResponse>('/');
  return response.data.data;
};
