import type { SearchClient } from './client.interface';

export interface GetSearchClientQueryParams {
  q: string;
}

export interface GetSearchClientsApiResponse {
  clients: SearchClient[];
}
