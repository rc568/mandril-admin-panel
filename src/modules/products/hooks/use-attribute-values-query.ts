import { getAttributeValuesAction } from '@/services/attributes/actions';
import { useQuery } from '@tanstack/react-query';

export const useAttributeValuesQuery = (id: number) => {
  return {
    ...useQuery({
      queryKey: ['variantsAttributeValues', { id: id }],
      queryFn: () => getAttributeValuesAction(id),
      staleTime: 1000 * 60 * 5
    })
  };
};
