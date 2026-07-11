import { getSearchProductVariants } from '../api/products.api';
import type { GetSearchProductVariantsApiResponse } from '../interfaces/api/get-search-product-variants.interface';
import type { GetSearchProductVariantsFilters } from '../interfaces/ui/get-search-product-variants-filters.interface';

export const getSearchProductVariantsAction = async (
  filters?: GetSearchProductVariantsFilters
): Promise<GetSearchProductVariantsApiResponse> => {
  const data = await getSearchProductVariants(filters);
  return data;
};
