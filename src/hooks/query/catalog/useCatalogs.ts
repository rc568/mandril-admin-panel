import { getAllCatalogs } from '@/services/catalog/get-all-catalogs.action';
import { useQuery } from '@tanstack/react-query';
import { catalogsKeys } from './categories.keys';

export const useCatalogs = () => {
  return useQuery({
    queryKey: catalogsKeys.all,
    queryFn: getAllCatalogs,
    staleTime: 1000 * 60 * 60
  });
};
