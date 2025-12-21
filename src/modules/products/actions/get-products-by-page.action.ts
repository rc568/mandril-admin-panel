import { getProducts } from '../api/products.api';
import type { GetProductsMapped } from '../interfaces/api/get-products-mapped.interface';
import type { GetProductsQueryParams } from '../interfaces/api/get-products.interface';

import { mapProductToDisplay } from '../mappers/get-products-by-page.mapper';

export const getProductsByPage = async (filters: GetProductsQueryParams): Promise<GetProductsMapped> => {
  const data = await getProducts(filters);
  const { pagination, products } = data;

  return {
    pagination,
    products: products.map((p) => mapProductToDisplay(p))
  };
};
