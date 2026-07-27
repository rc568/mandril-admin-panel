import type { GetSearchClientQueryParams } from '@/services/client/interfaces/get-search-clients.interface';

export const clientsKeys = {
  all: ['clients'] as const,
  searchQueryList: () => [...clientsKeys.all, 'list'] as const,
  searchQuery: (params?: GetSearchClientQueryParams) => [...clientsKeys.searchQueryList(), params] as const
};
