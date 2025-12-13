import { catalogApi } from './catalog.api';
import type { Catalog } from './interfaces/catalog.interface';
import type { GetCatalogsApiResponse } from './interfaces/get-all-catalogs.interface';

export const getAllCatalogs = async (): Promise<Catalog[]> => {
  const response = await catalogApi.get<GetCatalogsApiResponse>('/');
  return response.data.data.sort((a, b) => a.name.localeCompare(b.name));
};
