import { getCatalogs } from './catalog.api';
import type { Catalog } from './interfaces/catalog.interface';

export const getAllCatalogs = async (): Promise<Catalog[]> => {
  const data = await getCatalogs();
  return data.sort((a, b) => a.name.localeCompare(b.name));
};
