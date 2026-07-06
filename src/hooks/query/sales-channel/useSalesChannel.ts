import { getAllSalesChannel } from '@/services/sales-channel/get-all-sales-channel.action';
import { useQuery } from '@tanstack/react-query';
import { salesChannelKeys } from './sales-channel.keys';

export const useSalesChannel = () => {
  return useQuery({
    queryKey: salesChannelKeys.all,
    queryFn: getAllSalesChannel,
    staleTime: 1000 * 60 * 60
  });
};
