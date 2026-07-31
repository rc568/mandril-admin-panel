import { getAllCatalogs } from '@/services/catalog/actions';
import { useQuery } from '@tanstack/react-query';
import { catalogsKeys } from './catalogs.keys';

export const useCatalogs = () => {
  return useQuery({
    queryKey: catalogsKeys.all,
    queryFn: getAllCatalogs,
    staleTime: 1000 * 60 * 60
  });
};
