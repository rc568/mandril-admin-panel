import { getSearchClientsAction } from '@/services/client/get-search-clients.action';
import type { GetSearchClientQueryParams } from '@/services/client/interfaces/get-search-clients.interface';
import { useQuery } from '@tanstack/react-query';
import { clientsKeys } from './clients.keys';

interface Props {
  params?: GetSearchClientQueryParams;
  enabled?: boolean;
}

export const useSearchClients = ({ params, enabled = true }: Props) => {
  return useQuery({
    queryKey: clientsKeys.searchQuery(params),
    queryFn: () => getSearchClientsAction(params),
    staleTime: 1000 * 60 * 5,
    enabled: enabled
  });
};
