import { getAttributes } from '@/services/attributes/api/attribute.api';
import { useQuery } from '@tanstack/react-query';
import { attributesKeys } from './attributes.keys';

export const useAttributes = () => {
  return useQuery({
    queryKey: attributesKeys.all,
    queryFn: getAttributes,
    staleTime: 1000 * 60 * 60
  });
};
