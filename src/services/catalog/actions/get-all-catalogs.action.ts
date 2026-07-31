import { getCatalogs } from '../api/catalog.api';
import type { Catalog } from '../interfaces/api';

export const getAllCatalogs = async (): Promise<Catalog[]> => {
  const data = await getCatalogs();
  return data.sort((a, b) => a.name.localeCompare(b.name));
};
