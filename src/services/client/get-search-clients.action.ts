import { getSearchClients } from './client.api';
import type { GetSearchClientQueryParams } from './interfaces/get-search-clients.interface';

export const getSearchClientsAction = async (params?: GetSearchClientQueryParams) => await getSearchClients(params);
