import { getSearchProductVariants } from '../api/products.api';
import type { GetSearchProductVariantsApiResponse, GetSearchProductVariantsQueryParams } from '../interfaces/api';

export const getSearchProductVariantsAction = async (
  filters?: GetSearchProductVariantsQueryParams
): Promise<GetSearchProductVariantsApiResponse> => {
  const data = await getSearchProductVariants(filters);
  return data;
};
