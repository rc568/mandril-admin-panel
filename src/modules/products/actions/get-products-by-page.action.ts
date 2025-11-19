import { productApi } from '../api/products.api';
import type { GetProductsMapped } from '../interfaces/get-products-mapped.interface';
import type { GetProductsApiResponse } from '../interfaces/get-products.interface';
import { mapProductToDisplay } from '../mappers/get-products-by-page.mapper';

export const getProductsByPage = async (page: number = 1, limit: number = 96): Promise<GetProductsMapped> => {
  const response = await productApi.get<GetProductsApiResponse>('/', {
    params: {
      limit: limit,
      page: page
    }
  });
  const { pagination, products } = response.data.data;

  return {
    pagination,
    products: products.map((p) => mapProductToDisplay(p))
  };
};
