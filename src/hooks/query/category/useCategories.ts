import { getAllCategories } from '@/services/category/actions';
import { useQuery } from '@tanstack/react-query';
import { categoriesKeys } from './categories.keys';

export const useCategories = () => {
  return useQuery({
    queryKey: categoriesKeys.all,
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 60
  });
};
